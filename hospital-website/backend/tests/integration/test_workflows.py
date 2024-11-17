import pytest

def test_user_signup_login_appointment_flow(client):
    # 1. Sign up
    signup_data = {
        "email": "test@example.com",
        "password": "testpass123",
        "name": "Test User"
    }
    signup_response = client.post("/api/auth/signup", json=signup_data)
    assert signup_response.status_code == 200

    # 2. Login
    login_data = {
        "username": "test@example.com",
        "password": "testpass123"
    }
    login_response = client.post("/api/auth/login", data=login_data)
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]

    # 3. Create appointment
    appointment_data = {
        "date": "2024-03-20T10:00:00",
        "reason": "Annual checkup"
    }
    appointment_response = client.post(
        "/api/appointments",
        json=appointment_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert appointment_response.status_code == 200