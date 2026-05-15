from sqlalchemy import Column, Integer, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.models.base import Base


class FinancialModel(Base):
    """Ежемесячные показатели доходной части модели проекта"""
    __tablename__ = "financial_models"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    period_date = Column(Date)  # Месяц и год

    # Ключевые параметры доходной части
    contracted_sqm = Column(Float, default=0.0)  # Кв.м. контрактация
    contracted_units = Column(Integer, default=0)  # Контрактация в шт
    contracted_usd = Column(Float, default=0.0)  # Контрактация в $
    actual_receipts_usd = Column(Float, default=0.0)  # Поступления (с учетом видов оплаты)

    project = relationship("Project", back_populates="financial_models")