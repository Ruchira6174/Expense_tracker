from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import Dict, Any, List

from app.models.expense import Expense
from app.models.income import Income


def _month_key(date_value) -> str:
    return date_value.strftime("%Y-%m")


def get_financial_summary(user_id: int, db: Session) -> Dict[str, Any]:
    """Calculate and return overall financial summary for the user."""
    total_income = db.query(func.sum(Income.amount)).filter(Income.user_id == user_id).scalar() or 0
    total_expenses = db.query(func.sum(Expense.amount)).filter(Expense.user_id == user_id).scalar() or 0
    income_count = db.query(func.count(Income.id)).filter(Income.user_id == user_id).scalar() or 0
    expense_count = db.query(func.count(Expense.id)).filter(Expense.user_id == user_id).scalar() or 0

    return {
        "total_income": float(total_income),
        "total_expenses": float(total_expenses),
        "remaining_balance": float(total_income) - float(total_expenses),
        "monthly_savings": float(total_income) - float(total_expenses),
        "expense_count": int(expense_count),
        "income_count": int(income_count)
    }

def get_monthly_summary(user_id: int, db: Session) -> Dict[str, Any]:
    """Calculate and return monthly breakdown of income and expenses."""
    monthly: Dict[str, Dict[str, float]] = {}

    incomes = db.query(Income).filter(Income.user_id == user_id).all()
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()

    for income in incomes:
        key = _month_key(income.date)
        monthly.setdefault(key, {"income": 0.0, "expenses": 0.0, "balance": 0.0})
        monthly[key]["income"] += float(income.amount or 0)

    for expense in expenses:
        key = _month_key(expense.date)
        monthly.setdefault(key, {"income": 0.0, "expenses": 0.0, "balance": 0.0})
        monthly[key]["expenses"] += float(expense.amount or 0)

    for values in monthly.values():
        values["balance"] = values["income"] - values["expenses"]

    return dict(sorted(monthly.items()))

def get_category_expenses(user_id: int, db: Session) -> Dict[str, float]:
    """Calculate and return total expenses grouped by category."""
    rows = (
        db.query(Expense.category, func.sum(Expense.amount))
        .filter(Expense.user_id == user_id)
        .group_by(Expense.category)
        .all()
    )
    return {category: float(total or 0) for category, total in rows}

def get_top_expenses(user_id: int, db: Session) -> List[Dict[str, Any]]:
    """Return top 5 highest expenses."""
    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == user_id)
        .order_by(Expense.amount.desc())
        .limit(5)
        .all()
    )
    return [
        {
            "id": expense.id,
            "title": expense.title,
            "category": expense.category,
            "amount": float(expense.amount),
            "date": expense.date.isoformat(),
            "type": "expense",
        }
        for expense in expenses
    ]

def get_recent_transactions(user_id: int, db: Session) -> List[Dict[str, Any]]:
    """Return the most recent combined income and expense transactions."""
    incomes = (
        db.query(Income)
        .filter(Income.user_id == user_id)
        .order_by(Income.date.desc(), Income.id.desc())
        .limit(10)
        .all()
    )
    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == user_id)
        .order_by(Expense.date.desc(), Expense.id.desc())
        .limit(10)
        .all()
    )

    transactions = [
        {
            "id": income.id,
            "title": income.source,
            "amount": float(income.amount),
            "date": income.date.isoformat(),
            "type": "income",
        }
        for income in incomes
    ] + [
        {
            "id": expense.id,
            "title": expense.title,
            "amount": float(expense.amount),
            "date": expense.date.isoformat(),
            "type": "expense",
            "category": expense.category,
        }
        for expense in expenses
    ]

    return sorted(transactions, key=lambda item: item["date"], reverse=True)[:10]

def get_dashboard_data(user_id: int, db: Session) -> Dict[str, Any]:
    """Return an aggregated payload for the dashboard."""
    summary = get_financial_summary(user_id, db)
    return {
        **summary,
        "balance": summary["remaining_balance"],
        "monthly_data": get_monthly_summary(user_id, db),
        "category_breakdown": get_category_expenses(user_id, db),
        "recent_transactions": get_recent_transactions(user_id, db)
    }
