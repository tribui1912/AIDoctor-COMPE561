from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, models, schemas
from ..database import get_db
from ..auth_utils import get_current_user, get_current_admin
import logging

router = APIRouter(
    prefix="/api/appointments",
    tags=["appointments"]
)

@router.post("/", response_model=schemas.Appointment, status_code=status.HTTP_201_CREATED)
async def create_appointment_endpoint(
    appointment: schemas.AppointmentCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new appointment"""
    try:
        # Convert Pydantic model to dict and add user_id
        appointment_data = {
            "date": appointment.date,
            "reason": appointment.reason,
            "status": appointment.status,
            "user_id": current_user.id
        }
        
        # Create appointment
        db_appointment = crud.create_appointment(
            db=db,
            appointment=appointment_data
        )
        
        # Convert SQLAlchemy model to dict
        return {
            "id": db_appointment.id,
            "date": db_appointment.date,
            "reason": db_appointment.reason,
            "status": db_appointment.status,
            "user_id": db_appointment.user_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/admin", response_model=schemas.Appointment, status_code=status.HTTP_201_CREATED)
async def create_appointment_admin(
    appointment: schemas.AppointmentCreate,
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create an appointment (admin only)"""
    try:
        # Convert Pydantic model to dict
        appointment_data = appointment.dict()
        
        # Create appointment
        db_appointment = crud.create_appointment(
            db=db,
            appointment=appointment_data
        )
        
        return db_appointment
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/", response_model=List[schemas.Appointment])
async def read_appointments(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    appointments = crud.get_appointments(db, skip=skip, limit=limit, status=status)
    return appointments

@router.get("/pending", response_model=List[schemas.Appointment])
async def read_pending_appointments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    appointments = crud.get_appointments(db, skip=skip, limit=limit, status="pending")
    return appointments

@router.post("/{appointment_id}/assign", response_model=schemas.Appointment)
async def assign_doctor(
    appointment_id: int,
    doctor_id: int,
    db: Session = Depends(get_db)
):
    return crud.assign_doctor_to_appointment(
        db=db,
        appointment_id=appointment_id,
        doctor_id=doctor_id
    )

@router.get("/{appointment_id}", response_model=schemas.Appointment)
async def read_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = crud.get_appointment(db, appointment_id=appointment_id)
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.put("/{appointment_id}", response_model=schemas.Appointment)
async def update_appointment(
    appointment_id: int,
    appointment: schemas.AppointmentUpdate,
    db: Session = Depends(get_db)
):
    return crud.update_appointment(db=db, appointment_id=appointment_id, appointment=appointment)

@router.patch("/{appointment_id}", response_model=schemas.Appointment)
async def patch_appointment(
    appointment_id: int,
    appointment: schemas.AppointmentUpdate,
    db: Session = Depends(get_db)
):
    return crud.update_appointment(db=db, appointment_id=appointment_id, appointment=appointment)

@router.delete("/{appointment_id}", response_model=schemas.Appointment)
async def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):
    """Cancel an appointment"""
    return crud.delete_appointment(db=db, appointment_id=appointment_id)

@router.get("/user/appointments", response_model=List[schemas.Appointment])
async def read_user_appointments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get appointments for the currently logged-in user"""
    try:
        appointments = crud.get_user_appointments(db, user_id=current_user.id)
        return appointments
    except Exception as e:
        logging.error(f"Error fetching user appointments: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching appointments: {str(e)}"
        )

@router.get("/admin/all", response_model=List[schemas.Appointment])
async def read_all_appointments(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin)
):
    """Get all appointments (admin only)"""
    try:
        appointments = crud.get_appointments(db, skip=skip, limit=limit, status=status)
        
        # Convert appointments to response format
        return [
            {
                "id": appointment.id,
                "date": appointment.date,
                "reason": appointment.reason,
                "status": appointment.status,
                "user_id": appointment.user_id
            }
            for appointment in appointments
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

def get_user_appointments(db: Session, user_id: int):
    """Get all appointments for a specific user"""
    return db.query(models.Appointment)\
             .filter(models.Appointment.user_id == user_id)\
             .all() 