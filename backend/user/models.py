"""
This file contains the User model.
"""

from database import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Date, ForeignKey, event, Text, Table
from sqlalchemy.orm import relationship
import datetime
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    blog_posts = relationship("BlogPost", back_populates="user", cascade="all, delete-orphan")
    employees = relationship("Employ", back_populates="user", cascade="all, delete-orphan")

    def verify_password(self, password):
        return pwd_context.verify(password, self.hashed_password)

    def hash_password(self, password):
        self.hashed_password = pwd_context.hash(password)


class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    user_id = Column(Integer, ForeignKey('users.id'))

    user = relationship("User", back_populates="blog_posts")

    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))


# Association table for many-to-many relationship between Schedule and Employ
schedule_employ_association = Table(
    'schedule_employ', Base.metadata,
    Column('schedule_id', Integer, ForeignKey('schedules.id')),
    Column('employ_id', Integer, ForeignKey('employs.id'))
)

class Employ(Base):
    __tablename__ = "employs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    user_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    schedules = relationship("Schedule", secondary=schedule_employ_association, back_populates="employees")
    resources = relationship("Resource", back_populates="employee")
    user = relationship("User", back_populates="employees")

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))

    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    resources = relationship("Resource", back_populates="schedule", cascade="all, delete-orphan")
    employees = relationship("Employ", secondary=schedule_employ_association, back_populates="schedules")

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    datetime_started = Column(DateTime)
    datetime_ended = Column(DateTime)

    schedule_id = Column(Integer, ForeignKey('schedules.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    employ_id = Column(Integer, ForeignKey('employs.id'))
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc), onupdate=datetime.datetime.now(datetime.timezone.utc))

    schedule = relationship("Schedule", back_populates="resources")
    employee = relationship("Employ", back_populates="resources")

