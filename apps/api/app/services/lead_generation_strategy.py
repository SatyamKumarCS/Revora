import os
import requests
from abc import ABC, abstractmethod
from typing import List, Dict

from app.services.apollo_adapter import ApolloAdapter

class LeadGenerationStrategy(ABC):
    """
    DESIGN PATTERN: Strategy Pattern
    
    OOP CONCEPTS: Abstraction, Polymorphism
    """
    
    @abstractmethod
    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        pass


class ApolloLeadStrategy(LeadGenerationStrategy):
    """
    Concrete Strategy for generating leads using the Apollo API.
    """
    def __init__(self):
        self.api_key = os.getenv("APOLLO_API_KEY")
        self.url = "https://api.apollo.io/v1/mixed_people/search"
        self.adapter = ApolloAdapter()

    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        if not self.api_key:
            print("Warning: APOLLO_API_KEY is not set.")
            return []

        payload = {
            "api_key": self.api_key,
            "q_organization_industries": [icp.industry] if hasattr(icp, 'industry') and icp.industry else [],
            "person_titles": [icp.job_titles] if hasattr(icp, 'job_titles') and icp.job_titles else [],
            "q_organization_locations": [icp.location] if hasattr(icp, 'location') and icp.location else [],
            "page": 1,
            "per_page": limit
        }

        try:
            response = requests.post(self.url, json=payload)
            if response.status_code != 200:
                print(f"Apollo API Error {response.status_code}: {response.text}")
                return []
            
            data = response.json()
        except Exception as e:
            print(f"Error calling Apollo API: {e}")
            return []

        leads = []
        for person in data.get("people", []):
            # Using the Adapter to normalize the data
            normalized_lead = self.adapter.normalize_lead_data(person)
            leads.append(normalized_lead)

        return leads


class LinkedInLeadStrategy(LeadGenerationStrategy):
    """
    Another Concrete Strategy example for generating leads.
    """
    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        # Dummy implementation returning fake data to demonstrate polymorphic behavior!
        print(f"Executing LinkedIn strategy for {limit} leads...")
        return [
            {
                "first_name": "John",
                "last_name": "LinkedInDoe",
                "email": "john.doe@linkedin-fake.com",
                "company": "LinkedIn Test Org",
                "job_title": "CTO",
                "linkedin": "https://linkedin.com/in/johndoe"
            }
        ]

class HunterLeadStrategy(LeadGenerationStrategy):
    """
    Concrete Strategy for generating leads using the Hunter.io API.
    Searches multiple company domains based on the ICP industry to return
    leads from different organizations in the same industry.
    """

    # Industry keyword → list of company domains to search
    INDUSTRY_DOMAINS = {
        "edtech": ["coursera.org", "udemy.com", "duolingo.com", "chegg.com", "kahoot.com"],
        "fintech": ["stripe.com", "plaid.com", "brex.com", "chime.com", "robinhood.com"],
        "saas": ["notion.so", "loom.com", "figma.com", "miro.com", "airtable.com"],
        "ecommerce": ["shopify.com", "bigcommerce.com", "klaviyo.com", "gorgias.com", "recharge.com"],
        "healthtech": ["zocdoc.com", "hims.com", "ro.co", "veeva.com", "doximity.com"],
        "marketing": ["hubspot.com", "mailchimp.com", "semrush.com", "hootsuite.com", "sprinklr.com"],
        "hr": ["lattice.com", "rippling.com", "workday.com", "greenhouse.io", "lever.co"],
        "cybersecurity": ["crowdstrike.com", "sentinelone.com", "darktrace.com", "lacework.com", "snyk.io"],
        "ai": ["openai.com", "cohere.com", "scale.com", "huggingface.co", "weights.gg"],
        "logistics": ["flexport.com", "shipbob.com", "transfix.com", "project44.com", "loadsmart.com"],
        "real estate": ["opendoor.com", "compass.com", "buildium.com", "procore.com", "matterport.com"],
        "software": ["gitlab.com", "atlassian.com", "jetbrains.com", "hashicorp.com", "datadog.com"],
    }

    def __init__(self):
        self.api_key = os.getenv("HUNTER_API_KEY")
        self.url = "https://api.hunter.io/v2/domain-search"

    def _get_domains_for_industry(self, industry: str) -> List[str]:
        """Find relevant domains for the given industry keyword."""
        if not industry:
            return ["stripe.com"]
        industry_lower = industry.lower().strip()
        # Exact match first
        if industry_lower in self.INDUSTRY_DOMAINS:
            return self.INDUSTRY_DOMAINS[industry_lower]
        # Partial match fallback
        for key, domains in self.INDUSTRY_DOMAINS.items():
            if key in industry_lower or industry_lower in key:
                return domains
        # No match — use industry as a domain guess (e.g. "acme.com")
        print(f"No industry mapping found for '{industry}', falling back to raw value.")
        return [industry_lower if "." in industry_lower else f"{industry_lower.replace(' ', '')}.com"]

    def _search_domain(self, domain: str, per_domain_limit: int) -> List[Dict]:
        """Search Hunter for a single domain and return normalized leads."""
        params = {
            "domain": domain,
            "api_key": self.api_key,
            "limit": per_domain_limit,
        }
        try:
            response = requests.get(self.url, params=params, timeout=15)
            if response.status_code != 200:
                print(f"Hunter API Error for {domain} — {response.status_code}: {response.text[:200]}")
                return []
            data = response.json().get("data", {})
            org_name = data.get("organization") or domain
            leads = []
            for person in data.get("emails", []):
                leads.append({
                    "first_name": person.get("first_name") or "",
                    "last_name": person.get("last_name") or "",
                    "email": person.get("value") or "",
                    "company": org_name,
                    "job_title": person.get("position") or "Employee",
                    "linkedin": person.get("linkedin") or "",
                })
            return leads
        except Exception as e:
            print(f"Error fetching Hunter leads for {domain}: {e}")
            return []

    def generate_leads(self, icp, limit: int = 50) -> List[Dict]:
        if not self.api_key:
            print("Warning: HUNTER_API_KEY is not set.")
            return []

        industry = getattr(icp, 'industry', None) or ""
        domains = self._get_domains_for_industry(industry)

        # Spread the limit evenly across domains (max 10 per domain on free plan)
        per_domain = max(1, min(10, limit // len(domains)))
        print(f"Hunter: searching {len(domains)} domains for industry='{industry}', {per_domain} leads/domain")

        all_leads = []
        for domain in domains:
            if len(all_leads) >= limit:
                break
            leads = self._search_domain(domain, per_domain)
            all_leads.extend(leads)
            print(f"  → {domain}: fetched {len(leads)} leads")

        return all_leads[:limit]
