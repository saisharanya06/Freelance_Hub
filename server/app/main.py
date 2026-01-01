from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from .auth import router as auth_router
from .database import projects_collection
from .schemas import ProjectCreate
from bson import ObjectId
from fastapi import HTTPException



app = FastAPI()

# 🔥 ABSOLUTE CORS (development safe)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)   # 🔥 THIS LINE FIXES 404

@app.get("/")
async def root():
    return {"status": "Backend running"}

@app.get("/projects")
async def get_projects():
    projects = []
    async for project in projects_collection.find():
        projects.append({
            "id": str(project["_id"]),
            "title": project["title"],
            "description": project["description"],
            "budget": project["budget"],
            "tech_stack": project["tech_stack"],
            "status": project["status"],
            "created_at": project["created_at"].isoformat() if isinstance(project["created_at"], datetime) else project["created_at"],
        })
        
    return projects

@app.post("/projects")
async def create_project(data: ProjectCreate):
    now = datetime.utcnow()
    project = {

        "title": data.title,
        "description": data.description,
        "budget": data.budget,
        "tech_stack": data.tech_stack,
        "status": "OPEN",
        "createdBy": data.createdBy,
        "created_at": datetime.utcnow(),
    }

    result = await projects_collection.insert_one(project)

@app.patch("/projects/{project_id}/complete")
async def mark_project_complete(project_id: str):
    result = await projects_collection.update_one(
        {"_id": ObjectId(project_id)},
        {"$set": {"status": "COMPLETED"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"success": True, "status": "COMPLETED"}


    
    # Return serializable response
    return {
        "id": str(result.inserted_id),
        "title": project["title"],
        "description": project["description"],
        "budget": project["budget"],
        "tech_stack": project["tech_stack"],
        "status": project["status"],
        "created_at": now.isoformat(),
    }
