from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ProjectStatus(str, Enum):
    OPEN = "OPEN"
    COMPLETED = "COMPLETED"


class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    budget: int = Field(..., gt=0)
    tech_stack: List[str] = Field(..., min_items=1)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    budget: Optional[int] = Field(None, gt=0)
    tech_stack: Optional[List[str]] = Field(None, min_items=1)
    status: Optional[ProjectStatus] = None


class ProjectStatusUpdate(BaseModel):
    status: ProjectStatus


class Project(ProjectBase):
    id: str
    user_id: str                     # ⭐⭐⭐ ADD THIS LINE
    status: ProjectStatus = ProjectStatus.OPEN
    created_at: datetime

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
        populate_by_name = True
