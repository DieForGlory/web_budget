from app.core.database import engine
from app.models.base import Base
from app.models.project import Project
from app.models.finance import FinancialModel
from app.models.payment import Payment

print("Создание таблиц...")
Base.metadata.create_all(bind=engine)
print("Готово.")