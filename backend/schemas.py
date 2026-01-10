from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: str
    first_name: str
    last_name: str
    password: str

class UserRead(BaseModel):
    user_id: int
    email: EmailStr

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
