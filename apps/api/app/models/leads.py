from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from app.db.base import Base

class Leads(Base):
    """
    Lead model representing a prospect captured in a campaign.
    Standardized via Base inheritance and modern SQLAlchemy types.
    """
    __tablename__ = "leads"

    campaign_id: Mapped[str] = mapped_column(String)
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)
    email: Mapped[str] = mapped_column(String)
    company: Mapped[str] = mapped_column(String)
    job_title: Mapped[str] = mapped_column(String)
    linkedin: Mapped[str] = mapped_column(String)
