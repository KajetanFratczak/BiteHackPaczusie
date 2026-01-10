import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlmodel import Session, select
from database.database import create_db_and_tables, get_session
from database.models import User, BusinessProfile, Categories, Ad, AdCategory

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# AUTH ENDPOINTS
@app.post("/register", response_model=UserRead)
def register(user_data: UserCreate, session: Session = Depends(get_session)):

    existing = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        hashed_password=security.hash_password(user_data.password),
        role = "user"
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


@app.get("/me")
async def read_me(current_user: User = Depends(security.get_current_user)):
    return current_user


class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/login", response_model=Token)
def login(request: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == request.email)).first()

    if not user or not security.verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = security.create_access_token({"sub": str(user.user_id)})

    return {"access_token": token, "token_type": "bearer"}

@app.post("/users")
def create_user(user: User, session: Session = Depends(get_session)):
    user.hashed_password = security.hash_password(user.hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.get("/users")
def get_all_users(
    session: Session = Depends(get_session)
):
    return session.exec(select(User)).all()

@app.get("/users/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    return user

@app.put("/users/{user_id}", response_model=User)
def update_user(user_id: int, updated_user: User, session: Session = Depends(get_session)):
    db_user = session.get(User, user_id)
    for key, value in updated_user.dict().items():
        setattr(db_user, key, value)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, session: Session = Depends(get_session)):
    db_user = session.get(User, user_id)
    session.delete(db_user)
    session.commit()
    return  # 204 No Content

#Business CRUD
@app.post("/businesess", response_model=BusinessProfile)
def create_business(business: BusinessProfile, session: Session = Depends(get_session)):
    session.add(business)
    session.commit()
    session.refresh(business)
    return business

@app.get("/businesses", response_model=List[BusinessProfile])
def get_all_businesses(session: Session = Depends(get_session)):
    return session.exec(select(BusinessProfile)).all()

@app.get("/businesses/{bp_id}")
def get_business(bp_id: int, session: Session = Depends(get_session)):
    return session.get(BusinessProfile, bp_id)

@app.put("/businesses/{bp_id}")
def update_business(bp_id: int, updated_buisiness: BusinessProfile, session: Session = Depends(get_session)):
    db_bp = session.get(BusinessProfile, bp_id)
    for key, value in updated_buisiness.dict().items():
        setattr(db_bp, key, value)
    session.add(db_bp)
    session.commit()
    session.refresh(db_bp)
    return db_bp

@app.delete("/businesses/{bp_id}")
def delete_business(bp_id: int, session: Session = Depends(get_session)):
    db_bp = session.get(BusinessProfile, bp_id)
    session.delete(db_bp)
    session.commit()
    return

#AD CRUD
@app.post("/ads", response_model=Ad)
def create_ad(ad: Ad, session: Session = Depends(get_session)):
    session.add(ad)
    session.commit()
    session.refresh(ad)
    return ad

@app.get("/ads", response_model=List[Ad])
def get_all_ads(session: Session = Depends(get_session)):
    return session.exec(select(Ad)).all()

@app.get("/ads/{ad_id}")
def get_ad(ad_id: int, session: Session = Depends(get_session)):
    return session.get(Ad, ad_id)

@app.put("/ads/{ad_id}")
def update_ad(ad_id: int, updated_ad: Ad, session: Session = Depends(get_session)):
    db_ad = session.get(Ad, ad_id)
    for key, value in updated_ad.dict().items():
        setattr(db_ad, key, value)
    session.add(db_ad)
    session.commit()
    session.refresh(db_ad)
    return db_ad

@app.delete("/ads/{ad_id}")
def delete_ad(ad_id: int, session: Session = Depends(get_session)):
    ad_bp = session.get(Ad, ad_id)
    session.delete(ad_bp)
    session.commit()
    return


#Categories CRUD
@app.post("/categories")
def create_category(category: Categories, session: Session = Depends(get_session)):
    session.add(category)
    session.commit()
    session.refresh(category)
    return category

@app.get("/categories")
def get_all_categories(session: Session = Depends(get_session)):
    return session.exec(select(Categories)).all()

@app.get("/categories/{category_id}")
def get_category(category_id: int, session: Session = Depends(get_session)):
    category = session.get(Categories, category_id)
    return category

@app.put("/categories/{category_id}", response_model=Categories)
def update_category(category_id: int, updated_category: Categories, session: Session = Depends(get_session)):
    db_category = session.get(Categories, category_id)
    for key, value in updated_category.dict().items():
        setattr(db_category, key, value)
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category

@app.delete("/categories/{category_id}")
def delete_category(category_id: int, session: Session = Depends(get_session)):
    db_category = session.get(Categories, category_id)
    session.delete(db_category)
    session.commit()
    return

#AdCategories CRUD
@app.post("/ad_categories")
def create_ad_category(ad_category: AdCategory, session: Session = Depends(get_session)):
    session.add(ad_category)
    session.commit()
    session.refresh(ad_category)
    return ad_category

@app.get("/ad_categories")
def get_all_ad_categories(session: Session = Depends(get_session)):
    return session.exec(select(AdCategory)).all()

@app.get("/ad_categories/{ad_id}")
def get_ad_category(ad_id: int,  session: Session = Depends(get_session)):
    categories = session.get(AdCategory, ad_id)
    return categories

@app.put("/ad_categories/{ad_id}/{category_id}", response_model=AdCategory)
def update_ad_category(category_id: int, ad_id: int, updated_ad_category: AdCategory, session: Session = Depends(get_session)):
    db_ad_category = session.get(AdCategory, (ad_id, category_id))
    for key, value in updated_ad_category.dict().items():
        setattr(db_ad_category, key, value)
    session.add(db_ad_category)
    session.commit()
    session.refresh(db_ad_category)
    return db_ad_category

@app.delete("/ad_categories/{ad_id}/{category_id}")#asidbasidabsdihbasihdbasd
def delete_ad_category(category_id: int, ad_id: int,session: Session = Depends(get_session)):
    db_category = session.get(AdCategory, (ad_id, category_id))
    session.delete(db_category)
    session.commit()
    return


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)