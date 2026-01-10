from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    user_id: int | None = Field(default=None, primary_key=True)
    first_name: str = Field(nullable=False)
    last_name: str = Field(nullable=False)
    email: str = Field(nullable=False, unique=True)
    hashed_password: str = Field(nullable=False)
    role: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    businesses: list["BusinessProfile"] = Relationship(back_populates="user")


class BusinessProfile(SQLModel, table=True):
    pb_id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(nullable=False, foreign_key="user.user_id")
    bp_name: str = Field(nullable=False)
    description: Optional[str] = None
    address: str = Field(nullable=False)
    phone: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    user: "User" = Relationship(back_populates="businesses")
    ads: list["Ad"] = Relationship(back_populates="business_profile")


class Categories(SQLModel, table=True):
    category_id: int | None = Field(default=None, primary_key=True)
    category_name: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    category: list["AdCategory"] = Relationship(back_populates="ad_category2")


class Ad(SQLModel, table=True):
    ad_id: int | None = Field(default=None, primary_key=True)
    ad_title: str = Field(nullable=False)
    bp_id: int = Field(nullable=False, foreign_key="businessprofile.pb_id")
    category_id: int = Field(nullable=False, foreign_key="category.category_id")
    description: Optional[str] = None
    post_date: str
    due_date: str
    status: bool
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    business_profile: "BusinessProfile" = Relationship(back_populates="ads")
    ad_category: list["AdCategory"] = Relationship(back_populates="ads2")


class AdCategory(SQLModel, table=True):
    ad_id: int = Field(primary_key=True, foreign_key="ad.ad_id")
    category_id: int = Field(primary_key=True, foreign_key="categories.category_id")
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    ads2: "Ad" = Relationship(back_populates="ad_category")
    ad_category2: "Categories" = Relationship(back_populates="category")