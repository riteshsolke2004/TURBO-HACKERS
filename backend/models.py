from pydantic import BaseModel, EmailStr

class UserSignup(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    role: str  # "user" or "admin"

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str

class TokenData(BaseModel):
    access_token: str
    token_type: str = "bearer"
