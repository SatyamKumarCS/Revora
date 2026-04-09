import os
import json
from pathlib import Path
from difflib import SequenceMatcher
from typing import Dict, Optional, TypedDict, List
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END

# Load env explicitly from apps/api/.env so key resolution is stable in all run modes
ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_PATH)

class EmailState(TypedDict):
    """Internal state storage for the LangGraph workflow."""
    campaign_info: Dict
    icp_info: Optional[Dict]
    lead_info: Optional[Dict]
    tone: str
    goal: str
    value_props: str
    subject_format: str
    improve: bool
    previous_subject: str
    previous_body: str
    draft: str
    subject: str
    feedback: str
    open_rate: str
    sentiment_score: str
    iteration: int

class EmailGenerator:
    """
    Singleton service for generating hyper-personalized emails via OpenRouter.
    Uses LangGraph to orchastrate a multi-step agentic drafting process.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmailGenerator, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Standardizes LLM configuration and compiles the internal graph."""
        self._api_key = os.getenv("OPENROUTER_API_KEY")
        self._base_url = "https://openrouter.ai/api/v1"
        self._model_name = os.getenv("LLM_MODEL", "anthropic/claude-3-haiku")
        
        self._llm = None
        if self._api_key:
            self._llm = ChatOpenAI(
                api_key=self._api_key,
                base_url=self._base_url,
                model=self._model_name,
                default_headers={
                    "HTTP-Referer": "https://revora.ai",
                    "X-Title": "Revora SDR Engine"
                }
            )
        
        self._graph = self._build_graph()

    def _build_graph(self):
        """Constructs and compiles the StateGraph workflow."""
        workflow = StateGraph(EmailState)
        workflow.add_node("draft", self._draft_node)
        workflow.add_node("review", self._review_node)
        workflow.add_node("polish", self._polish_node)
        workflow.add_node("score", self._score_node)
        workflow.set_entry_point("draft")
        workflow.add_edge("draft", "review")
        workflow.add_edge("review", "polish")
        workflow.add_edge("polish", "score")
        workflow.add_edge("score", END)
        return workflow.compile()

    # ── Internal Graph Nodes ──

    def _draft_node(self, state: EmailState) -> EmailState:
        if not self._llm: return state
        lead = state.get('lead_info') or {}
        context = f"TARGET: {lead.get('first_name')} at {lead.get('company')} ({lead.get('job_title')})"
        improve_clause = ""
        if state.get("improve") and (state.get("previous_body") or state.get("previous_subject")):
            improve_clause = f"""
            IMPROVEMENT MODE: You are generating version {state.get('iteration', 1)}.
            PREVIOUS SUBJECT: {state.get('previous_subject', '')}
            PREVIOUS BODY: {state.get('previous_body', '')}

            Make this draft clearly better than the previous one:
            - stronger hook in first line
            - clearer and more specific CTA
            - tighter wording (fewer filler words)
            - improved personalization
            - avoid reusing the same sentence structure
            """
        prompt = f"""
        Draft a personalized outreach email.
        {context}
        PRODUCT: {state['campaign_info'].get('product_name')}
        DESC: {state['campaign_info'].get('product_description')}
        GOAL: {state['goal']}
        TONE: {state['tone']}
        SUBJECT FORMAT: {state['subject_format']}
        VALUE_PROPS: {state['value_props']}
        {improve_clause}
        
        Respond only in JSON with 'subject' and 'body'.
        """
        response = self._llm.invoke([
            SystemMessage(content="Professional SDR writer."),
            HumanMessage(content=prompt)
        ])
        try:
            data = self._extract_json_object(response.content)
            state['subject'] = data.get('subject', '')
            state['draft'] = data.get('body', '')
        except:
            state['draft'] = response.content
        return state

    def _review_node(self, state: EmailState) -> EmailState:
        if not self._llm: return state
        prompt = f"Review this draft for conversion: {state['draft']}"
        response = self._llm.invoke([HumanMessage(content=prompt)])
        state['feedback'] = response.content
        return state

    def _polish_node(self, state: EmailState) -> EmailState:
        if not self._llm: return state
        prompt = f"""
        Final polish based on feedback.
        FEEDBACK: {state['feedback']}
        ORIGINAL: {state['draft']}

        Return ONLY JSON with keys:
        - subject
        - body
        """
        response = self._llm.invoke([HumanMessage(content=prompt)])
        try:
            data = self._extract_json_object(response.content)
            state['subject'] = data.get('subject', state['subject'])
            state['draft'] = data.get('body', state['draft'])
        except: pass
        return state

    def _score_node(self, state: EmailState) -> EmailState:
        if not self._llm: return state
        prompt = f"""
        You are an email performance analyst.
        Estimate performance for this outreach draft.

        SUBJECT: {state.get('subject', '')}
        BODY: {state.get('draft', '')}

        Return ONLY JSON with exactly these keys:
        - open_rate (example: "42%")
        - sentiment_score (example: "8.7/10")

        Do not include any extra keys or explanation.
        """
        response = self._llm.invoke([HumanMessage(content=prompt)])
        try:
            data = self._extract_json_object(response.content)
            state['open_rate'] = self._first_non_empty(
                data.get('open_rate'),
                data.get('estimated_open_rate'),
                data.get('openRate'),
                state.get('open_rate'),
                '45%'
            )
            state['sentiment_score'] = self._first_non_empty(
                data.get('sentiment_score'),
                data.get('sentiment'),
                data.get('tone_score'),
                state.get('sentiment_score'),
                '9/10'
            )
        except:
            state['open_rate'] = self._first_non_empty(state.get('open_rate'), '45%')
            state['sentiment_score'] = self._first_non_empty(state.get('sentiment_score'), '9/10')
        return state

    @staticmethod
    def _similarity(a: str, b: str) -> float:
        if not a or not b:
            return 0.0
        return SequenceMatcher(None, a.strip().lower(), b.strip().lower()).ratio()

    def _force_improved_rewrite(self, state: EmailState) -> EmailState:
        if not self._llm:
            return state
        prompt = f"""
        Rewrite this email to be a clearly improved next version.

        PREVIOUS SUBJECT: {state.get('previous_subject', '')}
        PREVIOUS BODY: {state.get('previous_body', '')}

        CURRENT SUBJECT: {state.get('subject', '')}
        CURRENT BODY: {state.get('draft', '')}

        Requirements:
        - keep same intent, but make wording noticeably different
        - stronger opening line and CTA
        - concise and personalized

        Return ONLY JSON with keys: subject, body
        """
        try:
            response = self._llm.invoke([HumanMessage(content=prompt)])
            data = self._extract_json_object(response.content)
            state['subject'] = self._first_non_empty(data.get('subject'), state.get('subject'))
            state['draft'] = self._first_non_empty(data.get('body'), state.get('draft'))
        except Exception:
            pass
        return state

    @staticmethod
    def _extract_json_object(raw: str) -> Dict:
        text = (raw or "").strip()
        if text.startswith("```"):
            parts = text.split("```")
            if len(parts) >= 2:
                text = parts[1].strip()
                if text.lower().startswith("json"):
                    text = text[4:].strip()
        return json.loads(text)

    @staticmethod
    def _first_non_empty(*values: Optional[str]) -> str:
        for value in values:
            if isinstance(value, str) and value.strip():
                return value.strip()
        return ""

    # ── Public Interface ──

    def generate_personalized_email(
        self, 
        campaign_info: Dict, 
        icp_info: Optional[Dict], 
        lead_info: Optional[Dict] = None,
        tone: str = "Professional",
        goal: str = "",
        value_props: str = "",
        subject_format: str = "",
        improve: bool = False,
        iteration: int = 1,
        previous_subject: str = "",
        previous_body: str = "",
    ) -> Dict:
        """Main entry point to trigger the agentic generation graph."""
        if not self._llm:
            return self._generate_fallback(campaign_info, goal, tone, lead_info, subject_format)

        initial_state: EmailState = {
            "campaign_info": campaign_info,
            "icp_info": icp_info,
            "lead_info": lead_info,
            "tone": tone,
            "goal": goal or campaign_info.get("goal", ""),
            "value_props": value_props,
            "subject_format": subject_format,
            "improve": improve,
            "previous_subject": previous_subject,
            "previous_body": previous_body,
            "draft": "", "subject": "", "feedback": "", "open_rate": "", "sentiment_score": "", "iteration": iteration
        }

        try:
            final_state = self._graph.invoke(initial_state)

            if improve and previous_body:
                body_similarity = self._similarity(previous_body, final_state.get("draft", ""))
                subject_similarity = self._similarity(previous_subject, final_state.get("subject", "")) if previous_subject else 0.0
                if body_similarity >= 0.88 and subject_similarity >= 0.80:
                    final_state = self._force_improved_rewrite(final_state)

            return {
                "subject": self._first_non_empty(final_state.get("subject"), "Quick question"),
                "body": self._first_non_empty(final_state.get("draft"), "Hi there,"),
                "open_rate": self._first_non_empty(final_state.get("open_rate"), "35%"),
                "sentiment_score": self._first_non_empty(final_state.get("sentiment_score"), "8.0/10")
            }
        except Exception:
            return self._generate_fallback(campaign_info, goal, tone, lead_info, subject_format)

    def _generate_fallback(self, campaign: Dict, goal: str, tone: str, lead: Optional[Dict], subject_format: str) -> Dict:
        name = lead.get('first_name', 'there') if lead else 'there'
        company = lead.get('company', 'your company') if lead else 'your company'
        subject = subject_format.replace("{{company_name}}", company) if subject_format else f"Quick question for {company}"
        body = f"Hi {name},\n\nI noticed {company} is doing great work. We'd love to help with {goal}."
        return {"subject": subject, "body": body, "open_rate": "30%", "sentiment_score": "7/10"}
