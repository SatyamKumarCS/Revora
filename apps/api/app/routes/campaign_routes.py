from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel as PydanticBase

from app.db.database import SessionLocal
from app.models.campaign import Campaign
from app.models.icp_filter import ICP
from app.models.leads import Leads
from app.schemas.campaign_schema import CampaignCreate, CampaignStatusUpdate
from app.services.email_generator import EmailGenerator

# Initialize modern singleton service
email_gen = EmailGenerator()

router = APIRouter(prefix="/campaign", tags=["Campaign"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create")
def create_campaign(data: CampaignCreate, db: Session = Depends(get_db)):
    """Creates a new outreach campaign with initial settings."""
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
    return {"message": "Campaign created", "id": campaign.id, "campaign_id": campaign.id}

@router.patch("/{campaign_id}/status")
def update_campaign_status(campaign_id: str, data: CampaignStatusUpdate, db: Session = Depends(get_db)):
    """Updates the operational status of an existing campaign."""
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        return {"error": "Campaign not found"}
    campaign.status = data.status
    db.commit()
    return {"message": "Status updated", "status": campaign.status}

@router.get("/")
def get_campaigns(db: Session = Depends(get_db)):
    """Retrieves all campaigns with high-level ICP status."""
    campaigns = db.query(Campaign).all()
    icp_ids = {icp.campaign_id for icp in db.query(ICP.campaign_id).all()}
    lead_counts = {
        campaign_id: count
        for campaign_id, count in db.query(Leads.campaign_id, func.count(Leads.id)).group_by(Leads.campaign_id).all()
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
            "has_icp": c.id in icp_ids,
            "lead_count": lead_counts.get(c.id, 0),
        }
        for c in campaigns
    ]

# ── Email Generation Contract ──

class EmailGenerateRequest(PydanticBase):
    goal: str = ""
    tone: str = "Professional"
    value_props: str = ""
    subject_format: str = ""
    improve: bool = False
    iteration: int = 1
    previous_subject: str = ""
    previous_body: str = ""
    sender_name: str = "Revora Team"

@router.post("/{campaign_id}/generate-email")
def generate_email(campaign_id: str, data: EmailGenerateRequest, db: Session = Depends(get_db)):
    """Triggers the agentic generation flow for a campaign's personalized email."""
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        return {"error": "Campaign not found"}

    icp = db.query(ICP).filter(ICP.campaign_id == campaign_id).first()
    lead = db.query(Leads).filter(Leads.campaign_id == campaign_id).first()
    
    # Structure metadata for optimized LLM context
    campaign_info = {
        "product_name": campaign.product_name,
        "product_description": campaign.product_description,
        "goal": campaign.goal
    }
    icp_info = {"industry": icp.industry, "job_titles": icp.job_titles} if icp else None
    lead_info = {"first_name": lead.first_name, "company": lead.company, "job_title": lead.job_title} if lead else None

    return email_gen.generate_personalized_email(
        campaign_info=campaign_info,
        icp_info=icp_info,
        lead_info=lead_info,
        tone=data.tone,
        goal=data.goal,
        value_props=data.value_props,
        subject_format=data.subject_format,
        improve=data.improve,
        iteration=data.iteration,
        previous_subject=data.previous_subject,
        previous_body=data.previous_body,
        sender_name=data.sender_name,
    )