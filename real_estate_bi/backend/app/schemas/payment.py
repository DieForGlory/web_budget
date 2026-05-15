from pydantic import BaseModel

class PaymentMethodBase(BaseModel):
    name: str
    is_deferred: bool = False
    down_payment_percent: float = 100.0
    months_duration: int = 0

class PaymentMethodCreate(PaymentMethodBase):
    pass

class PaymentMethodResponse(PaymentMethodBase):
    id: int

    class Config:
        orm_mode = True