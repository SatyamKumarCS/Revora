from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.campaign import Campaign
from app.models.icp_filter import ICP
from app.models.leads import Leads as Lead
from app.services.lead_factory import LeadGeneratorFactory
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/campaign", tags=["Leads"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def process_leads_background(campaign_id: str):
    """
    Background worker that executes lead generation via a Composite Strategy.
    Orchestrates multiple sources (Apollo, Hunter, etc.) based on campaign settings.
    """
    db = SessionLocal()
    try:
        campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
        icp = db.query(ICP).filter(ICP.campaign_id == campaign_id).first()

        if not campaign or not icp:
            return

        # Use the Composite Design Pattern to aggregate from selected sources
        sources = campaign.lead_sources if campaign.lead_sources else ["Hunter"]
        source_tokens = {str(s).strip().lower().replace(".io", "") for s in sources}
        strategy = LeadGeneratorFactory.get_composite_strategy(sources)
        
        # Agentic Upgrade: If Hunter is active, discover real domains first
        if "hunter" in source_tokens:
            from app.services.agent_utils import DomainDiscoverer
            discoverer = DomainDiscoverer()
            desired_domain_count = max(5, min(20, campaign.lead_limit))
            discovered = discoverer.discover_domains(
                industry=icp.industry, 
                description=f"{campaign.product_name}: {campaign.product_description}",
                count=desired_domain_count,
            )
            # Inject discovered domains into the ICP object for the strategy to pick up
            icp.discovered_domains = discovered
            print(f"🤖 Agentic Discovery found domains: {discovered}")

        leads = strategy.generate_leads(icp, campaign.lead_limit)

        for lead_data in leads:
            new_lead = Lead(
                campaign_id=campaign_id,
                first_name=lead_data.get("first_name", ""),
                last_name=lead_data.get("last_name", ""),
                email=lead_data.get("email", ""),
                company=lead_data.get("company", ""),
                job_title=lead_data.get("job_title", ""),
                linkedin=lead_data.get("linkedin", "")
            )
            db.add(new_lead)
        
        db.commit()
    except Exception as e:
        print(f"Error in background lead generation: {e}")
        db.rollback()
    finally:
        db.close()

@router.post("/{campaign_id}/generate-leads")
def generate_leads(campaign_id: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Initiates an asynchronous lead generation task for a campaign."""
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.user_id == str(current_user.id)).first()
    if not campaign:
        return {"error": "Campaign not found"}

    background_tasks.add_task(process_leads_background, campaign_id)
    return {"message": "Generation started", "status": "processing"}

@router.get("/{campaign_id}/leads")
def get_leads(campaign_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetches all leads currently stored for a specific campaign securely."""
    return db.query(Lead).join(Campaign).filter(Lead.campaign_id == campaign_id, Campaign.user_id == str(current_user.id)).all()

@router.get("/all-leads")
def get_all_leads(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetches all leads across all campaigns owned by the requesting user."""
    # Importing Campaign locally to avoid circular imports if any, though it's at the top.
    from app.models.campaign import Campaign
    results = db.query(Lead, Campaign.campaign_name).outerjoin(Campaign, Lead.campaign_id == Campaign.id).filter(Campaign.user_id == str(current_user.id)).all()
    
    return [
        {
            "id": lead.id,
            "campaign_id": lead.campaign_id,
            "campaign": campaign_name or "Unknown Campaign",
            "name": f"{lead.first_name} {lead.last_name}".strip() or "Unnamed Lead",
            "email": lead.email,
            "company": lead.company,
            "job_title": lead.job_title,
            "linkedin": lead.linkedin
        }
        for lead, campaign_name in results
    ]