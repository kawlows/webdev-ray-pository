from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine, Session, select
from contextlib import contextmanager
from typing import List

from models import Patient

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = "sqlite:///./patients.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SQLModel.metadata.create_all(engine)


@contextmanager
def get_session():
    with Session(engine) as session:
        yield session


@app.get("/")
def read_root():
    return {"msg": "patient info system is up and running!"}


@app.get("/patients", response_model=List[Patient])
def get_patients():
    with Session(engine) as session:
        patients = session.exec(select(Patient)).all()
        return patients


@app.post("/patients", response_model=Patient)
def create_patient(patient: Patient):
    with Session(engine) as session:
        session.add(patient)
        session.commit()
        session.refresh(patient)
        return patient


@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int):
    with Session(engine) as session:
        patient = session.get(Patient, patient_id)
        if not patient:
            raise HTTPException(status_code=404, detail="patient not found")
        session.delete(patient)
        session.commit()
        return {"msg": "patient deleted"}
