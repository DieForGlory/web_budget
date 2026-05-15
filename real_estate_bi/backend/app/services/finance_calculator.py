from datetime import date
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session
from collections import defaultdict
from app.models.project import Project
from app.models.finance import FinancialModel
from app.models.payment import PaymentType


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


def generate_financial_model(db: Session, project: Project, project_in_data: dict):
    current_date = project.sales_start_date
    total_units_to_sell = sum(tep["units_count"] for tep in project_in_data["teps"])
    sold_units_total = 0
    month_index = 0

    financial_data = defaultdict(lambda: {
        "contracted_sqm": 0.0,
        "contracted_units": 0,
        "contracted_usd": 0,
        "actual_receipts_usd": 0
    })

    while sold_units_total < total_units_to_sell:
        month_str = str(current_date.month)
        seasonality_coef = project.seasonality_coefficients.get(month_str, 100.0) / 100.0

        monthly_sales_units_target = int(project.avg_sales_pace_units * seasonality_coef)
        if sold_units_total + monthly_sales_units_target > total_units_to_sell:
            monthly_sales_units_target = total_units_to_sell - sold_units_total

        if monthly_sales_units_target == 0:
            break

        sold_units_total += monthly_sales_units_target

        for tep in project_in_data["teps"]:
            tep_share = tep["units_count"] / total_units_to_sell
            tep_monthly_units = int(monthly_sales_units_target * tep_share)

            if tep_monthly_units == 0:
                continue

            current_base_price_sqm = int(
                tep["avg_price_sqm_usd"] * ((1 + project.monthly_price_increase_percent / 100) ** month_index))
            tep_monthly_sqm = tep_monthly_units * tep["avg_area_sqm"]
            base_contract_value = int(tep_monthly_sqm * current_base_price_sqm)

            financial_data[month_index]["contracted_sqm"] += tep_monthly_sqm
            financial_data[month_index]["contracted_units"] += tep_monthly_units

            for payment in tep["payment_configs"]:
                share = payment["share_percent"] / 100.0
                contract_chunk = int(base_contract_value * share)

                if payment["payment_type"] == PaymentType.INSTALLMENT:
                    markup_rate = 0.165 * (payment["installment_months"] / 12.0)
                    final_contract_value = int(contract_chunk * (1 + markup_rate))
                    financial_data[month_index]["contracted_usd"] += final_contract_value

                    dp_amount = int(final_contract_value * (payment["down_payment_percent"] / 100.0))
                    remainder = final_contract_value - dp_amount
                    monthly_installment = int(remainder / payment["installment_months"]) if payment[
                                                                                                "installment_months"] > 0 else 0

                    financial_data[month_index]["actual_receipts_usd"] += dp_amount

                    for i in range(1, payment["installment_months"] + 1):
                        receipt_month = month_index + i
                        if i == payment["installment_months"]:
                            monthly_installment += remainder - (monthly_installment * payment["installment_months"])
                        financial_data[receipt_month]["actual_receipts_usd"] += monthly_installment

                else:
                    financial_data[month_index]["contracted_usd"] += contract_chunk
                    financial_data[month_index]["actual_receipts_usd"] += contract_chunk

        current_date += relativedelta(months=1)
        month_index += 1

    max_month = max(financial_data.keys()) if financial_data else 0
    write_date = project.sales_start_date

    for i in range(max_month + 1):
        record = financial_data[i]
        db_model = FinancialModel(
            project_id=project.id,
            period_date=write_date,
            contracted_sqm=record["contracted_sqm"],
            contracted_units=record["contracted_units"],
            contracted_usd=record["contracted_usd"],
            actual_receipts_usd=record["actual_receipts_usd"]
        )
        db.add(db_model)
        write_date += relativedelta(months=1)

    db.commit()