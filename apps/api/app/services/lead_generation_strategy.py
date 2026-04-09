import os
import requests
import re
import math
from abc import ABC, abstractmethod
from typing import List, Dict, Optional

class LeadGenerationStrategy(ABC):
    """
    Abstract Base Class for lead generation strategies.
    DESIGN PATTERN: Strategy (Interface)
    """
    @abstractmethod
    def generate_leads(self, icp: any, limit: int = 50) -> List[Dict]:
        """Generates leads based on ICP criteria."""
        pass

class ApolloLeadStrategy(LeadGenerationStrategy):
    """Lead generation using the Apollo.io API."""
    def __init__(self):
        self._api_key = os.getenv("APOLLO_API_KEY")
        self._url = "https://api.apollo.io/v1/mixed_people/search"

    def generate_leads(self, icp, limit: int = 10) -> List[Dict]:
        if not self._api_key:
            return []

        payload = {
            "api_key": self._api_key,
            "q_organization_industries": [icp.industry] if hasattr(icp, 'industry') and icp.industry else [],
            "person_titles": [icp.job_titles] if hasattr(icp, 'job_titles') and icp.job_titles else [],
            "q_organization_locations": [icp.location] if hasattr(icp, 'location') and icp.location else [],
            "page": 1,
            "per_page": limit
        }

        try:
            response = requests.post(self._url, json=payload, timeout=15)
            if response.status_code != 200:
                return []
            
            data = response.json()
            leads = []
            for person in data.get("people", []):
                leads.append({
                    "first_name": person.get("first_name", ""),
                    "last_name": person.get("last_name", ""),
                    "email": person.get("email", ""),
                    "company": person.get("organization", {}).get("name", ""),
                    "job_title": person.get("title", ""),
                    "linkedin": person.get("linkedin_url", "")
                })
            return leads
        except Exception:
            return []

class HunterLeadStrategy(LeadGenerationStrategy):
    """Lead generation using the Hunter.io API (Domain Search)."""
    def __init__(self):
        self._api_key = os.getenv("HUNTER_API_KEY")
        self._url = "https://api.hunter.io/v2/domain-search"

    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        if not self._api_key:
            return []
        
        # Priority 1: LLM discovered domains
        # Priority 2: Explicit target domain from ICP
        # Priority 3: Dynamic domain discovery from ICP industry context
        domains = list(getattr(icp, 'discovered_domains', []) or [])
        target_domain = getattr(icp, 'target_domain', None)
        if target_domain:
            domains.append(target_domain)

        if not domains:
            domains.extend(self._discover_domains_from_icp(icp))

        domains = [d for d in map(self._clean_domain, domains) if self._is_valid_domain(d)]
        domains = list(dict.fromkeys(domains))
        if not domains:
            print("Hunter Strategy: no valid domains available from ICP/industry discovery")
            return []
        
        all_leads = []
        seen_emails = set()
        # Ensure we don't overfill from the first domain (e.g., only coursera.org)
        per_domain_cap = max(1, math.ceil(limit / max(len(domains), 1)))

        for domain in domains:
            if len(all_leads) >= limit:
                break

            # Clean domain
            clean_domain = self._clean_domain(domain)
            remaining = limit - len(all_leads)
            fetch_limit = min(per_domain_cap, remaining)
            params = {"domain": clean_domain, "api_key": self._api_key, "limit": fetch_limit}
            
            try:
                response = requests.get(self._url, params=params, timeout=15)
                if response.status_code != 200:
                    continue
                
                data = response.json().get("data", {})
                emails = data.get("emails", [])
                domain_added = 0
                for person in emails:
                    email = person.get("value")
                    if email and email not in seen_emails:
                        all_leads.append({
                            "first_name": person.get("first_name") or "",
                            "last_name": person.get("last_name") or "",
                            "email": email,
                            "company": data.get("organization") or clean_domain,
                            "job_title": person.get("position") or "Employee",
                            "linkedin": person.get("linkedin") or ""
                        })
                        seen_emails.add(email)
                        domain_added += 1
                    
                    if len(all_leads) >= limit or domain_added >= per_domain_cap:
                        break
            except Exception as e:
                print(f"Hunter Strategy Error for {clean_domain}: {e}")
                
        return all_leads[:limit]

    @staticmethod
    def _clean_domain(domain: str) -> str:
        return str(domain).strip().replace("https://", "").replace("http://", "").split("/")[0].lower()

    @staticmethod
    def _is_valid_domain(domain: str) -> bool:
        if not domain:
            return False
        pattern = r"^(?!-)[a-z0-9-]+(\.[a-z0-9-]+)+$"
        return bool(re.match(pattern, domain))

    @staticmethod
    def _discover_domains_from_icp(icp) -> List[str]:
        try:
            from app.services.agent_utils import DomainDiscoverer
            discoverer = DomainDiscoverer()
            industry = getattr(icp, 'industry', '') or ''
            location = getattr(icp, 'location', '') or ''
            company_size = getattr(icp, 'company_size', '') or ''
            job_titles = getattr(icp, 'job_titles', '') or ''
            description = f"Industry: {industry}; Location: {location}; Company size: {company_size}; Roles: {job_titles}"
            return discoverer.discover_domains(industry=industry, description=description)
        except Exception as e:
            print(f"Hunter Strategy domain discovery error: {e}")
            return []

class LinkedInLeadStrategy(LeadGenerationStrategy):
    """Mock strategy for LinkedIn lead generation."""
    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        return [{
            "first_name": "Sample",
            "last_name": "Lead",
            "email": "sample@example.com",
            "company": "Tech Corp",
            "job_title": "CTO",
            "linkedin": "https://linkedin.com/sample"
        }]

class CompositeLeadStrategy(LeadGenerationStrategy):
    """
    Composite strategy that aggregates leads from multiple sources.
    DESIGN PATTERN: Composite
    """
    def __init__(self, strategies: List[LeadGenerationStrategy]):
        self._strategies = strategies

    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        all_leads = []
        seen_emails = set()
        
        # Divide limit across strategies
        limit_per_strat = limit // len(self._strategies) if self._strategies else limit
        
        for strategy in self._strategies:
            leads = strategy.generate_leads(icp, limit_per_strat)
            for lead in leads:
                email = lead.get("email")
                if email and email not in seen_emails:
                    all_leads.append(lead)
                    seen_emails.add(email)
                
                if len(all_leads) >= limit:
                    break
            
            if len(all_leads) >= limit:
                break
                
        return all_leads[:limit]
