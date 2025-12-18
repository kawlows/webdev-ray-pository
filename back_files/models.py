from sqlmodel import SQLModel, Field
from typing import Optional

class Patient(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    age: int
    contact: str
    medical_history: Optional[str] = None
