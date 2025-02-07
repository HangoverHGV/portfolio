from anyio import current_effective_deadline
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
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    blogpost = BlogPost(**blogpost.model_dump(), user_id=current_user.id)
    db.add(blogpost)
    db.commit()
    db.refresh(blogpost)

    return {
        'id': blogpost.id,
        'title': blogpost.title,
        'content': blogpost.content,
        'user_id': blogpost.id,
        'created_at': blogpost.created_at,
        'updated_at': blogpost.updated_at
    }

# GET a Blogpost by ID
@router.get("/{blogpost_id}", tags=["blogpost"], status_code=status.HTTP_200_OK,responses=BLOGPOST_POST_RESPONSE_CONFIG)
async def get_blogpost(blogpost_id: int, db: SessionLocal = Depends(get_db)):
    if not blogpost_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog Post not found")
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

# Edit a Blogpost by ID
@router.put("/{blogpost_id}", tags=["blogpost"], status_code=status.HTTP_200_OK, responses=BLOGPOST_PUT_RESPONSE_CONFIG)
def edit_blogpost(blogpost_id: int, blogpost: BlogPostEdit, current_user: User = Depends(get_current_user), db=Depends(get_db)):

    blogpost_db = db.query(BlogPost).filter(BlogPost.id == blogpost_id).first()

    if not current_user.is_superuser and (not current_user.is_active or current_user.id != blogpost.user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if not blogpost_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog Post not found")

    if not blogpost:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog Post not found")

    if blogpost.title is not None:
        blogpost_db.title = blogpost.title
    if blogpost.content is not None:
        blogpost_db.content = blogpost.content
    db.commit()
    db.refresh(blogpost_db)

    return {
        'id': blogpost_db.id,
        'title': blogpost_db.title,
        'content': blogpost_db.content,
        'user_id': blogpost_db.user_id,
        'created_at': blogpost_db.created_at,
        'updated_at': blogpost_db.updated_at
    }

@router.delete("/{blogpost_id}", tags=["blogpost"], status_code=status.HTTP_200_OK)
async def delete_blogpost(blogpost_id: int, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    blogpost = db.query(BlogPost).filter(BlogPost.id == blogpost_id).first()

    if not current_user.is_superuser and (not current_user.is_active or current_user.id != blogpost.user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if not blogpost_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog Post not found")

    if not blogpost:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Blog Post not found")

    db.delete(blogpost)
    db.commit()
    return {
        'detail': 'Blog Post deleted successfully'
    }
