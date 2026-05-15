from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, Date, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base
import enum


class PropertyCategory(enum.Enum):
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    STORAGE = "storage"
    PARKING = "parking"


class ProjectClass(str, enum.Enum):
    COMFORT = "Комфорт"
    BUSINESS = "Бизнес"
    ELITE = "Элит"


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    # Шаг 1: Базовая информация
    name = Column(String, index=True, nullable=False)
    floors = Column(String, nullable=False)  # Поддерживает точное значение "16" или диапазон "12-16"
    entrances = Column(Integer, nullable=False)
    apts_per_floor = Column(Integer, nullable=True)
    commercial_area_sqm = Column(Float, nullable=False)
    construction_duration_months = Column(Integer, nullable=False)
    project_class = Column(
        Enum(ProjectClass, native_enum=False, values_callable=lambda obj: [item.value for item in obj]),
        nullable=False
    )
    address = Column(String, nullable=False)

    # Шаг 3: Финансовые и сбытовые параметры
    monthly_price_increase_percent = Column(Float, nullable=False)
    usd_exchange_rate = Column(Float, nullable=False)
    sales_start_date = Column(Date, nullable=False)
    avg_sales_pace_units = Column(Integer, nullable=False)
    seasonality_coefficients = Column(JSON, nullable=False)  # Формат: {"1": 100, "2": 95, ..., "12": 110}

    # Шаг 4: Расходная часть
    total_expenses_usd = Column(Integer, nullable=False)  # Единый числовой формат integer

    teps = relationship("ProjectTEP", back_populates="project", cascade="all, delete-orphan")
    financial_models = relationship("FinancialModel", back_populates="project")

class ProjectTEP(Base):
    __tablename__ = "project_teps"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    category = Column(
        Enum(PropertyCategory, native_enum=False, values_callable=lambda obj: [item.value for item in obj]),
        nullable=False
    )

    units_count = Column(Integer, nullable=False)
    avg_price_sqm_usd = Column(Integer, nullable=False)
    avg_area_sqm = Column(Float, nullable=False)

    project = relationship("Project", back_populates="teps")
    payment_configs = relationship("TEPPaymentConfig", back_populates="tep", cascade="all, delete-orphan")