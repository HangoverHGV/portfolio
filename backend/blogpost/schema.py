"""
This file contains the schema for the BlogPost model.
"""

from pydantic import BaseModel
from typing import Optional

class BlogPostCreate(BaseModel):
    title: str
    content: str
    author_id: int

class BlogPostEdit(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    author_id: Optional[int] = None

