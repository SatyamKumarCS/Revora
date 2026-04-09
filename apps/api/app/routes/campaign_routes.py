from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.campaign import Campaign
from app.models.icp_filter import ICP
from app.schemas.campaign_schema import CampaignCreate, CampaignStatusUpdate

router = APIRouter(prefix="/campaign", tags=["Campaign"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create")
def create_campaign(data: CampaignCreate, db: Session = Depends(get_db)):
    campaign = Campaign(
        campaign_name=data.campaign_name,
        product_name=data.product_name,
        product_description=data.product_description,
        goal=data.goal,
        lead_sources=data.lead_sources,
        lead_limit=data.lead_limit,
        status="active"
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return {"message": "Campaign created", "campaign_id": campaign.id}


@router.patch("/{campaign_id}/status")
def update_campaign_status(campaign_id: str, data: CampaignStatusUpdate, db: Session = Depends(get_db)):
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        return {"error": "Campaign not found"}
    campaign.status = data.status
    db.commit()
    return {"message": "Status updated", "status": campaign.status}


@router.get("/")
def get_campaigns(db: Session = Depends(get_db)):
    campaigns = db.query(Campaign).all()
    # Build set of campaign_ids that have an ICP filter
    icp_campaign_ids = {
        icp.campaign_id
        for icp in db.query(ICP.campaign_id).all()
    }
    return [
        {
            "id": c.id,
            "campaign_name": c.campaign_name,
            "product_name": c.product_name,
            "product_description": c.product_description,
            "goal": c.goal,
            "lead_sources": c.lead_sources,
            "lead_limit": c.lead_limit,
            "status": c.status or "active",
            "has_icp": c.id in icp_campaign_ids,
        }
        for c in campaigns
    ]