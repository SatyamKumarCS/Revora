import json
import os
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / ".env")


class DomainDiscoverer:
    """Singleton that uses an LLM to discover company domains for a given industry (Singleton Pattern)."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        api_key = os.getenv("GROQ_API_KEY", "").strip()
        self._llm = (
            ChatOpenAI(
                api_key=api_key,
                base_url=os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1").strip().rstrip("/"),
                model=os.getenv("LLM_MODEL", "llama-3.3-70b-versatile").strip(),
                temperature=0.2,
            )
            if api_key
            else None
        )

    def discover_domains(self, industry: str, description: str, count: int = 5) -> List[str]:
        if not self._llm:
            return []

        prompt = f"""
        Identify {count} real companies in the following niche and return only their primary domain names (e.g. stripe.com).
        - Return domains from different organizations.
        - Prefer variety across company types and sizes.
        - Do not return duplicates.
        NICHE: {industry}
        DESCRIPTION: {description}
        Respond only with a JSON list of strings. Example: ["domain1.com", "domain2.com"]
        """

        try:
            response = self._llm.invoke([
                SystemMessage(content="You are a market research assistant. Return only clean JSON lists of domain names."),
                HumanMessage(content=prompt),
            ])
            content = response.content.strip()
            if "```" in content:
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
            domains = json.loads(content)
            cleaned = [
                d.strip().replace("https://", "").replace("http://", "").split("/")[0].lower()
                for d in domains
                if isinstance(d, str)
            ]
            return list(dict.fromkeys(d for d in cleaned if d))
        except Exception as e:
            print(f"Domain Discovery Error: {e}")
            return []
