
from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_assets: int
    available_assets: int
    assigned_assets: int
    total_tickets: int
    open_tickets: int
    closed_tickets: int