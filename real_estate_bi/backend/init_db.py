# backend/init_db.py
from app.core.database import engine
from app.models.base import Base
# Обязательно импортируем все модели, чтобы Base их "зарегистрировал"
from app.models.project import Project, ProjectTEP
from app.models.finance import FinancialModel

def init_db():
    print("Создание таблиц в базе данных...")
    Base.metadata.create_all(bind=engine)
    print("Таблицы успешно созданы.")

if __name__ == "__main__":
    init_db()