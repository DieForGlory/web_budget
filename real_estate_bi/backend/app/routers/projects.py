from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.project import ProjectCreate, ProjectResponse
from app.models.project import Project, ProjectTEP
from app.models.payment import TEPPaymentConfig
from app.services.finance_calculator import generate_financial_model

router = APIRouter()


@router.post("/", response_model=ProjectResponse)
def create_project(project_in: ProjectCreate, db: Session = Depends(get_db)):
    project_data = project_in.dict(exclude={"teps"})
    db_project = Project(**project_data)

    db.add(db_project)
    db.flush()

    for tep_in in project_in.teps:
        tep_data = tep_in.dict(exclude={"payment_configs"})
        db_tep = ProjectTEP(project_id=db_project.id, **tep_data)
        db.add(db_tep)
        db.flush()

        for payment_in in tep_in.payment_configs:
            db_payment = TEPPaymentConfig(tep_id=db_tep.id, **payment_in.dict())
            db.add(db_payment)

    db.commit()
    db.refresh(db_project)

    # Передача project_in.dict() для доступа к вложенным структурам без дополнительных ORM-запросов
    generate_financial_model(db, db_project, project_in.dict())

    return db_project