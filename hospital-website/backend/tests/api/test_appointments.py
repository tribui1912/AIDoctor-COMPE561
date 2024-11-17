import pytest
from datetime import datetime, timedelta

def test_create_appointment(client, admin_token):
    # Create test appointment
    appointment_data = {
        "date": (datetime.utcnow() + timedelta(days=1)).isoformat(),
        "reason": "Regular checkup",
        "user_id": 1
    }
    
    response = client.post(
        "/api/appointments",
        json=appointment_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["reason"] == appointment_data["reason"]

def test_get_appointments(client, admin_token):
    # First create some test appointments
    for i in range(3):
        appointment_data = {
            "date": (datetime.utcnow() + timedelta(days=i+1)).isoformat(),
            "reason": f"Checkup {i+1}",
            "user_id": 1
        }
        client.post(
            "/api/appointments",
            json=appointment_data,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
    
    # Get all appointments
    response = client.get(
        "/api/appointments",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3

def test_get_pending_appointments(client, admin_token):
    # Create appointments with different statuses
    appointments = [
        {
            "date": (datetime.utcnow() + timedelta(days=1)).isoformat(),
            "reason": "Pending appointment 1",
            "user_id": 1,
            "status": "pending"
        },
        {
            "date": (datetime.utcnow() + timedelta(days=2)).isoformat(),
            "reason": "Confirmed appointment",
            "user_id": 1,
            "status": "confirmed"
        },
        {
            "date": (datetime.utcnow() + timedelta(days=3)).isoformat(),
            "reason": "Pending appointment 2",
            "user_id": 1,
            "status": "pending"
        }
    ]
    
    for appointment in appointments:
        client.post(
            "/api/appointments",
            json=appointment,
            headers={"Authorization": f"Bearer {admin_token}"}
        )
    
    # Get pending appointments
    response = client.get(
        "/api/appointments/pending",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all(appointment["status"] == "pending" for appointment in data)

def test_assign_doctor(client, admin_token):
    # Create an appointment
    appointment_data = {
        "date": (datetime.utcnow() + timedelta(days=1)).isoformat(),
        "reason": "Need doctor assignment",
        "user_id": 1
    }
    
    appointment_response = client.post(
        "/api/appointments",
        json=appointment_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    appointment_id = appointment_response.json()["id"]
    
    # Assign doctor
    assign_data = {
        "doctor_id": 1
    }
    
    response = client.post(
        f"/api/appointments/{appointment_id}/assign",
        json=assign_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["doctor_id"] == 1

def test_invalid_appointment_date(client, admin_token):
    # Try to create appointment with past date
    appointment_data = {
        "date": (datetime.utcnow() - timedelta(days=1)).isoformat(),
        "reason": "Past appointment",
        "user_id": 1
    }
    
    response = client.post(
        "/api/appointments",
        json=appointment_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 400
    assert "Cannot create appointment in the past" in response.json()["detail"]

def test_appointment_conflict(client, admin_token):
    # Create first appointment
    appointment_time = datetime.utcnow() + timedelta(days=1)
    appointment_data = {
        "date": appointment_time.isoformat(),
        "reason": "First appointment",
        "user_id": 1
    }
    
    client.post(
        "/api/appointments",
        json=appointment_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    # Try to create second appointment at same time
    conflicting_appointment = {
        "date": appointment_time.isoformat(),
        "reason": "Conflicting appointment",
        "user_id": 1
    }
    
    response = client.post(
        "/api/appointments",
        json=conflicting_appointment,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 409
    assert "Time slot already booked" in response.json()["detail"]

def test_unauthorized_appointment_access(client):
    # Try to access appointments without token
    response = client.get("/api/appointments")
    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]

def test_appointment_status_update(client, admin_token):
    # Create an appointment
    appointment_data = {
        "date": (datetime.utcnow() + timedelta(days=1)).isoformat(),
        "reason": "Status update test",
        "user_id": 1
    }
    
    appointment_response = client.post(
        "/api/appointments",
        json=appointment_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    appointment_id = appointment_response.json()["id"]
    
    # Update status
    update_data = {
        "status": "confirmed"
    }
    
    response = client.patch(
        f"/api/appointments/{appointment_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "confirmed"