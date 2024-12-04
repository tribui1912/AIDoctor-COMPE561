from app.database import engine
from sqlalchemy import text

def verify_connection():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Successfully connected to PostgreSQL database!")
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")

if __name__ == "__main__":
    verify_connection()