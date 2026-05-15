from sqlalchemy import Column, Integer, Float, ForeignKey, Date, Enum
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.project import PropertyCategory
from app.models.payment import PaymentType

class FinancialModel(Base):
    """Детализированные ежемесячные показатели доходной части"""
    __tablename__ = "financial_models"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    period_date = Column(Date)

    # Обязательно используем values_callable для корректного маппинга строк из БД
    category = Column(
        Enum(PropertyCategory, native_enum=False, values_callable=lambda obj: [item.value for item in obj]),
        nullable=False
    )
    payment_type = Column(
        Enum(PaymentType, native_enum=False, values_callable=lambda obj: [item.value for item in obj]),
        nullable=False
    )

    # Метрики
    contracted_sqm = Column(Float, default=0.0)
    contracted_units = Column(Float, default=0.0)
    contracted_usd = Column(Float, default=0.0)
    actual_receipts_usd = Column(Float, default=0.0)

    project = relationship("Project", back_populates="financial_models")