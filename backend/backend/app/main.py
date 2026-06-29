from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models.user import User
from app.models.asset import Asset
from app.routers.auth import router as auth_router
from app.routers.assets import router as assets_router


app = FastAPI(title="IT Help Desk and Asset Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Tables found:", Base.metadata.tables.keys())

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(assets_router)


@app.get("/")
def read_root():
    return {"message": "IT Help Desk API is running"}