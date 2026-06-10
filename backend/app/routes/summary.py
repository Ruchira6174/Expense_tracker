from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List

# In a real project, this import would point to your actual database dependency
from app.database.database import get_db

# We assume that summary_service.py is located in the services directory
from app.services import summary_service


summary_router = APIRouter(
    prefix="/summary",
    tags=["Summary"]
)


# --- MOCK AUTHENTICATION ---
# Replace this with your actual user model and authentication dependency.
class MockUser:
    id: int = 1

def get_current_user() -> MockUser:
    """Mock dependency to represent an authenticated user."""
    return MockUser()
# ---------------------------


@summary_router.get("/", response_model=Dict[str, Any])
async def get_summary(
    db: Session = Depends(get_db),
    current_user: MockUser = Depends(get_current_user)
):
    """
    Returns a complete financial summary for the logged-in user.
    Includes total income, total expenses, remaining balance, and transaction counts.
    """
    try:
        return summary_service.get_financial_summary(user_id=current_user.id, db=db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to fetch summary: {str(e)}"
        )


@summary_router.get("/monthly", response_model=Dict[str, Any])
async def get_monthly_summary(
    db: Session = Depends(get_db),
    current_user: MockUser = Depends(get_current_user)
):
    """
    Returns month-wise income and expenses.
    Example: {'2026-01': {'income': 50000, 'expenses': 30000, 'balance': 20000}}
    """
    try:
        return summary_service.get_monthly_summary(user_id=current_user.id, db=db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to fetch monthly summary: {str(e)}"
        )


@summary_router.get("/category-expenses", response_model=Dict[str, float])
async def get_category_expenses(
    db: Session = Depends(get_db),
    current_user: MockUser = Depends(get_current_user)
):
    """
    Returns category-wise expense totals.
    Example: {'Food': 12000, 'Travel': 8000}
    """
    try:
        return summary_service.get_category_expenses(user_id=current_user.id, db=db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to fetch category expenses: {str(e)}"
        )


@summary_router.get("/top-expenses", response_model=List[Dict[str, Any]])
async def get_top_expenses(
    db: Session = Depends(get_db),
    current_user: MockUser = Depends(get_current_user)
):
    """
    Returns the top 5 highest expenses for the logged-in user.
    """
    try:
        return summary_service.get_top_expenses(user_id=current_user.id, db=db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to fetch top expenses: {str(e)}"
        )


@summary_router.get("/recent-transactions", response_model=List[Dict[str, Any]])
async def get_recent_transactions(
    db: Session = Depends(get_db),
    current_user: MockUser = Depends(get_current_user)
):
    """
    Returns the latest income and expense records.
    Limits the result to 10 records.
    """
    try:
        return summary_service.get_recent_transactions(user_id=current_user.id, db=db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to fetch recent transactions: {str(e)}"
        )


@summary_router.get("/dashboard", response_model=Dict[str, Any])
async def get_dashboard(
    db: Session = Depends(get_db),
    current_user: MockUser = Depends(get_current_user)
):
    """
    Returns a complete dashboard payload combining financial summary,
    monthly data, category breakdowns, and recent transactions.
    """
    try:
        return summary_service.get_dashboard_data(user_id=current_user.id, db=db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to fetch dashboard data: {str(e)}"
        )
