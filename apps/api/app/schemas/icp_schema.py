from pydantic import BaseModel

class ICPCreate(BaseModel):
    campaign_id: str
    industry: str
    location: str
    company_size: str
    job_titles: str
    target_domain: str | None = None

class ICPResponse(BaseModel):
    id: str
    campaign_id: str
    industry: str
    location: str
    company_size: str
    job_titles: str
    target_domain: str | None = None

    class Config:
        from_attributes = True