from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List, Optional

from app.models.income import Income
from app.schemas.income import IncomeCreate, IncomeUpdate

def create_income(db: Session, user_id: int, income_data: IncomeCreate) -> Income:
    """Create a new income record for a user."""
    # Convert Pydantic schema to dictionary and add user_id
    db_income = Income(**income_data.model_dump(), user_id=user_id)
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income

def get_all_income(db: Session, user_id: int) -> List[Income]:
    """Retrieve all income records for a specific user."""
    return db.query(Income).filter(Income.user_id == user_id).all()

def get_income_by_id(db: Session, income_id: int, user_id: int) -> Optional[Income]:
    """Retrieve a single income record by ID, ensuring it belongs to the user."""
    return db.query(Income).filter(Income.id == income_id, Income.user_id == user_id).first()

def update_income(db: Session, income_id: int, user_id: int, update_data: IncomeUpdate) -> Optional[Income]:
    """Update an existing income record."""
    db_income = get_income_by_id(db, income_id, user_id)
    if not db_income:
        return None
        
    # Only update fields that were explicitly set in the request
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(db_income, key, value)
        
    db.commit()
    db.refresh(db_income)
    return db_income

def delete_income(db: Session, income_id: int, user_id: int) -> bool:
    """Delete an income record. Returns True if deleted, False if not found."""
    db_income = get_income_by_id(db, income_id, user_id)
    if not db_income:
        return False
        
    db.delete(db_income)
    db.commit()
    return True

def calculate_total_income(db: Session, user_id: int) -> float:
    """Calculate the total sum of all income for a specific user."""
    total = db.query(func.sum(Income.amount)).filter(Income.user_id == user_id).scalar()
    return float(total) if total else 0.0
