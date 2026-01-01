from pydantic import BaseModel
from typing import List
from datetime import datetime
from pydantic import BaseModel
from typing import List


from typing import Optional

class ProjectCreate(BaseModel):
    title: str
    description: str
    budget: int
    tech_stack: List[str]
    createdBy: Optional[str] = None


class ProjectResponse(ProjectCreate):
    id: str
    status: str
    created_at: datetime
# from pydantic import BaseModel

class SignupSchema(BaseModel):
    name: str
    email: str
    password: str

class LoginSchema(BaseModel):
    email: str
    password: str
