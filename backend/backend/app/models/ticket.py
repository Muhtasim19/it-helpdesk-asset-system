from sqlalchemy import Column, Integer, String, ForeignKey

from sqlalchemy.orm import relationship
from app.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default="Open")
    priority = Column(String, default="Medium")
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    assigned_to = Column(String, nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_by = relationship("User")
