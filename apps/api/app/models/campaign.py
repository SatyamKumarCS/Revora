import uuid
from sqlalchemy import Column, String, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class Campaign(Base):
    __tablename__="campaign"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    campaign_name = Column(String)
    product_name = Column(String)
    product_description = Column(String)
    goal = Column(String)
    lead_sources = Column(JSON, default=list)
    lead_limit = Column(Integer)
    status = Column(String, default="active")