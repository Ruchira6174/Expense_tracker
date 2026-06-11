from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate


def create_expense(db: Session, user_id: int, expense_data: ExpenseCreate) -> Expense:
    db_expense = Expense(**expense_data.model_dump(), user_id=user_id)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def get_all_expenses(db: Session, user_id: int) -> List[Expense]:
    return (
        db.query(Expense)
        .filter(Expense.user_id == user_id)
        .order_by(Expense.date.desc(), Expense.id.desc())
        .all()
    )


def get_expense_by_id(db: Session, expense_id: int, user_id: int) -> Optional[Expense]:
    return db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()


def update_expense(
    db: Session,
    expense_id: int,
    user_id: int,
    update_data: ExpenseUpdate,
) -> Optional[Expense]:
    db_expense = get_expense_by_id(db, expense_id, user_id)
    if not db_expense:
        return None

    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(db_expense, key, value)

    db.commit()
    db.refresh(db_expense)
    return db_expense


def delete_expense(db: Session, expense_id: int, user_id: int) -> bool:
    db_expense = get_expense_by_id(db, expense_id, user_id)
    if not db_expense:
        return False

    db.delete(db_expense)
    db.commit()
    return True
