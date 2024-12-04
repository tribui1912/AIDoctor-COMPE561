import pytest
from datetime import datetime, timedelta

def test_user_signup_login_appointment_flow(client):
    """Test complete user workflow: signup -> login -> create appointment"""
    
    # 1. Sign up new user
    signup_data = {
        "email": "testflow@example.com",
        "password": "testpassword123",
        "name": "Test Flow User",
        "phone": "1234567890"
    }
    
    response = client.post("/api/auth/signup", json=signup_data)
    assert response.status_code == 201
    
    # 2. Login with new user
    login_data = {
        "username": signup_data["email"],
        "password": signup_data["password"]
    }
    
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens
    
    # Store the access token for subsequent requests
    access_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # 3. Create an appointment
    tomorrow = datetime.now() + timedelta(days=1)
    appointment_time = tomorrow.replace(hour=10, minute=0, second=0, microsecond=0)
    
    appointment_data = {
        "date": appointment_time.isoformat(),
        "reason": "General checkup",
        "status": "pending",
        "user_id": 1
    }
    
    response = client.post(
        "/api/appointments/", 
        json=appointment_data,
        headers=headers
    )
    assert response.status_code == 201
    appointment = response.json()
    appointment_id = appointment["id"]
    
    # 4. Verify appointment was created
    response = client.get(
        f"/api/appointments/{appointment_id}",
        headers=headers
    )
    assert response.status_code == 200
    assert response.json()["id"] == appointment_id
    assert response.json()["reason"] == appointment_data["reason"]
    
    # 5. Get user's appointments
    response = client.get(
        "/api/appointments/user/appointments",
        headers=headers
    )
    if response.status_code != 200:
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
    assert response.status_code == 200
    appointments = response.json()
    assert len(appointments) == 1
    assert appointments[0]["id"] == appointment_id
    
    # 6. Update appointment
    update_data = {
        "reason": "Updated: Annual checkup",
        "additional_notes": "First time visit - need medical history review"
    }
    
    response = client.patch(
        f"/api/appointments/{appointment_id}",
        json=update_data,
        headers=headers
    )
    assert response.status_code == 200
    assert response.json()["reason"] == update_data["reason"]
    
    # 7. Cancel appointment
    response = client.delete(
        f"/api/appointments/{appointment_id}",
        headers=headers
    )
    assert response.status_code == 200
    
    # 8. Verify appointment is cancelled
    response = client.get(
        f"/api/appointments/{appointment_id}",
        headers=headers
    )
    assert response.status_code == 200
    assert response.json()["status"] == "cancelled"