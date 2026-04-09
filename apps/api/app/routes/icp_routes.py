from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.icp_filter import ICP
from app.schemas.icp_schema import ICPCreate

router = APIRouter(prefix="/icp", tags=["ICP"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create")
def create_icp(data: ICPCreate, db: Session = Depends(get_db)):
    clean_domain = (data.target_domain or "").strip().lower()
    if clean_domain:
        clean_domain = clean_domain.replace("https://", "").replace("http://", "").split("/")[0]

    icp = db.query(ICP).filter(ICP.campaign_id == data.campaign_id).first()
    if icp:
        icp.industry = data.industry
        icp.location = data.location
        icp.company_size = data.company_size
        icp.job_titles = data.job_titles
        icp.target_domain = clean_domain or None
    else:
        icp = ICP(
            campaign_id=data.campaign_id,
            industry=data.industry,
            location=data.location,
            company_size=data.company_size,
            job_titles=data.job_titles,
            target_domain=clean_domain or None
        )
        db.add(icp)

    db.commit()

    return {"message": "ICP saved"}