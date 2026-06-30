
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.asset import Asset
from app.models.ticket import Ticket
from app.schemas.dashboard import DashboardResponse
from app.utils.dependencies import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    total_assets = db.query(Asset).count()

    available_assets = db.query(Asset).filter(
        Asset.status == "Available"
    ).count()

    assigned_assets = db.query(Asset).filter(
        Asset.status == "Assigned"
    ).count()

    total_tickets = db.query(Ticket).count()

    open_tickets = db.query(Ticket).filter(
        Ticket.status == "Open"
    ).count()

    closed_tickets = db.query(Ticket).filter(
        Ticket.status == "Closed"
    ).count()

    return {
        "total_assets": total_assets,
        "available_assets": available_assets,
        "assigned_assets": assigned_assets,
        "total_tickets": total_tickets,
        "open_tickets": open_tickets,
        "closed_tickets": closed_tickets,
    }