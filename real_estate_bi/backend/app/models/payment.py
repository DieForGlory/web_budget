import enum
from sqlalchemy import Column, Integer, String, Float, Boolean, Enum
from app.models.base import Base

class PaymentType(enum.Enum):
    FULL = "100_percent"
    MORTGAGE = "mortgage"
    INSTALLMENT = "installment"