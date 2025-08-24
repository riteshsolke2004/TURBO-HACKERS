import jwt, os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from passlib.hash import bcrypt

load_dotenv()
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM")
EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 60))

def create_access_token(data: dict):
    expire = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(password: str, hashed: str):
    return bcrypt.verify(password, hashed)

def hash_password(password: str):
    return bcrypt.hash(password)
