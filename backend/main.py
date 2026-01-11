import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlmodel import Session, select, col
from database.database import create_db_and_tables, get_session
from database.models import User, BusinessProfile, Categories, Ad, AdCategory, Reviews
from schemas import Token, UserCreate, UserRead
import security
from sqlalchemy import or_
from decouple import config

app = FastAPI()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()



origins = config("CORS_ORIGINS").split(",")

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
        role="business_owner"
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


@app.get("/businesses/user/{user_id}")
def get_businesses_by_user(user_id: int, session: Session = Depends(get_session)):
    businesses = session.exec(
        select(BusinessProfile).where(BusinessProfile.user_id == user_id)
    ).all()
    return businesses


@app.put("/users/{user_id}", response_model=User)
def update_user(user_id: int, updated_user: User, session: Session = Depends(get_session)):
    db_user = session.get(User, user_id)
    for key, value in updated_user.dict(exclude_unset=True).items():
        setattr(db_user, key, value)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, session: Session = Depends(get_session)):
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Użytkownik nie znaleziony")

    bps = session.exec(select(BusinessProfile).where(BusinessProfile.user_id == user_id)).all()

    for bp in bps:
        ads = session.exec(select(Ad).where(Ad.bp_id == bp.bp_id)).all()
        for ad in ads:
            ad_categories = session.exec(select(AdCategory).where(AdCategory.ad_id == ad.ad_id)).all()
            for ad_category in ad_categories:
                session.delete(ad_category)
            session.delete(ad)
        session.delete(bp)

    session.delete(db_user)
    session.commit()
    return {"message": "Użytkownik usunięty pomyślnie"}


# Business CRUD
@app.post("/businesses", response_model=BusinessProfile)
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


@app.get("/businesses/{bp_id}/ads")
def get_ads_by_business(bp_id: int, session: Session = Depends(get_session)):
    try:
        business = session.get(BusinessProfile, bp_id)
        if not business:
            raise HTTPException(status_code=404, detail="Firma nie znaleziona")

        ads = session.exec(
            select(Ad).where(Ad.bp_id == bp_id)
        ).all()

        return ads
    except Exception as e:
        print(f"Błąd w get_ads_by_business: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Błąd pobierania ogłoszeń: {str(e)}")


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
    if not db_bp:
        raise HTTPException(status_code=404, detail="Profil biznesowy nie znaleziony")

    ads = session.exec(select(Ad).where(Ad.bp_id == bp_id)).all()

    for ad in ads:
        ad_categories = session.exec(select(AdCategory).where(AdCategory.ad_id == ad.ad_id)).all()
        for ad_category in ad_categories:
            session.delete(ad_category)

        ad_reviews = session.exec(select(Reviews).where(Reviews.ad_id == ad.ad_id)).all()
        for ad_review in ad_reviews:
            session.delete(ad_review)

        session.delete(ad)

    session.delete(db_bp)
    session.commit()
    return {"message": "Profil biznesowy usunięty pomyślnie"}


# AD CRUD
# Endpoint do tworzenia ogłoszenia
@app.post("/ads", response_model=Ad)
def create_ad(ad: Ad, session: Session = Depends(get_session)):
    # Zawsze ustaw status na False przy tworzeniu
    ad.status = False
    session.add(ad)
    session.commit()
    session.refresh(ad)
    return ad


@app.get("/ads/user/{user_id}")
def get_ads_by_user(user_id: int, session: Session = Depends(get_session)):
    try:
        # 1. Znajdź firmy użytkownika
        businesses = session.exec(
            select(BusinessProfile).where(BusinessProfile.user_id == user_id)
        ).all()

        if not businesses:
            return []

        # 2. Zbierz ID firm
        business_ids = [b.bp_id for b in businesses]
        print(business_ids)
        # 3. Pobierz ogłoszenia dla każdej firmy po kolei
        all_ads = []
        for bp_id in business_ids:
            ads_for_business = session.exec(
                select(Ad).where(Ad.bp_id == bp_id)
            ).all()
            all_ads.extend(ads_for_business)
        print(all_ads)
        return all_ads

    except Exception as e:
        print(f"Błąd w get_ads_by_user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Błąd pobierania ogłoszeń: {str(e)}")


@app.get("/ads", response_model=List[Ad])
def get_all_ads(
        session: Session = Depends(get_session),
        search: Optional[str] = None,
        category_id: Optional[int] = None
):
    # Podstawowe zapytanie
    statement = select(Ad)

    # Filtrowanie po tekście (w tytule lub opisie)
    if search:
        search_filter = f"%{search}%"
        statement = statement.where(
            or_(
                col(Ad.ad_title).ilike(search_filter),
                col(Ad.description).ilike(search_filter)
            )
        )

    # Filtrowanie po kategorii (wymaga join z tabelą łączącą AdCategory)
    if category_id:
        statement = statement.join(AdCategory).where(AdCategory.category_id == category_id)

    return session.exec(statement).all()


@app.get("/ads/{ad_id}")
def get_ad(ad_id: int, session: Session = Depends(get_session)):
    ad = session.get(Ad, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ogłoszenie nie znalezione")
    return ad


@app.put("/ads/{ad_id}")
def update_ad(ad_id: int, updated_ad: Ad, session: Session = Depends(get_session)):
    db_ad = session.get(Ad, ad_id)
    if not db_ad:
        raise HTTPException(status_code=404, detail="Ogłoszenie nie znalezione")

    # Aktualizuj tylko pola, które są podane w requeście
    # Możesz dodać zabezpieczenie przed zmianą statusu dla nie-adminów
    update_data = updated_ad.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_ad, key, value)

    session.add(db_ad)
    session.commit()
    session.refresh(db_ad)
    return db_ad


@app.delete("/ads/{ad_id}")
def delete_ad(ad_id: int, session: Session = Depends(get_session)):
    ad = session.get(Ad, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ogłoszenie nie znalezione")

    ad_categories = session.exec(select(AdCategory).where(AdCategory.ad_id == ad_id)).all()

    ad_reviews = session.exec(select(Reviews).where(Reviews.ad_id == ad_id)).all()

    for ad_category in ad_categories:
        session.delete(ad_category)

    for ad_review in ad_reviews:
        session.delete(ad_review)

    session.delete(ad)
    session.commit()
    return {"message": "Ogłoszenie usunięte pomyślnie"}


@app.get("/ads/pending")
def get_pending_ads(session: Session = Depends(get_session)):
    return session.exec(select(Ad).where(Ad.status == False)).all()


@app.get("/ads/status/{status}")
def get_ads_by_status(status: bool, session: Session = Depends(get_session)):
    return session.exec(select(Ad).where(Ad.status == status)).all()


@app.patch("/ads/{ad_id}/approve")
def approve_ad(ad_id: int, session: Session = Depends(get_session)):
    ad = session.get(Ad, ad_id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ogłoszenie nie znalezione")
    ad.status = True
    session.add(ad)
    session.commit()
    session.refresh(ad)
    return ad


# Categories CRUD
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


# AdCategories CRUD
@app.post("/ad_categories")
def create_ad_category(ad_category: AdCategory, session: Session = Depends(get_session)):
    session.add(ad_category)
    session.commit()
    session.refresh(ad_category)
    return ad_category


@app.get("/ad_categories")
def get_all_ad_categories(session: Session = Depends(get_session)):
    return session.exec(select(AdCategory)).all()


@app.get("/ad_categories/by_ad/{ad_id}")
def get_ad_categories_by_ad(ad_id: int, session: Session = Depends(get_session)):
    return session.exec(select(AdCategory).where(AdCategory.ad_id == ad_id)).all()


@app.get("/ad_categories/by_category/{category_id}")
def get_ad_categories_by_category(category_id: int, session: Session = Depends(get_session)):
    return session.exec(select(AdCategory).where(AdCategory.category_id == category_id)).all()


@app.get("/ad_categories/{ad_id}/{category_id}")
def get_ad_category(category_id: int, ad_id: int, session: Session = Depends(get_session)):
    category = session.get(AdCategory, (ad_id, category_id))
    return category


@app.put("/ad_categories/{ad_id}/{category_id}", response_model=AdCategory)
def update_ad_category(category_id: int, ad_id: int, updated_ad_category: AdCategory,
                       session: Session = Depends(get_session)):
    db_ad_category = session.get(AdCategory, (ad_id, category_id))
    for key, value in updated_ad_category.dict().items():
        setattr(db_ad_category, key, value)
    session.add(db_ad_category)
    session.commit()
    session.refresh(db_ad_category)
    return db_ad_category


@app.delete("/ad_categories/{ad_id}/{category_id}")
def delete_ad_category(category_id: int, ad_id: int, session: Session = Depends(get_session)):
    db_category = session.get(AdCategory, (ad_id, category_id))
    session.delete(db_category)
    session.commit()
    return

#Reviews CRUD
@app.get("/reviews/ad/{ad_id}")
def get_reviews_by_ad(ad_id: int, session: Session = Depends(get_session)):
    try:
        # Sprawdź czy ogłoszenie istnieje
        ad = session.get(Ad, ad_id)
        if not ad:
            raise HTTPException(status_code=404, detail="Ogłoszenie nie znalezione")

        # Pobierz recenzje z informacjami o użytkowniku
        reviews = session.exec(
            select(Reviews).where(Reviews.ad_id == ad_id)
        ).all()

        # Dla każdej recenzji dodaj informacje o użytkowniku
        reviews_with_user = []
        for review in reviews:
            review_dict = review.dict()
            # Możesz dodać logikę do pobierania nazwy użytkownika jeśli potrzebne
            reviews_with_user.append(review_dict)

        return reviews_with_user
    except Exception as e:
        print(f"Błąd w get_reviews_by_ad: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Błąd pobierania recenzji: {str(e)}")


@app.get("/reviews/ad/{ad_id}/average")
def get_average_rating(ad_id: int, session: Session = Depends(get_session)):
    try:
        reviews = session.exec(
            select(Reviews).where(Reviews.ad_id == ad_id)
        ).all()

        if not reviews:
            return {"average": 0, "count": 0}

        total_rating = sum(review.rating for review in reviews)
        average = total_rating / len(reviews)

        return {"average": average, "count": len(reviews)}
    except Exception as e:
        print(f"Błąd w get_average_rating: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Błąd obliczania średniej oceny: {str(e)}")


# Dodaj ten endpoint do istniejącego /reviews/{review_id}
@app.get("/reviews/{review_id}")
def get_review(review_id: int, session: Session = Depends(get_session)):
    review = session.get(Reviews, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Recenzja nie znaleziona")
    return review

@app.post("/reviews")
def create_review(review: Reviews, session: Session = Depends(get_session)):
    session.add(review)
    session.commit()
    session.refresh(review)
    return review


@app.get("/reviews")
def get_all_reviews(session: Session = Depends(get_session)):
    return session.exec(select(Reviews)).all()

@app.put("/reviews/{review_id}", response_model=Reviews)
def update_review(review_id: int, updated_review: Reviews, session: Session = Depends(get_session)):
    db_review = session.get(Reviews, review_id)
    for key, value in updated_review.dict().items():
        setattr(db_review, key, value)
    session.add(db_review)
    session.commit()
    session.refresh(db_review)
    return db_review


@app.delete("/reviews/{review_id}")
def delete_review(review_id: int,session: Session = Depends(get_session)):
    db_review = session.get(Reviews, review_id)
    session.delete(db_review)
    session.commit()
    return


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)