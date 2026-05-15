from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum
from datetime import date
from pydantic import BaseModel
from typing import List, Optional
from app.models.payment import PaymentType

class PropertyCategoryEnum(str, Enum):
    residential = "residential"
    commercial = "commercial"
    storage = "storage"
    parking = "parking"


class ProjectClassEnum(str, Enum):
    comfort = "Комфорт"
    business = "Бизнес"
    elite = "Элит"

class ProjectBase(BaseModel):
    name: str
    floors: str
    entrances: int
    apts_per_floor: Optional[int] = None
    commercial_area_sqm: float
    construction_duration_months: int
    project_class: ProjectClassEnum
    address: str

    monthly_price_increase_percent: float
    usd_exchange_rate: float
    sales_start_date: date
    avg_sales_pace_units: int
    seasonality_coefficients: Dict[str, float]  # Ключ - месяц (1-12), значение - процент

    total_expenses_usd: int

class PaymentConfigBase(BaseModel):
    payment_type: PaymentType
    share_percent: float
    installment_months: Optional[int] = 0
    down_payment_percent: Optional[float] = 100.0

class PaymentConfigCreate(PaymentConfigBase):
    pass

class PaymentConfigResponse(PaymentConfigBase):
    id: int
    tep_id: int

    class Config:
        from_attributes = True

class TEPBase(BaseModel):
    category: str
    units_count: int
    avg_price_sqm_usd: int
    avg_area_sqm: float

class TEPCreate(TEPBase):
    payment_configs: List[PaymentConfigCreate]

class TEPResponse(TEPBase):
    id: int
    project_id: int
    payment_configs: List[PaymentConfigResponse]

    class Config:
        orm_mode = True

class ProjectCreate(ProjectBase):
    teps: List[TEPCreate]


class ProjectResponse(ProjectBase):
    id: int
    teps: List[TEPResponse]

    class Config:
        from_attributes = True