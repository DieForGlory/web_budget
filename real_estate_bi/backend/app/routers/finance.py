from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.finance import FinancialModel
from app.models.project import Project
from collections import defaultdict

router = APIRouter()


@router.get("/budget")
def get_corporate_budget(db: Session = Depends(get_db)):
    # Запрос данных с JOIN
    query_results = db.query(
        func.to_char(FinancialModel.period_date, 'YYYY-MM').label('month'),
        FinancialModel.category,
        FinancialModel.payment_type,
        Project.name.label('project_name'),
        func.sum(FinancialModel.contracted_units).label('units'),
        func.sum(FinancialModel.contracted_sqm).label('sqm'),
        func.sum(FinancialModel.contracted_usd).label('contracted_usd'),
        func.sum(FinancialModel.actual_receipts_usd).label('receipts_usd')
    ).join(Project).group_by(
        'month', FinancialModel.category, FinancialModel.payment_type, 'project_name'
    ).order_by('month').all()

    months = sorted(list(set(r.month for r in query_results)))

    categories = ["residential", "commercial", "storage", "parking"]
    payment_types = ["100_percent", "mortgage", "installment"]

    # Инициализация таблицы нулями
    table_data = {
        "units": {cat: {m: 0 for m in months} for cat in categories},
        "sqm": {cat: {m: 0 for m in months} for cat in categories},
        "contracted_usd": {cat: {m: 0 for m in months} for cat in categories},
        "receipts_usd": {pt: {m: 0 for m in months} for pt in payment_types}
    }

    # Словари для корректной агрегации (устраняем дубли имен проектов)
    proj_map = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
    pay_map = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))

    for r in query_results:
        cat = r.category.value
        pay = r.payment_type.value
        m = r.month

        # Таблица
        table_data["units"][cat][m] += r.units
        table_data["sqm"][cat][m] += r.sqm
        table_data["contracted_usd"][cat][m] += r.contracted_usd
        table_data["receipts_usd"][pay][m] += r.receipts_usd

        # Суммируем все оплаты одного проекта в один ключ (имя проекта)
        proj_map[m][cat][r.project_name.strip()] += r.contracted_usd

        # Суммируем все проекты в один ключ (тип оплаты)
        pay_map[m][cat][pay] += r.contracted_usd

    # Превращаем мапы в списки для Recharts
    project_shares = defaultdict(lambda: defaultdict(list))
    for m, cats in proj_map.items():
        for cat, projs in cats.items():
            for name, val in projs.items():
                project_shares[m][cat].append({"name": name, "value": round(val, 2)})

    payment_shares = defaultdict(lambda: defaultdict(list))
    for m, cats in pay_map.items():
        for cat, pays in cats.items():
            for p_type, val in pays.items():
                payment_shares[m][cat].append({"name": p_type, "value": round(val, 2)})

    return {
        "months": months,
        "tableData": table_data,
        "projectShares": project_shares,
        "paymentShares": payment_shares
    }