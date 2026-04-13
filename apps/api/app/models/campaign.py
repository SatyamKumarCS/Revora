from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer, JSON
from app.db.base import Base

class Campaign(Base):
    """
    Campaign model representing a marketing outreach effort.
    Inherits structured audit fields from Base.
    """
    __tablename__ = "campaign"

    campaign_name: Mapped[str] = mapped_column(String)
    product_name: Mapped[str] = mapped_column(String)
    product_description: Mapped[str] = mapped_column(String)
    goal: Mapped[str] = mapped_column(String)
    lead_sources: Mapped[list] = mapped_column(JSON, default=list)
    lead_limit: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String, default="active")
    user_id: Mapped[str] = mapped_column(String, index=True, nullable=True)