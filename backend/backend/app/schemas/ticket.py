
from pydantic import BaseModel


class TicketCreate(BaseModel):
    title: str
    description: str
    priority: str = "Medium"
    asset_id: int | None = None
    assigned_to: str | None = None


class TicketUpdate(BaseModel):
    title: str
    description: str
    status: str
    priority: str
    asset_id: int | None = None
    assigned_to: str | None = None


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    priority: str
    asset_id: int | None = None
    assigned_to: str | None = None

    class Config:
        from_attributes = True