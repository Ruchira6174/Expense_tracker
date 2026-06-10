from pydantic import BaseModel, ConfigDict, Field
# Import the datetime module directly rather than specific classes.
# This prevents Pydantic v2 from getting confused between a field named 'date'
# and the type annotation 'date'.
import datetime
from typing import Optional

class IncomeBase(BaseModel):
    """Base schema with common income attributes."""
    source: str = Field(..., max_length=150, description="Source of the income (e.g., Salary, Gift)")
    amount: float = Field(..., gt=0, description="Monetary value, must be greater than 0")
    
    # We use datetime.date here. If we used `from datetime import date` and wrote `date: date`,
    # Pydantic v2 throws a PydanticUserError due to name clashing.
    date: datetime.date = Field(..., description="Date the income was received")
    
    description: Optional[str] = Field(None, description="Optional extra details")

class IncomeCreate(IncomeBase):
    """Schema for creating a new income. Inherits all fields from IncomeBase."""
    pass

class IncomeUpdate(BaseModel):
    """Schema for updating an existing income. All fields are optional."""
    source: Optional[str] = Field(None, max_length=150)
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[datetime.date] = None
    description: Optional[str] = None

class IncomeResponse(IncomeBase):
    """Schema for responding with income data, includes DB-generated fields."""
    id: int
    user_id: int
    created_at: datetime.datetime

    # Enable ORM mode to allow translation from SQLAlchemy objects
    model_config = ConfigDict(from_attributes=True)
