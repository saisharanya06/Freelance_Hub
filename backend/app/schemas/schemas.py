from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# =====================================================
# PROJECT SCHEMAS
# =====================================================
class ProjectCreate(BaseModel):
    """Schema for creating a new project"""
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    budget: int = Field(..., gt=0)
    tech_stack: List[str] = Field(..., min_items=1)


class ProjectUpdate(BaseModel):
    """Schema for updating a project"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1)
    budget: Optional[int] = Field(None, gt=0)
    tech_stack: Optional[List[str]] = Field(None, min_items=1)
    status: Optional[str] = Field(None)


class ProjectResponse(BaseModel):
    """Schema for project response with user-specific completion"""
    id: str
    title: str
    description: str
    budget: int
    tech_stack: List[str]
    status: str
    created_by: Optional[str] = None
    created_at: str
    isCompleted: bool = False  # User-specific completion flag


# =====================================================
# AUTHENTICATION SCHEMAS
# =====================================================
class SignupSchema(BaseModel):
    """Schema for user signup"""
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=6)


class LoginSchema(BaseModel):
    """Schema for user login"""
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    """Schema for user response"""
    id: str
    name: str
    email: str
    token: Optional[str] = None


# =====================================================
# COMPLETION SCHEMAS
# =====================================================
class CompletionResponse(BaseModel):
    """Schema for project completion response"""
    id: str
    isCompleted: bool
    message: Optional[str] = None