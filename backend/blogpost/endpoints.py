from fastapi import (APIRouter, Depends, HTTPException, status)
from user.models import BlogPost
from configs import get_db, SessionLocal
from user.schema import UserCreate, UserEdit
from blogpost.config import *
from datetime import timedelta
from user.dependencies import authenticate_user, create_access_token, get_current_user


router = APIRouter()

#  GET all Blogposts
@router.get("/", tags=["blogpost"], status_code=status.HTTP_200_OK, responses= BLOGPOST_GET_ALL_RESPONSE_CONFIG)
async def get_all_blogposts(db: SessionLocal = Depends(get_db)):
    blogposts = db.query(BlogPost).all()
    return [
        {
            'id': blogpost.id,
            'title': blogpost.title,
            'content': blogpost.content,
            'created_at': blogpost.created_at,
            'updated_at': blogpost.updated_at
        }
        for blogpost in blogposts
    ]



