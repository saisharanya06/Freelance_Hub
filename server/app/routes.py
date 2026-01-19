from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional
from datetime import datetime

from .models import ProjectCreate, ProjectStatusUpdate, Project
from .services import ProjectService
from app.database import project_completions
from app.dependencies import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api", tags=["projects"])
router = APIRouter(tags=["projects"])


# --------------------------------------------------
# CREATE PROJECT (LOGIN REQUIRED)
# --------------------------------------------------
@router.post("/projects", response_model=Project, status_code=201)
async def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_user)
):
    try:
        return await ProjectService.create_project(
            project,
            created_by=current_user["id"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------
# MARK PROJECT AS COMPLETED (USER-SPECIFIC)
# --------------------------------------------------
@router.post("/projects/{project_id}/complete")
async def complete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    existing = await project_completions.find_one({
        "user_id": current_user["id"],
        "project_id": project_id
    })

    if existing:
        return {"completed": True}

    await project_completions.insert_one({
        "user_id": current_user["id"],
        "project_id": project_id,
        "completed_at": datetime.utcnow()
    })

    return {"completed": True}


# --------------------------------------------------
# GET ALL PROJECTS (PUBLIC + OPTIONAL USER STATUS)
# --------------------------------------------------
@router.get("/projects")
async def get_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[str] = None,
    current_user: dict | None = Depends(get_current_user_optional)
):
    try:
        projects = await ProjectService.get_all_projects(
            skip=skip,
            limit=limit,
            status=status
        )

        # Add user-specific completion status
        if current_user:
            for project in projects:
                found = await project_completions.find_one({
                    "user_id": current_user["id"],
                    "project_id": str(project["_id"])
                })
                project["isCompleted"] = bool(found)
        else:
            for project in projects:
                project["isCompleted"] = False

        return projects

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --------------------------------------------------
# GET SINGLE PROJECT (PUBLIC)
# --------------------------------------------------
@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = await ProjectService.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# --------------------------------------------------
# UPDATE PROJECT STATUS (OWNER / ADMIN)
# --------------------------------------------------
@router.patch("/projects/{project_id}/status", response_model=Project)
async def update_project_status(
    project_id: str,
    status_update: ProjectStatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    project = await ProjectService.update_project_status(
        project_id,
        status_update.status,
        owner_id=current_user["id"]
    )

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project


# --------------------------------------------------
# DELETE PROJECT (ONLY OWNER)
# --------------------------------------------------
@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user)
):
    success = await ProjectService.delete_project(
        project_id,
        owner_id=current_user["id"]
    )

    if not success:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"message": "Project deleted successfully"}
