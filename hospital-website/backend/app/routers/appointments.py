from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/api/appointments",
    tags=["appointments"]
)

@router.post("/", response_model=schemas.Appointment)
async def create_appointment(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(get_db)
):
    return crud.create_appointment(db=db, appointment=appointment)

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

@router.delete("/{appointment_id}")
async def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    crud.delete_appointment(db, appointment_id=appointment_id)
    return {"message": "Appointment deleted successfully"} 