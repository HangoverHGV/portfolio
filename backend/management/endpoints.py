from fastapi import (APIRouter, Depends, HTTPException, status)
from user.models import Resource, Schedule, User
from configs import get_db, SessionLocal
from management.schema import ScheduleCreate, ScheduleEdit
from datetime import timedelta
from management.config import *
from user.dependencies import authenticate_user, create_access_token, get_current_user
from typing import Optional


router = APIRouter()

def check_schedule(schedule_id, current_user, db):
    schedule_db = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")

    if not current_user.is_superuser and (not current_user.is_active or current_user.id != schedule_db.user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    return schedule_db

@router.get("/schedules", tags=["management"], status_code=status.HTTP_200_OK, responses=GET_ALL_SCHEDULES)
def get_all_schedules(current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    if current_user.is_superuser:
        schedules = db.query(Schedule).all()
    elif current_user.is_active:
        schedules = db.query(Schedule).filter(Schedule.user_id == current_user.id).all()
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    return [
        {
            'id': schedule.id,
            'title': schedule.title,
            'user_id': schedule.user_id,
            'created_at': schedule.created_at,
            'updated_at': schedule.updated_at
        }
        for schedule in schedules
    ]

@router.post("/schedules", tags=["management"], status_code=status.HTTP_201_CREATED, responses=CREATE_SCHEDULE)
def create_schedule(schedule: ScheduleCreate, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    schedule = Schedule(title=schedule.title, user_id=current_user.id)
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule

@router.get("/schedules/{schedule_id}", tags=["management"], status_code=status.HTTP_200_OK, responses=GET_ONE_SCHEDULE)
def get_one_schedule(schedule_id: int, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")

    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    return {
        'id': schedule.id,
        'title': schedule.title,
        'user_id': schedule.user_id,
        'created_at': schedule.created_at,
        'updated_at': schedule.updated_at
    }

@router.put("/schedules/{schedule_id}", tags=["management"], status_code=status.HTTP_200_OK, responses=EDIT_SCHEDULE)
def edit_schedule(schedule_id: int, schedule: ScheduleEdit, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):

    schedule_db = check_schedule(schedule_id, current_user, db)

    if schedule.title is not None:
        schedule_db.title = schedule.title

    db.commit()
    db.refresh(schedule_db)
    return {
        'id': schedule_db.id,
        'title': schedule_db.title,
        'user_id': schedule_db.user_id,
        'created_at': schedule_db.created_at,
        'updated_at': schedule_db.updated_at
    }

@router.delete("/schedules/{schedule_id}", tags=["management"], status_code=status.HTTP_200_OK, responses=DELETE_SCHEDULE)
def delete_schedule(schedule_id: int, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    schedule = check_schedule(schedule_id, current_user, db)

    db.delete(schedule)
    db.commit()
    return {"detail": "Schedule deleted successfully"}


@router.get("/resources", tags=["management"], status_code=status.HTTP_200_OK, responses=GET_ALL_RESOURCES)
def get_all_resources(current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    if current_user.is_superuser:
        resources = db.query(Resource).all()
    elif current_user.is_active:
        resources = db.query(Resource).filter(Resource.user_id == current_user.id).all()
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    return [
        {
            'id': resource.id,
            'name': resource.name,
            'datetime_started': resource.datetime_started,
            'datetime_ended': resource.datetime_ended,
            'schedule_id': resource.schedule_id,
            'user_id': resource.user_id,
            'created_at': resource.created_at,
            'updated_at': resource.updated_at
        }
        for resource in resources
    ]



