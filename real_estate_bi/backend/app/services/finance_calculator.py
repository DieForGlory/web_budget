from datetime import date
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session
from collections import defaultdict
from app.models.project import Project, PropertyCategory
from app.models.finance import FinancialModel
from app.models.payment import PaymentType


def calculate_sales_pace(sold_units: int, sales_start_date: date, current_date: date,
                         requested_period_months: int) -> float:
    """Расчет текущего темпа продаж на основе исторических данных."""
    months_since_start = (current_date.year - sales_start_date.year) * 12 + (
            current_date.month - sales_start_date.month)
    if months_since_start <= 0:
        return 0.0
    actual_period = min(requested_period_months, months_since_start)
    return sold_units / actual_period


def distribute_payments_over_time(total_contract_value: int, down_payment_percent: float, months_duration: int) -> list[
    int]:
    """Распределение платежей во времени (для рассрочки)."""
    if months_duration <= 0 or down_payment_percent >= 100.0:
        return [total_contract_value]
    down_payment = int(total_contract_value * (down_payment_percent / 100))
    remainder = total_contract_value - down_payment
    monthly_payment = int(remainder / months_duration)
    payments = [down_payment]
    payments.extend([monthly_payment] * months_duration)
    difference = total_contract_value - sum(payments)
    if difference != 0 and len(payments) > 1:
        payments[-1] += difference
    return payments


def generate_financial_model(db: Session, project: Project, project_in_data: dict):
    """
    Генерация детализированной финансовой модели.
    Данные группируются по (индексу месяца, категории недвижимости, типу оплаты).
    """
    current_date = project.sales_start_date
    total_units_to_sell = sum(tep["units_count"] for tep in project_in_data["teps"])
    sold_units_total = 0
    month_index = 0

    # Хранилище: (month_index, category, payment_type) -> metrics
    financial_data = defaultdict(lambda: {
        "contracted_sqm": 0.0,
        "contracted_units": 0.0,
        "contracted_usd": 0.0,
        "actual_receipts_usd": 0.0
    })

    while sold_units_total < total_units_to_sell:
        month_str = str(current_date.month)
        seasonality_coef = project.seasonality_coefficients.get(month_str, 100.0) / 100.0

        # Целевой объем продаж на месяц с учетом сезонности
        monthly_target = project.avg_sales_pace_units * seasonality_coef
        if sold_units_total + monthly_target > total_units_to_sell:
            monthly_target = total_units_to_sell - sold_units_total

        if monthly_target <= 0:
            break

        for tep in project_in_data["teps"]:
            tep_cat = tep["category"]
            # Доля ТЭП в общем объеме проекта
            tep_share = tep["units_count"] / total_units_to_sell
            units_in_month = monthly_target * tep_share

            if units_in_month <= 0:
                continue

            # Цена с учетом ежемесячного роста
            price_sqm = tep["avg_price_sqm_usd"] * (
                    (1 + project.monthly_price_increase_percent / 100) ** month_index
            )
            sqm_in_month = units_in_month * tep["avg_area_sqm"]
            base_val = sqm_in_month * price_sqm

            # Распределение по типам оплаты внутри категории
            for pay in tep["payment_configs"]:
                p_type = pay["payment_type"]
                p_share = pay["share_percent"] / 100.0

                key = (month_index, tep_cat, p_type)
                financial_data[key]["contracted_units"] += units_in_month * p_share
                financial_data[key]["contracted_sqm"] += sqm_in_month * p_share

                if p_type == PaymentType.INSTALLMENT:
                    # Наценка за рассрочку
                    markup = 0.165 * (pay["installment_months"] / 12.0)
                    total_val = (base_val * p_share) * (1 + markup)
                    financial_data[key]["contracted_usd"] += total_val

                    # Первый взнос
                    dp = total_val * (pay["down_payment_percent"] / 100.0)
                    financial_data[key]["actual_receipts_usd"] += dp

                    # Распределение остатка по месяцам рассрочки
                    rem = total_val - dp
                    if pay["installment_months"] > 0:
                        monthly_pay = rem / pay["installment_months"]
                        for i in range(1, pay["installment_months"] + 1):
                            r_key = (month_index + i, tep_cat, p_type)
                            financial_data[r_key]["actual_receipts_usd"] += monthly_pay
                else:
                    # 100% оплата или ипотека: поступление сразу
                    val = base_val * p_share
                    financial_data[key]["contracted_usd"] += val
                    financial_data[key]["actual_receipts_usd"] += val

        sold_units_total += monthly_target
        current_date += relativedelta(months=1)
        month_index += 1

    # Очистка старых данных модели перед сохранением новых
    db.query(FinancialModel).filter(FinancialModel.project_id == project.id).delete()

    # Сохранение детализированных записей
    for (m_idx, cat, p_type), rec in financial_data.items():
        if any(v > 0 for v in rec.values()):
            db_model = FinancialModel(
                project_id=project.id,
                period_date=project.sales_start_date + relativedelta(months=m_idx),
                category=cat,
                payment_type=p_type,
                contracted_sqm=rec["contracted_sqm"],
                contracted_units=rec["contracted_units"],
                contracted_usd=rec["contracted_usd"],
                actual_receipts_usd=rec["actual_receipts_usd"]
            )
            db.add(db_model)

    db.commit()