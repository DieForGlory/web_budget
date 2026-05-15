from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.models.finance import FinancialModel
from app.schemas.finance import FinancialModelResponse, BudgetRecord

router = APIRouter()


@router.get("/budget", response_model=List[BudgetRecord])
def get_aggregated_budget(db: Session = Depends(get_db)):
    """
    Слияние моделей: совокупная выручка от продаж по месяцам (в $).
    """
    # Замена func.strftime на func.to_char для совместимости с PostgreSQL
    budget = db.query(
        func.to_char(FinancialModel.period_date, 'YYYY-MM').label('month'),
        func.sum(FinancialModel.actual_receipts_usd).label('total_receipts_usd')
    ).group_by('month').order_by('month').all()

    return budget


@router.get("/project/{project_id}", response_model=List[FinancialModelResponse])
def get_project_financial_model(project_id: int, db: Session = Depends(get_db)):
    """
    Детализированная модель продаж конкретного проекта.
    """
    return db.query(FinancialModel).filter(
        FinancialModel.project_id == project_id
    ).order_by(FinancialModel.period_date).all()