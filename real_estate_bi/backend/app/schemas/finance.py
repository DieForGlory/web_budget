from pydantic import BaseModel
from datetime import date
from typing import List

class FinancialModelBase(BaseModel):
    period_date: date
    contracted_sqm: float
    contracted_units: int
    contracted_usd: int
    actual_receipts_usd: int

class FinancialModelResponse(FinancialModelBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True

class BudgetRecord(BaseModel):
    month: str
    total_receipts_usd: int

class CompanyBudgetResponse(BaseModel):
    items: List[BudgetRecord]