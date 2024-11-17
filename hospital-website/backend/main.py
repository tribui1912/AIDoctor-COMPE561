from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import news, auth, appointments, admin
from app.database import engine
from app import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(news.router)
app.include_router(auth.router)
app.include_router(appointments.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to City General Hospital API"}
