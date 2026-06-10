from sqlalchemy.orm import Session
from typing import Dict, Any, List

def get_financial_summary(user_id: int, db: Session) -> Dict[str, Any]:
    """Calculate and return overall financial summary for the user."""
    return {
        "total_income": 0.0,
        "total_expenses": 0.0,
        "remaining_balance": 0.0,
        "expense_count": 0,
        "income_count": 0
    }

def get_monthly_summary(user_id: int, db: Session) -> Dict[str, Any]:
    """Calculate and return monthly breakdown of income and expenses."""
    return {}

def get_category_expenses(user_id: int, db: Session) -> Dict[str, float]:
    """Calculate and return total expenses grouped by category."""
    return {}

def get_top_expenses(user_id: int, db: Session) -> List[Dict[str, Any]]:
    """Return top 5 highest expenses."""
    return []

def get_recent_transactions(user_id: int, db: Session) -> List[Dict[str, Any]]:
    """Return the most recent combined income and expense transactions."""
    return []

def get_dashboard_data(user_id: int, db: Session) -> Dict[str, Any]:
    """Return an aggregated payload for the dashboard."""
    return {
        "total_income": 0.0,
        "total_expenses": 0.0,
        "balance": 0.0,
        "monthly_data": [],
        "category_breakdown": {},
        "recent_transactions": []
    }
