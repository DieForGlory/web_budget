from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.finance import FinancialModel

router = APIRouter()


@router.get("/budget")
def get_aggregated_budget(db: Session = Depends(get_db)):
    """
    Слияние моделей: совокупная выручка от продаж по месяцам (в $).
    """
    budget = db.query(
        func.strftime('%Y-%m', FinancialModel.period_date).label('month'),
        func.sum(FinancialModel.actual_receipts_usd).label('total_receipts_usd')
    ).group_by('month').order_by('month').all()

    return [{"month": row.month, "total_receipts_usd": row.total_receipts_usd} for row in budget]


@router.get("/project/{project_id}")
def get_project_financial_model(project_id: int, db: Session = Depends(get_db)):
    """
    Детализированная модель продаж конкретного проекта.
    """
    return db.query(FinancialModel).filter(FinancialModel.project_id == project_id).order_by(
        FinancialModel.period_date).all()