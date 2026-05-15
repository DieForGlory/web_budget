from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine
from app.models import base
from app.routers import projects, finance

base.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Real Estate BI Application")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(finance.router, prefix="/api/v1/finance", tags=["Finance"])