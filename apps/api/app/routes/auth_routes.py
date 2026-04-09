from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.auth_schema import SignupSchema, LoginSchema
from app.db.database import SessionLocal
from app.services.auth_service import signup_user, login_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/signup")
def signup(data: SignupSchema, db: Session = Depends(get_db)):
    return signup_user(db, data)


@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    return login_user(db, data)