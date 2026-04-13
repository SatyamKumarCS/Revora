import uuid
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    company_name = Column(String)
    role = Column(String)
    
    # Gmail Integration
    google_access_token = Column(String, nullable=True)
    google_refresh_token = Column(String, nullable=True)
    token_expiry = Column(String, nullable=True)
    connected_email = Column(String, nullable=True)