from datetime import date
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session
from app.models.project import Project
from app.models.finance import FinancialModel


def calculate_sales_pace(sold_units: int, sales_start_date: date, current_date: date,
                         requested_period_months: int) -> float:
    months_since_start = (current_date.year - sales_start_date.year) * 12 + (
                current_date.month - sales_start_date.month)
    if months_since_start <= 0:
        return 0.0
    actual_period = min(requested_period_months, months_since_start)
    return sold_units / actual_period


def distribute_payments_over_time(total_contract_value: int, down_payment_percent: float, months_duration: int) -> list[
    int]:
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


def generate_financial_model(db: Session, project: Project):
    """
    Генерация помесячной финансовой модели на основе параметров ТЭП и настроек проекта.
    """
    current_date = project.sales_start_date
    total_units_to_sell = sum(tep.units_count for tep in project.teps)
    sold_units_total = 0
    month_index = 0

    # Извлечение усредненной цены кв.м. по проекту (упрощенный старт)
    # Формат integer применяется для всех вычислений цен
    avg_sqm_price_usd = sum(tep.avg_price_sqm_usd for tep in project.teps) / len(project.teps) if project.teps else 0
    avg_area = sum(tep.avg_area_sqm for tep in project.teps) / len(project.teps) if project.teps else 0

    while sold_units_total < total_units_to_sell:
        # Сезонный коэффициент для текущего месяца
        month_str = str(current_date.month)
        seasonality_coef = project.seasonality_coefficients.get(month_str, 100.0) / 100.0

        # Расчет продаж текущего месяца
        monthly_sales_units = int(project.avg_sales_pace_units * seasonality_coef)

        # Корректировка на остаток
        if sold_units_total + monthly_sales_units > total_units_to_sell:
            monthly_sales_units = total_units_to_sell - sold_units_total

        sold_units_total += monthly_sales_units
        contracted_sqm = monthly_sales_units * avg_area

        # Индексация цены
        current_price_sqm = int(avg_sqm_price_usd * ((1 + project.monthly_price_increase_percent / 100) ** month_index))
        contracted_usd = int(contracted_sqm * current_price_sqm)

        # Запись в модель (в текущей итерации поступления = контрактации, логика рассрочек будет применена на уровне видов оплаты)
        model_record = FinancialModel(
            project_id=project.id,
            period_date=current_date,
            contracted_sqm=contracted_sqm,
            contracted_units=monthly_sales_units,
            contracted_usd=contracted_usd,
            actual_receipts_usd=contracted_usd
        )
        db.add(model_record)

        current_date += relativedelta(months=1)
        month_index += 1

    db.commit()