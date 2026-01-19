from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from bson import ObjectId

from .database import (
    projects_collection,
    project_completions,
    init_database,
)
from .schemas import ProjectCreate, ProjectUpdate, ProjectResponse
from .dependencies import (
    get_current_user,
    get_current_user_optional,
)
from .auth import router as auth_router

app = FastAPI(title="Freelance Projects API")


# =====================================================
# CORS (MUST BE BEFORE ROUTES)
# =====================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://freelancehub-a39aca.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# STARTUP – INIT INDEXES
# =====================================================
@app.on_event("startup")
async def startup_event():
    await init_database()


# =====================================================
# ROUTERS
# =====================================================
app.include_router(auth_router)


@app.get("/")
def root():
    return {"status": "Backend running"}


# =====================================================
# GET ALL PROJECTS (OPTIONAL USER COMPLETION)
# =====================================================
@app.get("/projects")
async def get_projects(current_user=Depends(get_current_user_optional)):
    projects = []

    async for p in projects_collection.find().sort("created_at", -1):
        project_id = str(p["_id"])

        is_completed = False
        if current_user:
            completion = await project_completions.find_one({
                "user_id": current_user["id"],
                "project_id": project_id
            })
            is_completed = completion is not None

        projects.append({
            "id": project_id,
            "title": p.get("title"),
            "description": p.get("description"),
            "budget": p.get("budget"),
            "tech_stack": p.get("tech_stack", []),
            "status": p.get("status", "OPEN"),
            "created_by": p.get("created_by"),
            "created_at": (
                p["created_at"].isoformat()
                if p.get("created_at") else None
            ),
            "isCompleted": is_completed,  # USER-SPECIFIC
        })

    return projects


# =====================================================
# CREATE PROJECT (AUTH REQUIRED)
# =====================================================
@app.post("/projects", status_code=200, response_model=ProjectResponse)
async def create_project(
    data: ProjectCreate,
    current_user=Depends(get_current_user),
):
    now = datetime.utcnow()

    project = {
        "title": data.title,
        "description": data.description,
        "budget": data.budget,
        "tech_stack": data.tech_stack,
        "status": "OPEN",
        "created_by": current_user["id"],  # OWNER
        "created_at": now,
    }

    res = await projects_collection.insert_one(project)

    return {
        "id": str(res.inserted_id),
        **project,
        "created_at": now.isoformat(),
        "isCompleted": False,
    }


# =====================================================
# MARK PROJECT AS COMPLETED (USER-SPECIFIC)
# =====================================================
@app.patch("/projects/{project_id}/complete")
async def mark_project_completed(
    project_id: str,
    current_user=Depends(get_current_user),
):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )

    project = await projects_collection.find_one(
        {"_id": ObjectId(project_id)}
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    existing = await project_completions.find_one({
        "user_id": current_user["id"],
        "project_id": project_id
    })

    if existing:
        return {
            "id": project_id,
            "isCompleted": True,
            "message": "Already completed"
        }

    await project_completions.insert_one({
        "user_id": current_user["id"],
        "project_id": project_id,
        "completed_at": datetime.utcnow()
    })

    return {
        "id": project_id,
        "isCompleted": True,
        "message": "Project marked as completed"
    }


# =====================================================
# GET SINGLE PROJECT (OPTIONAL USER COMPLETION)
# =====================================================
@app.get("/projects/{project_id}")
async def get_project(
    project_id: str,
    current_user=Depends(get_current_user_optional),
):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )

    project = await projects_collection.find_one(
        {"_id": ObjectId(project_id)}
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    is_completed = False
    if current_user:
        completion = await project_completions.find_one({
            "user_id": current_user["id"],
            "project_id": project_id
        })
        is_completed = completion is not None

    return {
        "id": str(project["_id"]),
        "title": project.get("title"),
        "description": project.get("description"),
        "budget": project.get("budget"),
        "tech_stack": project.get("tech_stack", []),
        "status": project.get("status", "OPEN"),
        "created_by": project.get("created_by"),
        "created_at": (
            project["created_at"].isoformat()
            if project.get("created_at") else None
        ),
        "isCompleted": is_completed,
    }


# =====================================================
# GET CURRENT USER COMPLETED PROJECTS
# =====================================================
@app.get("/projects/completed/me")
async def get_my_completed_projects(
    current_user=Depends(get_current_user),
):
    completed_projects = []

    async for completion in project_completions.find(
        {"user_id": current_user["id"]}
    ):
        project_id = completion["project_id"]

        if ObjectId.is_valid(project_id):
            project = await projects_collection.find_one(
                {"_id": ObjectId(project_id)}
            )

            if project:
                completed_projects.append({
                    "id": str(project["_id"]),
                    "title": project.get("title"),
                    "description": project.get("description"),
                    "budget": project.get("budget"),
                    "tech_stack": project.get("tech_stack", []),
                    "status": project.get("status", "OPEN"),
                    "created_by": project.get("created_by"),
                    "created_at": (
                        project["created_at"].isoformat()
                        if project.get("created_at") else None
                    ),
                    "isCompleted": True,
                    "completed_at": (
                        completion["completed_at"].isoformat()
                        if completion.get("completed_at") else None
                    ),
                })

    return completed_projects


# =====================================================
# EDIT PROJECT (OWNERSHIP REQUIRED)
# =====================================================
@app.put("/projects/{project_id}")
async def edit_project(
    project_id: str,
    data: ProjectUpdate,
    current_user=Depends(get_current_user),
):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )

    project = await projects_collection.find_one(
        {"_id": ObjectId(project_id)}
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Check ownership
    if project.get("created_by") != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the project creator can edit this project"
        )

    # Build update object
    update_data = {}
    if data.title is not None:
        update_data["title"] = data.title
    if data.description is not None:
        update_data["description"] = data.description
    if data.budget is not None:
        update_data["budget"] = data.budget
    if data.tech_stack is not None:
        update_data["tech_stack"] = data.tech_stack
    if data.status is not None:
        update_data["status"] = data.status

    if not update_data:
        return {
            "id": project_id,
            "message": "No updates provided"
        }

    update_data["updated_at"] = datetime.utcnow()

    await projects_collection.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": update_data}
    )

    updated_project = await projects_collection.find_one(
        {"_id": ObjectId(project_id)}
    )

    return {
        "id": str(updated_project["_id"]),
        "title": updated_project.get("title"),
        "description": updated_project.get("description"),
        "budget": updated_project.get("budget"),
        "tech_stack": updated_project.get("tech_stack", []),
        "status": updated_project.get("status", "OPEN"),
        "created_by": updated_project.get("created_by"),
        "created_at": (
            updated_project["created_at"].isoformat()
            if updated_project.get("created_at") else None
        ),
        "updated_at": (
            updated_project["updated_at"].isoformat()
            if updated_project.get("updated_at") else None
        ),
        "message": "Project updated successfully"
    }


# =====================================================
# DELETE PROJECT (OWNERSHIP REQUIRED)
# =====================================================
@app.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    current_user=Depends(get_current_user),
):
    if not ObjectId.is_valid(project_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project ID"
        )

    project = await projects_collection.find_one(
        {"_id": ObjectId(project_id)}
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Check ownership
    if project.get("created_by") != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the project creator can delete this project"
        )

    # Delete the project
    await projects_collection.delete_one(
        {"_id": ObjectId(project_id)}
    )

    # Clean up completions
    await project_completions.delete_many(
        {"project_id": project_id}
    )

    return {
        "id": project_id,
        "message": "Project deleted successfully"
    }


# =====================================================
# GET USER'S POSTED PROJECTS
# =====================================================
@app.get("/projects/user/me")
async def get_my_projects(
    current_user=Depends(get_current_user),
):
    user_projects = []

    async for p in projects_collection.find(
        {"created_by": current_user["id"]}
    ).sort("created_at", -1):
        project_id = str(p["_id"])

        user_projects.append({
            "id": project_id,
            "title": p.get("title"),
            "description": p.get("description"),
            "budget": p.get("budget"),
            "tech_stack": p.get("tech_stack", []),
            "status": p.get("status", "OPEN"),
            "created_by": p.get("created_by"),
            "created_at": (
                p["created_at"].isoformat()
                if p.get("created_at") else None
            ),
            "updated_at": (
                p.get("updated_at").isoformat()
                if p.get("updated_at") else None
            ),
        })

    return user_projects
