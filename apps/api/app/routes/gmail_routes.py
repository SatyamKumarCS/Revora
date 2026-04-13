import os
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import base64
from email.message import EmailMessage
from pydantic import BaseModel

from app.db.database import SessionLocal
from app.models.user import User
from app.models.leads import Leads
from app.models.campaign import Campaign

router = APIRouter(prefix="/gmail", tags=["Gmail Integration"])

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/gmail/callback")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.core.dependencies import get_current_user

@router.get("/auth")
def gmail_auth():
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Google Client credentials not configured in .env")
        
    client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "project_id": "revora-demo",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uris": [GOOGLE_REDIRECT_URI]
        }
    }
    
    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI
    )
    
    auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline')
    return RedirectResponse(auth_url)

@router.get("/callback")
def gmail_callback(request: Request, code: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    client_config = {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "project_id": "revora-demo",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uris": [GOOGLE_REDIRECT_URI]
        }
    }
    
    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI
    )
    
    try:
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        current_user.google_access_token = credentials.token
        current_user.google_refresh_token = credentials.refresh_token
        current_user.token_expiry = credentials.expiry.isoformat() if credentials.expiry else None
        current_user.connected_email = "connected-via-oauth@gmail.com" # Mocked, needs additional scope to fetch actual email
        
        db.commit()
        # In a real app we redirect back to the frontend settings page
        return RedirectResponse("http://localhost:3000/dashboard/leads?gmail_connected=true")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth Flow Failed: {e}")

class CampaignEmailPayload(BaseModel):
    subject: str
    html_body: str

@router.post("/send-campaign/{campaign_id}")
def send_campaign_emails(campaign_id: str, payload: CampaignEmailPayload, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.google_access_token:
        raise HTTPException(status_code=400, detail="Gmail not connected. Please authenticate first.")
        
    credentials = Credentials(
        token=current_user.google_access_token,
        refresh_token=current_user.google_refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=SCOPES
    )
    
    service = build("gmail", "v1", credentials=credentials)
    
    leads = db.query(Leads).filter(Leads.campaign_id == campaign_id).all()
    if not leads:
        raise HTTPException(status_code=404, detail="No leads found for this campaign")
        
    sent_count = 0
    errors = []
    
    for lead in leads:
        try:
            # Interpolate variables dynamically
            merged_body = payload.html_body.replace("{{name}}", lead.name).replace("{{company}}", lead.company)
            merged_subject = payload.subject.replace("{{name}}", lead.name).replace("{{company}}", lead.company)
            
            message = EmailMessage()
            message.set_content(merged_body, subtype="html")
            message["To"] = lead.email
            message["Subject"] = merged_subject
            
            encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
            
            create_message = {"raw": encoded_message}
            service.users().messages().send(userId="me", body=create_message).execute()
            sent_count += 1
        except Exception as e:
            errors.append({"lead": lead.email, "error": str(e)})
            
    return {"sent": sent_count, "errors": errors, "total": len(leads)}
