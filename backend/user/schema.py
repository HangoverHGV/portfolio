"""
This file contains the schema for the user model.
"""

from pydantic import BaseModel
from typing import Optional


class UserCreate(BaseModel):
    name : str
    email: str
    password: str
    is_superuser: Optional[bool] = False
    secret_token: Optional[str] = None


class UserEdit(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    password: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str
