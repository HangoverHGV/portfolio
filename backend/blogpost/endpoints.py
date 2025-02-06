from fastapi import (APIRouter, Depends, HTTPException, status)
from user.models import BlogPost, User
from configs import get_db, SessionLocal
from blogpost.schema import BlogPostCreate, BlogPostEdit
from blogpost.config import *
from datetime import timedelta
from user.dependencies import authenticate_user, create_access_token, get_current_user


router = APIRouter()

# GET all Blogposts
@router.get("/", tags=["blogpost"], status_code=status.HTTP_200_OK, responses=BLOGPOST_GET_ALL_RESPONSE_CONFIG)
async def get_all_blogposts(db: SessionLocal = Depends(get_db)):
    blogposts = db.query(BlogPost).all()
    return [
        {
            'id': blogpost.id,
            'title': blogpost.title,
            'content': blogpost.content,
            'user_id': blogpost.user_id,
            'created_at': blogpost.created_at,
            'updated_at': blogpost.updated_at
        }
        for blogpost in blogposts
    ]

#  Create a Blogpost
@router.post("/", tags=["blogpost"], status_code=status.HTTP_201_CREATED, responses=BLOGPOST_POST_RESPONSE_CONFIG)
async def create_blogpost(blogpost: BlogPostCreate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    if not current_user.is_superuser and not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated or not authorized")

    blogpost = BlogPost(**blogpost.model_dump())
    db.add(blogpost)
    db.commit()
    db.refresh(blogpost)

    return {
        'id': blogpost.id,
        'title': blogpost.title,
        'content': blogpost.content,
        'user_id': current_user.id,
        'created_at': blogpost.created_at,
        'updated_at': blogpost.updated_at
    }

# GET a Blogpost by ID
@router.get("/{blogpost_id}", tags=["blogpost"], status_code=status.HTTP_200_OK,responses=BLOGPOST_GET_RESPONE_CONFIG)
async def get_blogpost(blogpost_id: int, db: SessionLocal = Depends(get_db)):
    blogpost = db.query(BlogPost).filter(BlogPost.id == blogpost_id).first()

    if not blogpost:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog Post not found")

    return {
        'id': blogpost.id,
        'title': blogpost.title,
        'content': blogpost.content,
        'user_id': blogpost.user_id,
        'created_at': blogpost.created_at,
        'updated_at': blogpost.updated_at
    }

