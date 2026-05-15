from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import List


class FinancialModelBase(BaseModel):
    period_date: date
    contracted_sqm: float
    contracted_units: int
    contracted_usd: float
    actual_receipts_usd: float


class FinancialModelResponse(FinancialModelBase):
    id: int
    project_id: int

    model_config = ConfigDict(from_attributes=True)


class BudgetRecord(BaseModel):
    month: str
    total_receipts_usd: float


class CompanyBudgetResponse(BaseModel):
    items: List[BudgetRecord]

    model_config = ConfigDict(from_attributes=True)