from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from db import users_collection
from models import UserSignup, UserLogin, TokenData
from utils import create_access_token, hash_password, verify_password
import os

router = APIRouter(prefix="/auth", tags=["Auth"])

# OAuth setup
oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

# Signup (Email + Password)
@router.post("/signup", response_model=TokenData)
def signup(user: UserSignup):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(user.password)
    new_user = {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "password": hashed_pw,
        "role": user.role,
    }
    users_collection.insert_one(new_user)

    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token}

# Login (Email + Password)
@router.post("/login", response_model=TokenData)
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if db_user["role"] != user.role:
        raise HTTPException(status_code=403, detail="Role mismatch")

    token = create_access_token({"sub": db_user["email"], "role": db_user["role"]})
    return {"access_token": token}

# Google OAuth Login
@router.get("/google")
@router.get("/google/")
async def google_login(request: Request):
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def google_callback(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    if not user_info:
        raise HTTPException(status_code=400, detail="Google auth failed")

    email = user_info["email"]
    name = user_info["name"]
    picture = user_info.get("picture", "")

    db_user = users_collection.find_one({"email": email})
    if not db_user:
        db_user = {
            "email": email,
            "name": name,
            "avatar": picture,
            "role": "user",  # default role
        }
        users_collection.insert_one(db_user)

    jwt_token = create_access_token({"sub": email, "role": db_user["role"]})
    response = RedirectResponse(url=f"{os.getenv('FRONTEND_URL')}/?token={jwt_token}")
    return response
