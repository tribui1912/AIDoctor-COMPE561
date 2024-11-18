from app.database import SessionLocal, init_db
from app.models import Admin, NewsArticle, Doctor, User
from app.auth_utils import get_password_hash
from datetime import datetime, timedelta

def seed_database():
    db = SessionLocal()
    try:
        # Create admin
        admin = Admin(
            username="admin",
            email="admin@hospital.com",
            password_hash=get_password_hash("admin123"),
            role="admin",
            permissions={
                "news": ["create", "read", "update", "delete"],
                "appointments": ["create", "read", "update", "delete"],
                "users": ["read", "update", "delete"]
            }
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

        # Create sample news articles
        articles = [
            NewsArticle(
                title="New Medical Wing Opening",
                summary="State-of-the-art facility opening next month",
                content="We are proud to announce the opening of our new medical wing...",
                category="Announcements",
                image_url="https://example.com/image1.jpg",
                date=datetime.utcnow(),
                status="published",
                admin_id=admin.id
            ),
            NewsArticle(
                title="COVID-19 Vaccination Drive",
                summary="Free vaccination campaign starting next week",
                content="Our hospital is initiating a free vaccination drive...",
                category="Health",
                image_url="https://example.com/image2.jpg",
                date=datetime.utcnow() - timedelta(days=2),
                status="published",
                admin_id=admin.id
            )
        ]
        db.add_all(articles)

        # Create sample doctors
        doctors = [
            Doctor(
                name="Dr. John Smith",
                specialty="Cardiology",
                email="john.smith@hospital.com"
            ),
            Doctor(
                name="Dr. Sarah Johnson",
                specialty="Pediatrics",
                email="sarah.johnson@hospital.com"
            ),
            Doctor(
                name="Dr. Michael Chen",
                specialty="Neurology",
                email="michael.chen@hospital.com"
            )
        ]
        db.add_all(doctors)

        # Create sample users
        users = [
            User(
                email="patient1@example.com",
                name="John Doe",
                phone="1234567890",
                hashed_password=get_password_hash("patient123"),
                email_verified=True,
                email_verified_at=datetime.utcnow()
            ),
            User(
                email="patient2@example.com",
                name="Jane Smith",
                phone="0987654321",
                hashed_password=get_password_hash("patient123"),
                email_verified=True,
                email_verified_at=datetime.utcnow()
            )
        ]
        db.add_all(users)

        db.commit()
        print("Sample data has been inserted successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()  # Reset the database
    print("Seeding database...")
    seed_database()