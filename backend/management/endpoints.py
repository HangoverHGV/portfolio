from fastapi import (APIRouter, Depends, HTTPException, status)
from user.models import Resource, Schedule, User, Employ, schedule_employ_association
from configs import get_db, SessionLocal
from management.schema import ScheduleCreate, ScheduleEdit, ResourceCreate, ResourceEdit, EmployEdit, EmployCreate
from datetime import timedelta, datetime
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
def get_all_schedules(user_id: Optional[int] = None, current_user: User = Depends(get_current_user),
                      db: SessionLocal = Depends(get_db)):
    if current_user.is_superuser:
        schedules = db.query(Schedule).all()
    elif current_user.is_active:
        schedules = db.query(Schedule).filter(Schedule.user_id == current_user.id).all()
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if user_id:
        schedules = db.query(Schedule).filter(Schedule.user_id == user_id).all()

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
def create_schedule(schedule: ScheduleCreate, current_user: User = Depends(get_current_user),
                    db: SessionLocal = Depends(get_db)):
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    schedule = Schedule(title=schedule.title, user_id=current_user.id)
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule


@router.get("/schedules/{schedule_id}", tags=["management"], status_code=status.HTTP_200_OK, responses=GET_ONE_SCHEDULE)
def get_one_schedule(schedule_id: int, current_user: User = Depends(get_current_user),
                     db: SessionLocal = Depends(get_db)):
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
def edit_schedule(schedule_id: int, schedule: ScheduleEdit, current_user: User = Depends(get_current_user),
                  db: SessionLocal = Depends(get_db)):
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


@router.delete("/schedules/{schedule_id}", tags=["management"], status_code=status.HTTP_200_OK,
               responses=DELETE_SCHEDULE)
def delete_schedule(schedule_id: int, current_user: User = Depends(get_current_user),
                    db: SessionLocal = Depends(get_db)):
    schedule = check_schedule(schedule_id, current_user, db)

    db.delete(schedule)
    db.commit()
    return {"detail": "Schedule deleted successfully"}


@router.get("/resources", tags=["management"], status_code=status.HTTP_200_OK, responses=GET_ALL_RESOURCES)
def get_all_resources(schedule_id: Optional[int] = None, current_user: User = Depends(get_current_user),
                      db: SessionLocal = Depends(get_db)):
    print(10 * "***")
    print(current_user.id)
    if not current_user.is_superuser and not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if schedule_id:
        resources = db.query(Resource).filter(Resource.schedule_id == schedule_id).all()
    else:
        resources = db.query(Resource).filter(Resource.user_id == current_user.id).all()

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


@router.post("/resources", tags=["management"], status_code=status.HTTP_201_CREATED, responses=CREATE_RESOURCE)
def create_resource(resource: ResourceCreate, current_user: User = Depends(get_current_user),
                    db: SessionLocal = Depends(get_db)):
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    schedule = db.query(Schedule).filter(Schedule.id == resource.schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")

    start = datetime.strptime(resource.datetime_started, "%Y-%m-%dT%H:%M:%S")
    end = datetime.strptime(resource.datetime_ended, "%Y-%m-%dT%H:%M:%S")
    resource = Resource(name=resource.name, datetime_started=start, datetime_ended=end,
                        schedule_id=resource.schedule_id, user_id=current_user.id)
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return {
        'id': resource.id,
        'name': resource.name,
        'datetime_started': resource.datetime_started,
        'datetime_ended': resource.datetime_ended,
        'schedule_id': resource.schedule_id,
        'user_id': resource.user_id,
        'created_at': resource.created_at,
        'updated_at': resource.updated_at
    }


@router.get("/resources/{resource_id}", tags=["management"], status_code=status.HTTP_200_OK, responses=GET_ONE_RESOURCE)
def get_resource(resource_id: int, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    return {
        'id': resource.id,
        'name': resource.name,
        'datetime_started': resource.datetime_started,
        'datetime_ended': resource.datetime_ended,
        'schedule_id': resource.schedule_id,
        'user_id': resource.user_id,
        'created_at': resource.created_at,
        'updated_at': resource.updated_at
    }


@router.put("/resources/{resource_id}", tags=["management"], status_code=status.HTTP_200_OK, responses=EDIT_RESOURCE)
def edit_respurce(resource_id: int, resource: ResourceEdit, current_user: User = Depends(get_current_user),
                  db: SessionLocal = Depends(get_db)):
    resource_db = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule or Resource not found")

    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if not current_user.is_superuser and current_user.id != resource_db.user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if resource.schedule_id is not None:
        schedule = db.query(Schedule).filter(Schedule.id == resource.schedule_id).first()
        if not schedule:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule or Resource not found")
        resource_db.schedule_id = resource.schedule_id

    if resource.name is not None:
        resource_db.name = resource.name

    if resource.datetime_started is not None:
        resource_db.datetime_started = datetime.strptime(resource["datetime_started"], "%Y-%m-%dT%H:%M:%S")

    if resource.datetime_ended is not None:
        resource_db.datetime_ended = datetime.strptime(resource["datetime_ended"], "%Y-%m-%dT%H:%M:%S")

    db.commit()
    db.refresh(resource_db)

    return {
        'id': resource_db.id,
        'name': resource_db.name,
        'datetime_started': resource_db.datetime_started,
        'datetime_ended': resource_db.datetime_ended,
        'schedule_id': resource_db.schedule_id,
        'user_id': resource_db.user_id,
        'created_at': resource_db.created_at,
        'updated_at': resource_db.updated_at
    }


@router.delete("/resources/{resource_id}", tags=["management"], status_code=status.HTTP_200_OK,
               responses=DELETE_RESOURCE)
def delete_resource(resource_id: int, current_user: User = Depends(get_current_user),
                    db: SessionLocal = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found")

    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if not current_user.is_superuser and current_user.id != resource.user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    db.delete(resource)
    db.commit()
    return {"detail": "Resource deleted successfully"}


@router.get("/employ", tags=["management"], status_code=status.HTTP_200_OK, responses=GET_ALL_EMPLOY)
def get_all_employs(schedule_id: Optional[int] = None, current_user: User = Depends(get_current_user),
                    db: SessionLocal = Depends(get_db)):
    if not current_user.is_superuser and not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if schedule_id:
        employs = db.query(Employ).join(schedule_employ_association).filter(
            schedule_employ_association.c.schedule_id == schedule_id).all()
    else:
        employs = db.query(Employ).filter(Employ.user_id == current_user.id).all()

    return [
        {
            'name': employ.name,
            'user_id': employ.user_id,
        }
        for employ in employs
    ]


@router.post("/employ", tags=["management"], status_code=status.HTTP_201_CREATED, responses=CREATE_EMPLOY)
def create_employ(employ: EmployCreate, current_user: User = Depends(get_current_user),
                  db: SessionLocal = Depends(get_db)):
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    schedule = db.query(Schedule).filter(Schedule.id == employ.schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")

    employ_db = Employ(name=employ.name, user_id=current_user.id)
    db.add(employ_db)
    db.commit()
    db.refresh(employ_db)

    # Add the association to the schedule
    schedule.employees.append(employ_db)
    db.commit()

    return {
        'id': employ_db.id,
        'name': employ_db.name,
        'schedule_id': employ.schedule_id,
    }


@router.get("/employ/{employ_id}", tags=["management"], status_code=status.HTTP_200_OK, responses=GET_ONE_EMPLOY)
def get_employ(employ_id: int, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    employ = db.query(Employ).filter(Employ.id == employ_id).first()
    if not employ:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employ not found")

    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    return {
        'id': employ.id,
        'name': employ.name,
        'schedule_id': employ.schedule_id,
        'resources': [resource.id for resource in employ.resources]
    }


@router.put("/employ/{employ_id}", tags=["management"], status_code=status.HTTP_200_OK, responses=EDIT_EMPLOY)
def edit_employ(employ_id: int, employ: EmployEdit, current_user: User = Depends(get_current_user),
                db: SessionLocal = Depends(get_db)):
    employ_db = db.query(Employ).filter(Employ.id == employ_id).first()
    if not employ_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employ not found")

    if not current_user.is_superuser and (current_user.id != employ_db.user_id or not current_user.is_active):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    if employ.name is not None:
        employ_db.name = employ.name

    if employ.schedule_id is not None:
        schedule = db.query(Schedule).filter(Schedule.id == employ.schedule_id).first()
        if not schedule:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")

        employ_db.schedule_id = employ.schedule_id

    if employ.resources is not None:
        resources = db.query(Resource).filter(Resource.id.in_(employ.resources)).all()
        employ_db.resources = resources

    db.commit()
    db.refresh(employ_db)

    return {
        'id': employ_db.id,
        'name': employ_db.name,
        'schedule_id': employ_db.schedule_id,
        'resources': [resource.id for resource in employ_db.resources]
    }


@router.delete("/employ/{employ_id}", tags=["management"], status_code=status.HTTP_200_OK, responses=DELETE_EMPLOY)
def delete_employ(employ_id: int, current_user: User = Depends(get_current_user), db: SessionLocal = Depends(get_db)):
    employ = db.query(Employ).filter(Employ.id == employ_id).first()
    if not employ:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employ not found")

    if not current_user.is_superuser and (current_user.id != employ.user_id or not current_user.is_active):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    db.delete(employ)
    db.commit()
    return {"detail": "Employ deleted successfully"}
