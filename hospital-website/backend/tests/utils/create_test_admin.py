from app.database import SessionLocal
from app.crud import create_admin
from app.schemas import AdminCreate
from app.models import Admin
from sqlalchemy.orm import Session

def create_test_admin(db: Session = None):
    """Create a test admin user with predefined credentials"""
    if db is None:
        db = SessionLocal()
        local_session = True
    else:
        local_session = False

    try:
        # Check if test admin already exists
        existing_admin = db.query(Admin).filter(Admin.username == "testadmin").first()
        if existing_admin:
            return existing_admin

        admin_data = AdminCreate(
            username="testadmin",
            email="testadmin@test.com",
            password="testpass123",
            role="admin",
            permissions={
                "news": ["create", "read", "update", "delete"],
                "appointments": ["create", "read", "update", "delete"],
                "users": ["read", "update", "delete"]
            }
        )
        return create_admin(db, admin_data)
    
    finally:
        if local_session:
            db.close()

def cleanup_test_admin(db: Session = None):
    """Remove test admin from database"""
    if db is None:
        db = SessionLocal()
        local_session = True
    else:
        local_session = False

    try:
        db.query(Admin).filter(Admin.username == "testadmin").delete()
        db.commit()
    finally:
        if local_session:
            db.close()