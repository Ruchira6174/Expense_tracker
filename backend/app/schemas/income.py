from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from typing import Optional

class IncomeBase(BaseModel):
    """Base schema with common income attributes."""
    source: str = Field(..., max_length=150, description="Source of the income (e.g., Salary, Gift)")
    amount: float = Field(..., gt=0, description="Monetary value, must be greater than 0")
    date: date = Field(..., description="Date the income was received")
    description: Optional[str] = Field(None, description="Optional extra details")

class IncomeCreate(IncomeBase):
    """Schema for creating a new income. Inherits all fields from IncomeBase."""
    pass

class IncomeUpdate(BaseModel):
    """Schema for updating an existing income. All fields are optional."""
    source: Optional[str] = Field(None, max_length=150)
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[date] = None
    description: Optional[str] = None

class IncomeResponse(IncomeBase):
    """Schema for responding with income data, includes DB-generated fields."""
    id: int
    user_id: int
    created_at: datetime

    # Enable ORM mode to allow translation from SQLAlchemy objects
    model_config = ConfigDict(from_attributes=True)
