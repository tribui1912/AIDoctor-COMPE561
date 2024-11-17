from app.database import SessionLocal
from app.crud import create_admin
from app.schemas import AdminCreate

def create_initial_admin():
    db = SessionLocal()
    try:
        admin = AdminCreate(
            username="admin",
            email="admin@hospital.com",
            password="admin123",  # Change this in production!
            role="admin",
            permissions={"news": ["create", "read", "update", "delete"]}
        )
        create_admin(db, admin)
        print("Initial admin created successfully!")
    except Exception as e:
        print(f"Error creating admin: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_admin() 