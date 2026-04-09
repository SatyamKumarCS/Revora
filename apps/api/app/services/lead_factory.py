from typing import List

from app.services.lead_generation_strategy import (
    ApolloLeadStrategy,
    CompositeLeadStrategy,
    HunterLeadStrategy,
    LeadGenerationStrategy,
    LinkedInLeadStrategy,
)

_STRATEGY_MAP = {
    "apollo": ApolloLeadStrategy,
    "hunter": HunterLeadStrategy,
    "linkedin": LinkedInLeadStrategy,
}


class LeadGeneratorFactory:
    """Factory for composing lead generation strategies (Factory Pattern)."""

    @staticmethod
    def get_strategy(source: str) -> LeadGenerationStrategy:
        key = source.lower().strip().replace(".io", "")
        cls = _STRATEGY_MAP.get(key)
        return cls() if cls else HunterLeadStrategy()

    @staticmethod
    def get_composite_strategy(sources: List[str]) -> LeadGenerationStrategy:
        strategies = [LeadGeneratorFactory.get_strategy(s) for s in sources]
        return CompositeLeadStrategy(strategies or [HunterLeadStrategy()])
