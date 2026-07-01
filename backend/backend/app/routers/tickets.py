from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketUpdate, TicketResponse
from app.utils.dependencies import get_current_user, get_current_admin


from app.models.user import User

router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.post("/", response_model=TicketResponse)
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_ticket = Ticket(
        title=ticket.title,
        description=ticket.description,
        priority=ticket.priority,
        asset_id=ticket.asset_id,
        assigned_to=ticket.assigned_to,
        created_by_id=current_user.id,
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket


@router.get("/", response_model=List[TicketResponse])
def get_tickets(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role == "admin":
        return db.query(Ticket).all()

    return (
        db.query(Ticket)
        .filter(Ticket.created_by_id == current_user.id)
        .all()
    )

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    if current_user.role != "admin" and ticket.created_by_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to view this ticket"
        )

    return ticket

@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int,
    updated_ticket: TicketUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    ticket.title = updated_ticket.title
    ticket.description = updated_ticket.description
    ticket.priority = updated_ticket.priority
    ticket.asset_id = updated_ticket.asset_id

    if "status" in updated_ticket.model_fields_set:
        if current_user.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only admins can update ticket status."
            )

        ticket.status = updated_ticket.status

    if "assigned_to" in updated_ticket.model_fields_set:
        if current_user.role != "admin":
            raise HTTPException(
                status_code=403,
                detail="Only admins can assign tickets."
            )

        ticket.assigned_to = updated_ticket.assigned_to

    db.commit()
    db.refresh(ticket)

    return ticket

@router.delete("/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if ticket is None:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    db.delete(ticket)
    db.commit()

    return {
        "message": "Ticket deleted successfully"
    }
