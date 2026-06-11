from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database.database import get_db
from app.dependencies import get_current_user_id
from app.schemas.income import IncomeCreate, IncomeUpdate, IncomeResponse
from app.services import income_service

income_router = APIRouter(
    prefix="/income",
    tags=["Income"]
)

@income_router.post("/", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
def create_income(
    income: IncomeCreate, 
    db: Session = Depends(get_db), 
    user_id: int = Depends(get_current_user_id)
):
    """Create a new income record."""
    return income_service.create_income(db=db, user_id=user_id, income_data=income)

@income_router.get("/total", response_model=Dict[str, float])
def get_total_income(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Get the total sum of all income."""
    total = income_service.calculate_total_income(db=db, user_id=user_id)
    return {"total_income": total}

@income_router.get("/", response_model=List[IncomeResponse])
def get_all_income(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Retrieve all income records for the current user."""
    return income_service.get_all_income(db=db, user_id=user_id)

@income_router.get("/{id}", response_model=IncomeResponse)
def get_income(
    id: int, 
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Retrieve a specific income record by its ID."""
    db_income = income_service.get_income_by_id(db=db, income_id=id, user_id=user_id)
    if not db_income:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Income not found")
    return db_income

@income_router.put("/{id}", response_model=IncomeResponse)
def update_income(
    id: int, 
    income_update: IncomeUpdate, 
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Update a specific income record."""
    db_income = income_service.update_income(db=db, income_id=id, user_id=user_id, update_data=income_update)
    if not db_income:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Income not found")
    return db_income

@income_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income(
    id: int, 
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    """Delete a specific income record."""
    success = income_service.delete_income(db=db, income_id=id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Income not found")
    return None
