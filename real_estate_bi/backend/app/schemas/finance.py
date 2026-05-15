from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import List, Dict

class FinancialModelBase(BaseModel):
    period_date: date
    category: str
    payment_type: str
    contracted_sqm: float
    contracted_units: float
    contracted_usd: float
    actual_receipts_usd: float

class FinancialModelResponse(FinancialModelBase):
    id: int
    project_id: int
    model_config = ConfigDict(from_attributes=True)

class BudgetRecord(BaseModel):
    month: str
    category: str
    payment_type: str
    units: float
    sqm: float
    contracted_usd: float
    receipts_usd: float

class CorporateBudgetResponse(BaseModel):
    months: List[str]
    # Данные для таблицы: tableData[metric][category/type][month]
    tableData: Dict[str, Dict[str, Dict[str, float]]]
    # Данные для диаграмм: projectShares[month][category] -> list of {name, value}
    projectShares: Dict[str, Dict[str, List[Dict[str, float]]]]