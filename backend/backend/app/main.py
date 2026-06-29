from fastapi import FastAPI
from app.database import engine, Base
from app.models.user import User
from app.routers.auth import router as auth_router
from app.models.asset import Asset

from app.routers.assets import router as assets_router
from app.models.ticket import Ticket
from app.routers.tickets import router as tickets_router
from app.routers.dashboard import router as dashboard_router

print("Tables found:", Base.metadata.tables.keys())

Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(auth_router)
app.include_router(assets_router)
app.include_router(tickets_router)
app.include_router(dashboard_router)

@app.get("/")
def read_root():
    return {"hey": "ily muhtasim!"}