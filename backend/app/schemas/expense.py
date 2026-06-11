from pydantic import BaseModel, ConfigDict, Field
import datetime
from typing import Optional

# Base schema containing fields common to both Create and Response schemas
class ExpenseBase(BaseModel):
    title: str = Field(..., max_length=255, description="Title or brief description of the expense")
    amount: float = Field(..., gt=0, description="Monetary value of the expense")
    category: str = Field(..., max_length=100, description="Grouping category for the expense")
    
    # Use datetime.date to prevent name clashing with the field name 'date'
    date: datetime.date = Field(..., description="The date when the expense occurred")
    
    notes: Optional[str] = Field(None, description="Optional extra details or notes")

# Schema used when creating a new Expense
class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    amount: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, max_length=100)
    date: Optional[datetime.date] = None
    notes: Optional[str] = None

# Schema used when returning an Expense from the API
class ExpenseResponse(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
