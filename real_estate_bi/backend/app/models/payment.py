# app/models/payment.py
import enum
from sqlalchemy import Column, Integer, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.models.base import Base

class PaymentType(enum.Enum):
    FULL = "100_percent"
    MORTGAGE = "mortgage"
    INSTALLMENT = "installment"

class TEPPaymentConfig(Base):
    __tablename__ = "tep_payment_configs"

    id = Column(Integer, primary_key=True, index=True)
    tep_id = Column(Integer, ForeignKey("project_teps.id", ondelete="CASCADE"))

    # Добавляем values_callable для синхронизации
    payment_type = Column(
        Enum(PaymentType, native_enum=False, values_callable=lambda obj: [item.value for item in obj]),
        nullable=False
    )
    share_percent = Column(Float, nullable=False)
    installment_months = Column(Integer, default=0)
    down_payment_percent = Column(Float, default=100.0)

    tep = relationship("ProjectTEP", back_populates="payment_configs")