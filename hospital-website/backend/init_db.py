from app.database import engine, Base
from app.models import NewsArticle, User, Admin, UserSession, AdminSession, RefreshToken, PasswordResetToken

def init_database():
    print("Creating database tables...")
    Base.metadata.drop_all(bind=engine)  # Clear existing tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_database() 