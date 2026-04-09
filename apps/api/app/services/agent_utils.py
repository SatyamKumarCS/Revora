import os
import json
from pathlib import Path
from typing import List
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

# Load env explicitly from apps/api/.env so background tasks resolve keys consistently
ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_PATH)

class DomainDiscoverer:
    """
    Agentic utility for discovering company domains based on industry/product description.
    DESIGN PATTERN: Singleton
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DomainDiscoverer, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        api_key = os.getenv("OPENROUTER_API_KEY")
        self._llm = ChatOpenAI(
            model=os.getenv("LLM_MODEL", "anthropic/claude-3-haiku"),
            openai_api_key=api_key,
            openai_api_base="https://openrouter.ai/api/v1",
            temperature=0.2
        ) if api_key else None

    def discover_domains(self, industry: str, description: str, count: int = 5) -> List[str]:
        """Uses AI to identify real company domains matching the criteria."""
        if not self._llm:
            return []

        prompt = f"""
        Identify {count} real companies in the following niche and return only their primary domain names (e.g. stripe.com).
        IMPORTANT:
        - Return domains from different organizations (avoid one company only).
        - Prefer variety across company types/sizes in this niche.
        - Do not include duplicate or near-duplicate domains.
        NICHE: {industry}
        DESCRIPTION: {description}
        
        Respond only with a JSON list of strings.
        Example: ["domain1.com", "domain2.com"]
        """

        try:
            response = self._llm.invoke([
                SystemMessage(content="You are a market research assistant. You return only clean JSON lists of domain names."),
                HumanMessage(content=prompt)
            ])
            
            # Extract JSON from potential markdown blocks
            content = response.content.strip()
            if "```" in content:
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
            
            domains = json.loads(content)
            cleaned = [
                d.strip().replace("https://", "").replace("http://", "").split("/")[0].lower()
                for d in domains if isinstance(d, str)
            ]
            # Keep order while removing duplicates
            return list(dict.fromkeys([d for d in cleaned if d]))
        except Exception as e:
            print(f"Domain Discovery Error: {e}")
            return []
