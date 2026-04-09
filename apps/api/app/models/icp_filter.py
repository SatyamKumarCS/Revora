from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from app.db.base import Base

class ICP(Base):
    """
    Ideal Customer Profile (ICP) filter settings for a campaign.
    Standardized with inheritance for professional data management.
    """
    __tablename__ = "icp_filters"

    campaign_id: Mapped[str] = mapped_column(String)
    industry: Mapped[str] = mapped_column(String)
    location: Mapped[str] = mapped_column(String)
    company_size: Mapped[str] = mapped_column(String)
    job_titles: Mapped[str] = mapped_column(String)
    target_domain: Mapped[str] = mapped_column(String, nullable=True)