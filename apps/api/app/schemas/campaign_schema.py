from pydantic import BaseModel
from typing import List, Literal

class CampaignCreate(BaseModel):
    campaign_name: str
    product_name: str
    product_description: str
    goal: str
    lead_sources: List[str]
    lead_limit: int

class CampaignStatusUpdate(BaseModel):
    status: Literal["active", "paused", "archived"]

class CampaignResponse(BaseModel):
    id: str
    campaign_name: str
    product_name: str
    goal: str
    lead_sources: List[str]
    lead_limit: int
    status: str = "active"

    class Config:
        from_attributes = True