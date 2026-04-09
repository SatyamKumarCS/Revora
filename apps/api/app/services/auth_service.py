from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.hashing import hash_password, verify_password
from app.core.security import create_access_token
from app.models.user import User
from app.schemas.auth_schema import SignupSchema, LoginSchema


def signup_user(db: Session, data: SignupSchema) -> dict:
	if data.password != data.confirm_password:
		raise HTTPException(status_code=400, detail="Passwords do not match")

	existing_user = db.query(User).filter(User.email == data.email).first()
	if existing_user:
		raise HTTPException(status_code=400, detail="Email already registered")

	new_user = User(
		full_name=data.full_name,
		email=data.email,
		password=hash_password(data.password),
		company_name=data.company_name,
		role=data.role,
	)

	db.add(new_user)
	db.commit()
	db.refresh(new_user)

	token = create_access_token({"user_id": str(new_user.id)})
	return {
		"message": "User created successfully",
		"access_token": token,
		"token_type": "bearer",
		"redirect_url": "/dashboard",
	}


def login_user(db: Session, data: LoginSchema) -> dict:
	user = db.query(User).filter(User.email == data.email).first()
	if not user or not verify_password(data.password, user.password):
		raise HTTPException(status_code=400, detail="Invalid credentials")

	token = create_access_token({"user_id": str(user.id)})
	return {
		"access_token": token,
		"token_type": "bearer",
		"redirect_url": "/dashboard",
	}
