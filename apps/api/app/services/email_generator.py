import json
import logging
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Optional

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = "You are an expert SDR copywriter. Return only valid JSON with subject and body."


@dataclass
class EmailContext:
    campaign_info: Dict
    icp_info: Dict
    lead_info: Dict
    tone: str = "Professional"
    goal: str = ""
    value_props: str = ""
    subject_format: str = ""
    sender_name: str = "Revora Team"


class EmailParser:
    """Responsible for extracting structured email data from raw LLM output."""

    _STRIP_PREFIX = re.compile(r'^"?(subject|body)"?\s*:\s*"?', re.IGNORECASE)
    _SUBJECT_PATTERN = re.compile(r'"subject"\s*:\s*"([^"]+)"', re.IGNORECASE)
    _BODY_PATTERN = re.compile(r'"body"\s*:\s*"([\s\S]+?)"\s*[}\n]', re.IGNORECASE)
    _SUBJECT_PLAIN = re.compile(r"(?im)^\s*subject\s*:\s*(.+)$")
    _BODY_PLAIN = re.compile(r"(?is)\bbody\s*:\s*(.+)$")

    @classmethod
    def parse(cls, raw: str) -> Dict:
        text = (raw or "").strip()
        text = cls._strip_markdown_fence(text)

        try:
            return json.loads(text)
        except Exception:
            pass

        result = cls._try_extract_json_block(text) or cls._try_regex_json(text) or cls._try_regex_plain(text)
        if result:
            return result

        return cls._plain_text_fallback(text)

    @staticmethod
    def _strip_markdown_fence(text: str) -> str:
        if text.startswith("```"):
            parts = text.split("```")
            if len(parts) >= 2:
                inner = parts[1].strip()
                return inner[4:].strip() if inner.lower().startswith("json") else inner
        return text

    @staticmethod
    def _try_extract_json_block(text: str) -> Optional[Dict]:
        s, e = text.find("{"), text.rfind("}")
        if s != -1 and e > s:
            try:
                return json.loads(text[s : e + 1])
            except Exception:
                pass
        return None

    @classmethod
    def _try_regex_json(cls, text: str) -> Optional[Dict]:
        sm = cls._SUBJECT_PATTERN.search(text)
        bm = cls._BODY_PATTERN.search(text)
        if sm and bm:
            return {"subject": sm.group(1).strip(), "body": bm.group(1).strip()}
        return None

    @classmethod
    def _try_regex_plain(cls, text: str) -> Optional[Dict]:
        sm = cls._SUBJECT_PLAIN.search(text)
        bm = cls._BODY_PLAIN.search(text)
        if sm and bm:
            return {"subject": sm.group(1).strip(), "body": bm.group(1).strip()}
        return None

    @classmethod
    def _plain_text_fallback(cls, text: str) -> Dict:
        if not text:
            raise ValueError("LLM response is empty")
        lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
        lines = [ln for ln in lines if ln not in {"{", "}"}]
        if len(lines) >= 2:
            return {"subject": lines[0][:120].lstrip('"').rstrip('",'), "body": "\n".join(lines[1:]).strip()}
        return {"subject": "Quick idea", "body": text}


class EmailFormatter:
    """Responsible for cleaning and formatting parsed email fields."""

    _STRIP_KEY_PREFIX = re.compile(r'^"?(subject|body)"?\s*:\s*"?', re.IGNORECASE)
    _NAME_PLACEHOLDERS = ("[Your Name]", "<Your Name>", "{{name}}")

    @classmethod
    def clean(cls, value: str, sender_name: str) -> str:
        text = (value or "").replace("\r\n", "\n").replace("\r", "\n").strip()
        text = cls._STRIP_KEY_PREFIX.sub("", text).strip().strip('"')
        for placeholder in cls._NAME_PLACEHOLDERS:
            text = text.replace(placeholder, sender_name)
        return text

    @classmethod
    def format(cls, subject: str, body: str, sender_name: str) -> Dict:
        clean_subject = cls.clean(subject, sender_name)
        clean_body = cls.clean(body, sender_name)
        clean_body = cls._normalize_paragraphs(clean_body)
        clean_body = cls._ensure_signature(clean_body, sender_name)
        return {"subject": clean_subject, "body": clean_body}

    @staticmethod
    def _normalize_paragraphs(body: str) -> str:
        # Force newline after greeting: "Hi Name," -> "Hi Name,\n"
        body = re.sub(r"(Hi\s+\w+,)\s*", r"\1\n", body, count=1)

        # Force newline before "Thanks," signature block
        body = re.sub(r"\s*(Thanks,)\s*", r"\n\nThanks,\n", body, flags=re.IGNORECASE)

        lines = [line.strip() for line in body.split("\n") if line.strip()]

        if len(lines) < 2:
            return body

        # Separate greeting, body content, and signature
        greeting = lines[0] if re.match(r"^Hi\s+\w+,", lines[0], re.IGNORECASE) else None
        sig_start = next((i for i, l in enumerate(lines) if l.lower().startswith("thanks,")), None)

        body_lines = lines[1:sig_start] if greeting and sig_start else lines
        sig_lines = lines[sig_start:] if sig_start else []

        # Auto-split body content into paragraphs if it's one run-on block
        body_text = " ".join(body_lines)
        sentences = [s.strip() for s in re.split(r"(?<=[.?!])\s+", body_text) if s.strip()]

        if len(sentences) >= 4:
            mid = len(sentences) // 2
            para1 = " ".join(sentences[:mid])
            para2 = " ".join(sentences[mid:])
            body_text = f"{para1}\n\n{para2}"
        else:
            body_text = " ".join(sentences)

        parts = []
        if greeting:
            parts.append(greeting)
        parts.append(body_text)
        if sig_lines:
            parts.append("\n".join(sig_lines))

        return "\n\n".join(parts)

    @staticmethod
    def _ensure_signature(body: str, sender_name: str) -> str:
        lower = body.lower()
        if "thanks," not in lower:
            return body.rstrip() + f"\n\nThanks,\n{sender_name}"
        if sender_name.lower() not in lower:
            return body.rstrip() + f"\n{sender_name}"
        return body


class EmailGenerator:
    """Orchestrates LLM-based personalized cold email generation."""

    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY", "").strip()
        if not api_key:
            raise EnvironmentError("GROQ_API_KEY is not set.")

        self._llm = ChatOpenAI(
            api_key=api_key,
            base_url=os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1").strip().rstrip("/"),
            model=os.getenv("LLM_MODEL", "llama-3.3-70b-versatile").strip(),
        )
        self._parser = EmailParser()
        self._formatter = EmailFormatter()

    def generate_personalized_email(
        self,
        campaign_info: Dict,
        icp_info: Optional[Dict] = None,
        lead_info: Optional[Dict] = None,
        tone: str = "Professional",
        goal: str = "",
        value_props: str = "",
        subject_format: str = "",
        sender_name: str = "Revora Team",
        **_kwargs,
    ) -> Dict:
        context = EmailContext(
            campaign_info=campaign_info,
            icp_info=icp_info or {},
            lead_info=lead_info or {},
            tone=tone,
            goal=goal,
            value_props=value_props,
            subject_format=subject_format,
            sender_name=sender_name,
        )
        return self._generate(context)

    def _generate(self, ctx: EmailContext) -> Dict:
        try:
            prompt = self._build_prompt(ctx)
            raw = self._llm.invoke([
                SystemMessage(content=_SYSTEM_PROMPT),
                HumanMessage(content=prompt),
            ]).content
            data = EmailParser.parse(raw)
            result = EmailFormatter.format(
                subject=(data.get("subject") or "").strip(),
                body=(data.get("body") or "").strip(),
                sender_name=ctx.sender_name,
            )
            if not result.get("subject") or not result.get("body"):
                raise ValueError("Missing subject or body in LLM response")
            return result
        except Exception:
            logger.exception("Email generation failed")
            return {"error": "Email generation failed. Please try again."}

    @staticmethod
    def _build_prompt(ctx: EmailContext) -> str:
        lead = ctx.lead_info
        icp = ctx.icp_info
        first_name = lead.get("first_name") or "there"
        company = lead.get("company") or "your company"
        job_title = lead.get("job_title") or "your role"

        return f"""
        You are an elite B2B sales copywriter. Write one short, sharp, high-converting cold outreach email.

        === CONTEXT ===
        Recipient: {first_name}, {job_title} at {company}
        Industry: {icp.get('industry', '')}
        Our product: {ctx.campaign_info.get('product_name', '')}
        What it does: {ctx.campaign_info.get('product_description', '')}
        Goal of outreach: {ctx.goal or ctx.campaign_info.get('goal', '')}
        Tone: {ctx.tone}
        Subject format hint: {ctx.subject_format or 'None — be creative and specific'}
        Key value propositions: {ctx.value_props or 'derive from product description'}

        === RULES ===
        - The body MUST open with exactly: Hi {first_name},
        - Write 100-150 words total. Every sentence must earn its place.
        - Be specific. Reference {company} and {job_title} naturally — not generically.
        - The opener should show you understand their world (challenges, priorities, pressures of their role).
        - The value prop should feel like a direct solution to a real pain point — not a product pitch.
        - CTA must be low-friction: one question asking for 15 minutes, nothing more.
        - Sound like a smart human, not a sales bot. Avoid corporate filler like "I hope this finds you well", "I wanted to reach out", "leverage", "synergy", "streamline processes".
        - No markdown, no bullets, no emojis, no placeholders.
        - End with exactly:
          Thanks,
          {ctx.sender_name}

        Return only valid JSON:
        {{"subject": "...", "body": "..."}}
        """