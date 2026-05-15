from pydantic import BaseModel
from datetime import date

class FinancialModelBase(BaseModel):
    period_date: date
    contracted_sqm: float
    contracted_units: int
    contracted_usd: int  # Единый числовой формат integer для ценовых полей
    actual_receipts_usd: int # Единый числовой формат integer для ценовых полей

class FinancialModelCreate(FinancialModelBase):
    project_id: int

class FinancialModelResponse(FinancialModelBase):
    id: int
    project_id: int

    class Config:
        orm_mode = True