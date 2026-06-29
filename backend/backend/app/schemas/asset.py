
from pydantic import BaseModel


class AssetCreate(BaseModel):
    name: str
    category: str
    serial_number: str
    status: str = "Available"
    assigned_to: str | None = None

class AssetUpdate(BaseModel):
    name: str
    category: str
    serial_number: str
    status: str
    assigned_to: str | None = None

class AssetResponse(BaseModel):
    id: int
    name: str
    category: str
    serial_number: str
    status: str
    assigned_to: str | None = None

    class Config:
        from_attributes = True