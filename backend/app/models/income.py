from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text
from sqlalchemy.sql import func
from app.database.database import Base

class Income(Base):
    """
    SQLAlchemy model representing an Income record for a specific user.
    """
    __tablename__ = "incomes"

    # Unique identifier for each income record
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Links the income to a specific user
    user_id = Column(Integer, nullable=False, index=True)
    
    # Source of the income (e.g., "Salary", "Freelance", "Gift")
    source = Column(String(150), nullable=False, index=True)
    
    # Monetary value of the income
    amount = Column(Float, nullable=False)
    
    # Date the income was received
    date = Column(Date, nullable=False, index=True)
    
    # Optional detailed description
    description = Column(Text, nullable=True)
    
    # Automatically populated timestamp indicating when the record was created
    created_at = Column(DateTime(timezone=True), server_default=func.now())
