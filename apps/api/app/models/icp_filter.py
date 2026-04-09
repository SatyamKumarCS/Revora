import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class ICP(Base):
    __tablename__ = "icp_filters"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    campaign_id = Column(String)

    industry = Column(String)
    location = Column(String)
    company_size = Column(String)
    job_titles = Column(String)
    target_domain = Column(String, nullable=True)