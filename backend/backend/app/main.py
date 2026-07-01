import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models.user import User
from app.models.asset import Asset
from app.models.ticket import Ticket

from app.routers.auth import router as auth_router
from app.routers.assets import router as assets_router
from app.routers.tickets import router as tickets_router
from app.routers.dashboard import router as dashboard_router

print("Tables found:", Base.metadata.tables.keys())

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(assets_router)
app.include_router(tickets_router)
app.include_router(dashboard_router)


@app.get("/")
def read_root():
    return {"hey": "Nah! Sabi"}
