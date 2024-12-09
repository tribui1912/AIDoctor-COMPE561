import pytest
from datetime import datetime, timedelta

def test_create_appointment(client, admin_token, test_user):
    appointment_data = {
        "date": (datetime.utcnow() + timedelta(days=1)).isoformat(),
        "reason": "Regular checkup",
        "user_id": test_user.id,
        "status": "pending"
    }
    
    response = client.post(
        "/api/appointments/admin",
        json=appointment_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["reason"] == appointment_data["reason"]

@pytest.fixture
def test_doctor(db_session):
    from app.models import Doctor
    
    doctor = Doctor(
        name="Dr. Test",
        specialty="General",
        email="doctor@test.com",
        schedule={
            "monday": ["09:00-17:00"],
            "tuesday": ["09:00-17:00"],
            "wednesday": ["09:00-17:00"],
            "thursday": ["09:00-17:00"],
            "friday": ["09:00-17:00"]
        }
    )
    db_session.add(doctor)
    db_session.commit()
    db_session.refresh(doctor)
    return doctor