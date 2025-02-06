"""
This file contains the User model.
"""

from database import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Date, ForeignKey, event
from sqlalchemy.orm import relationship
import datetime
from passlib.context import CryptContext
from portfolio.models import Portfolio

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

    portfolio = relationship("Portfolio", uselist=False,back_populates="user")

    def verify_password(self, password):
        return pwd_context.verify(password, self.hashed_password)

    def hash_password(self, password):
        self.hashed_password = pwd_context.hash(password)


@event.listens_for(User, 'after_insert')
def create_portfolio(mapper, connection, target):
    new_portfolio = Portfolio(user_id=target.id, name=f'{target.name}\'s Portfolio', description=f'{target.name}\'s Portfolio')
    connection.execute(Portfolio.__table__.insert(), new_portfolio.__dict__)

