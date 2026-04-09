import math
import os
import re
import requests
from abc import ABC, abstractmethod
from typing import Dict, List, Optional


class LeadGenerationStrategy(ABC):
    """Abstract base for all lead generation strategies (Strategy Pattern)."""

    @abstractmethod
    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        pass


class ApolloLeadStrategy(LeadGenerationStrategy):
    """Fetches leads from the Apollo.io People Search API."""

    _URL = "https://api.apollo.io/v1/mixed_people/search"

    def __init__(self):
        self._api_key = os.getenv("APOLLO_API_KEY")

    def generate_leads(self, icp, limit: int = 10) -> List[Dict]:
        if not self._api_key:
            return []

        payload = {
            "api_key": self._api_key,
            "q_organization_industries": [icp.industry] if getattr(icp, "industry", None) else [],
            "person_titles": [icp.job_titles] if getattr(icp, "job_titles", None) else [],
            "q_organization_locations": [icp.location] if getattr(icp, "location", None) else [],
            "page": 1,
            "per_page": limit,
        }

        try:
            response = requests.post(self._URL, json=payload, timeout=15)
            if response.status_code != 200:
                return []
            return [self._normalize(p) for p in response.json().get("people", [])]
        except Exception:
            return []

    @staticmethod
    def _normalize(person: Dict) -> Dict:
        return {
            "first_name": person.get("first_name", ""),
            "last_name": person.get("last_name", ""),
            "email": person.get("email", ""),
            "company": person.get("organization", {}).get("name", ""),
            "job_title": person.get("title", ""),
            "linkedin": person.get("linkedin_url", ""),
        }


class HunterLeadStrategy(LeadGenerationStrategy):
    """Fetches leads from Hunter.io Domain Search API."""

    _URL = "https://api.hunter.io/v2/domain-search"
    _DOMAIN_PATTERN = re.compile(r"^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$")

    def __init__(self):
        self._api_key = os.getenv("HUNTER_API_KEY")

    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        if not self._api_key:
            return []

        domains = self._resolve_domains(icp)
        if not domains:
            return []

        per_domain_cap = max(1, math.ceil(limit / len(domains)))
        all_leads: List[Dict] = []
        seen_emails: set = set()

        for domain in domains:
            if len(all_leads) >= limit:
                break
            leads = self._fetch_domain(domain, min(per_domain_cap, limit - len(all_leads)))
            for lead in leads:
                email = lead.get("email")
                if email and email not in seen_emails:
                    all_leads.append(lead)
                    seen_emails.add(email)

        return all_leads[:limit]

    def _resolve_domains(self, icp) -> List[str]:
        domains = list(getattr(icp, "discovered_domains", []) or [])
        if target := getattr(icp, "target_domain", None):
            domains.append(target)
        if not domains:
            domains = self._discover_domains(icp)
        return [d for d in dict.fromkeys(self._clean_domain(d) for d in domains) if self._is_valid_domain(d)]

    def _fetch_domain(self, domain: str, limit: int) -> List[Dict]:
        try:
            response = requests.get(
                self._URL,
                params={"domain": domain, "api_key": self._api_key, "limit": limit},
                timeout=15,
            )
            if response.status_code != 200:
                return []
            data = response.json().get("data", {})
            return [
                {
                    "first_name": p.get("first_name") or "",
                    "last_name": p.get("last_name") or "",
                    "email": p.get("value", ""),
                    "company": data.get("organization") or domain,
                    "job_title": p.get("position") or "Employee",
                    "linkedin": p.get("linkedin") or "",
                }
                for p in data.get("emails", [])
                if p.get("value")
            ]
        except Exception:
            return []

    @staticmethod
    def _discover_domains(icp) -> List[str]:
        try:
            from app.services.agent_utils import DomainDiscoverer
            discoverer = DomainDiscoverer()
            industry = getattr(icp, "industry", "") or ""
            description = (
                f"Industry: {industry}; "
                f"Location: {getattr(icp, 'location', '')}; "
                f"Company size: {getattr(icp, 'company_size', '')}; "
                f"Roles: {getattr(icp, 'job_titles', '')}"
            )
            return discoverer.discover_domains(industry=industry, description=description)
        except Exception:
            return []

    @staticmethod
    def _clean_domain(domain: str) -> str:
        return str(domain).strip().replace("https://", "").replace("http://", "").split("/")[0].lower()

    @classmethod
    def _is_valid_domain(cls, domain: str) -> bool:
        return bool(domain and cls._DOMAIN_PATTERN.match(domain))


class LinkedInLeadStrategy(LeadGenerationStrategy):
    """Stub strategy for LinkedIn lead generation."""

    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        return [{
            "first_name": "Sample",
            "last_name": "Lead",
            "email": "sample@example.com",
            "company": "Tech Corp",
            "job_title": "CTO",
            "linkedin": "https://linkedin.com/sample",
        }]


class CompositeLeadStrategy(LeadGenerationStrategy):
    """Aggregates leads from multiple strategies, deduplicating by email (Composite Pattern)."""

    def __init__(self, strategies: List[LeadGenerationStrategy]):
        self._strategies = strategies

    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        per_strategy = limit // len(self._strategies) if self._strategies else limit
        all_leads: List[Dict] = []
        seen_emails: set = set()

        for strategy in self._strategies:
            for lead in strategy.generate_leads(icp, per_strategy):
                email = lead.get("email")
                if email and email not in seen_emails:
                    all_leads.append(lead)
                    seen_emails.add(email)
                if len(all_leads) >= limit:
                    return all_leads

        return all_leads[:limit]
