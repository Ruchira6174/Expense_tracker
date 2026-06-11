from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.dependencies import get_current_user_id
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseUpdate
from app.services import expense_service

expense_router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

@expense_router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    return expense_service.create_expense(db=db, user_id=user_id, expense_data=expense)


@expense_router.get("/", response_model=List[ExpenseResponse])
def get_all_expenses(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    return expense_service.get_all_expenses(db=db, user_id=user_id)


@expense_router.get("/{id}", response_model=ExpenseResponse)
def get_expense(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    db_expense = expense_service.get_expense_by_id(db=db, expense_id=id, user_id=user_id)
    if not db_expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return db_expense


@expense_router.put("/{id}", response_model=ExpenseResponse)
def update_expense(
    id: int,
    expense_update: ExpenseUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    db_expense = expense_service.update_expense(
        db=db,
        expense_id=id,
        user_id=user_id,
        update_data=expense_update,
    )
    if not db_expense:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return db_expense


@expense_router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    success = expense_service.delete_expense(db=db, expense_id=id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return None
