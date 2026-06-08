from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from typing import Optional

# Base schema containing fields common to both Create and Response schemas
class ExpenseBase(BaseModel):
    title: str = Field(..., max_length=255, description="Title or brief description of the expense")
    amount: float = Field(..., gt=0, description="Monetary value of the expense")
    category: str = Field(..., max_length=100, description="Grouping category for the expense")
    date: date = Field(..., description="The date when the expense occurred")
    notes: Optional[str] = Field(None, description="Optional extra details or notes")

# Schema used when creating a new Expense
# It inherits all fields from ExpenseBase. We don't include id or created_at
# because the database will generate those automatically.
class ExpenseCreate(ExpenseBase):
    pass

# Schema used when returning an Expense from the API
# It includes the auto-generated id and created_at fields from the database.
class ExpenseResponse(ExpenseBase):
    id: int
    created_at: datetime

    # Enable ORM mode (Pydantic V2 style: from_attributes = True)
    # This allows Pydantic to read data from SQLAlchemy model attributes
    # instead of expecting a dictionary.
    # Note: If you are using Pydantic V1, this would be `orm_mode = True`
    model_config = ConfigDict(from_attributes=True)
