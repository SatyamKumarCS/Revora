from typing import Optional, List
from app.services.lead_generation_strategy import (
    LeadGenerationStrategy,
    ApolloLeadStrategy,
    LinkedInLeadStrategy,
    HunterLeadStrategy,
    CompositeLeadStrategy
)

class LeadGeneratorFactory:
    """
    Factory for retrieving lead generation strategies.
    DESIGN PATTERN: Factory
    """
    
    @staticmethod
    def get_strategy(source_name: str) -> Optional[LeadGenerationStrategy]:
        """Returns a single strategy based on name."""
        name = source_name.lower().strip()
        normalized = name.replace(".io", "")
        
        if normalized == "apollo":
            return ApolloLeadStrategy()
        elif normalized == "linkedin":
            return LinkedInLeadStrategy()
        elif normalized == "hunter":
            return HunterLeadStrategy()
        return None

    @staticmethod
    def get_composite_strategy(sources: List[str]) -> LeadGenerationStrategy:
        """Returns a Composite strategy combining multiple sources."""
        strategies = []
        for src in sources:
            strat = LeadGeneratorFactory.get_strategy(src)
            if strat:
                strategies.append(strat)
        
        # Default to Hunter if none found or explicit
        if not strategies:
            strategies = [HunterLeadStrategy()]
            
        return CompositeLeadStrategy(strategies)
