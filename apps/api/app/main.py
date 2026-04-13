from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path
from dotenv import load_dotenv
from app.db.database import engine
from app.db.base import Base
from app.routes.auth_routes import router as auth_router
from app.routes.dashboard_routes import router as dashboard_router
from app.models import user
from app.routes import campaign_routes
from app.routes import icp_routes
from app.routes import lead_routes
from app.routes import gmail_routes

ENV_PATH = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=ENV_PATH)

app = FastAPI(title="Revora API")

def _parse_cors_origins(raw: str) -> list[str]:
    values = [o.strip() for o in (raw or "").split(",") if o.strip()]
    return values or ["*"]

cors_origins = _parse_cors_origins(os.getenv("CORS_ORIGINS", "*"))
allow_credentials = os.getenv("CORS_ALLOW_CREDENTIALS", "false").strip().lower() in {"1", "true", "yes", "on"}

if "*" in cors_origins and allow_credentials:
    allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(campaign_routes.router)
app.include_router(icp_routes.router)
app.include_router(lead_routes.router)
app.include_router(gmail_routes.router)

@app.get("/")
def root():
    return {"message": "Revora API Running"}