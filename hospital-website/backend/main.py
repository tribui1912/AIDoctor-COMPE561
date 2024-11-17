from fastapi import FastAPI
from app.middleware import RequestLoggingMiddleware, CORSMiddleware
from app.routers import news, auth, appointments, admin
from app.database import engine
from app import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Middlewares
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(CORSMiddleware)

# Routers
app.include_router(news.router)
app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to City General Hospital API"}
