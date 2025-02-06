from fastapi import (APIRouter, Depends, HTTPException, status)
from configs import get_db, SessionLocal, ACCESS_TOKEN_EXPIRE_DAYS
from fastapi.security import OAuth2PasswordRequestForm
from user.models import User
from user.schema import UserCreate, UserEdit
from user.config import *
from datetime import timedelta
from user.dependencies import authenticate_user, create_access_token, get_current_user