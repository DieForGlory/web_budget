from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.finance import FinancialModel
from typing import List
from app.schemas.finance import FinancialModelResponse, BudgetRecord

router = APIRouter()


@router.get("/budget")
def get_aggregated_budget(db: Session = Depends(get_db)):
    budget = db.query(
        # Замените func.strftime на func.to_char
        func.to_char(FinancialModel.period_date, 'YYYY-MM').label('month'),
        func.sum(FinancialModel.actual_receipts_usd).label('total_receipts_usd')
    ).group_by('month').order_by('month').all()

    return budget


@router.get("/project/{project_id}", response_model=List[FinancialModelResponse]) # Добавлено
def get_project_financial_model(project_id: int, db: Session = Depends(get_db)):
    return db.query(FinancialModel).filter(
        FinancialModel.project_id == project_id
    ).order_by(FinancialModel.period_date).all()