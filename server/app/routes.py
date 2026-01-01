from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from .models import ProjectCreate, ProjectStatusUpdate, Project
from .services import ProjectService

router = APIRouter(prefix="/api", tags=["projects"])


@router.post("/projects", response_model=Project, status_code=201)
async def create_project(project: ProjectCreate):
    """Create a new freelance project"""
    try:
        new_project = await ProjectService.create_project(project)
        return new_project
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/projects")
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = None,
):
    """Get all projects with optional filtering and pagination"""
    try:
        projects = await ProjectService.get_all_projects(skip, limit, status)
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    """Get project by ID"""
    project = await ProjectService.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.patch("/projects/{project_id}/status", response_model=Project)
async def update_project_status(project_id: str, status_update: ProjectStatusUpdate):
    """Update project status (mark as completed)"""
    project = await ProjectService.update_project_status(
        project_id, status_update.status
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    """Delete a project"""
    success = await ProjectService.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}