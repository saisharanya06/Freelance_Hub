from typing import List, Optional
from bson import ObjectId
from datetime import datetime
from .database import get_database
from .models import ProjectCreate, ProjectUpdate, ProjectStatus, Project


class ProjectService:
    @staticmethod
    def _project_helper(project) -> dict:
        """Helper function to format project document"""
        return {
            "id": str(project["_id"]),
            "title": project["title"],
            "description": project["description"],
            "budget": project["budget"],
            "techStack": project["tech_stack"],
            "status": project["status"],
            "created_at": project["created_at"],
        }

    @staticmethod
    async def create_project(project: ProjectCreate) -> dict:
        """Create a new project"""
        db = get_database()
        project_dict = project.model_dump()
        project_dict["status"] = ProjectStatus.OPEN
        project_dict["created_at"] = datetime.utcnow()

        result = await db.projects.insert_one(project_dict)
        new_project = await db.projects.find_one({"_id": result.inserted_id})
        return ProjectService._project_helper(new_project)

    @staticmethod
    async def get_all_projects(
        skip: int = 0, limit: int = 100, status: Optional[str] = None
    ) -> List[dict]:
        """Get all projects with optional filtering and pagination"""
        db = get_database()
        query = {}
        if status:
            query["status"] = status

        projects = []
        cursor = db.projects.find(query).skip(skip).limit(limit).sort("created_at", -1)
        async for project in cursor:
            projects.append(ProjectService._project_helper(project))
        return projects

    @staticmethod
    async def get_project_by_id(project_id: str) -> Optional[dict]:
        """Get a single project by ID"""
        db = get_database()
        if not ObjectId.is_valid(project_id):
            return None

        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if project:
            return ProjectService._project_helper(project)
        return None

    @staticmethod
    async def update_project_status(
        project_id: str, status: ProjectStatus
    ) -> Optional[dict]:
        """Update project status"""
        db = get_database()
        if not ObjectId.is_valid(project_id):
            return None

        result = await db.projects.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": {"status": status}},
            return_document=True,
        )

        if result:
            return ProjectService._project_helper(result)
        return None

    @staticmethod
    async def update_project(
        project_id: str, project_update: ProjectUpdate
    ) -> Optional[dict]:
        """Update project details"""
        db = get_database()
        if not ObjectId.is_valid(project_id):
            return None

        update_data = {
            k: v for k, v in project_update.model_dump().items() if v is not None
        }

        if not update_data:
            return await ProjectService.get_project_by_id(project_id)

        result = await db.projects.find_one_and_update(
            {"_id": ObjectId(project_id)}, {"$set": update_data}, return_document=True
        )

        if result:
            return ProjectService._project_helper(result)
        return None

    @staticmethod
    async def delete_project(project_id: str) -> bool:
        """Delete a project"""
        db = get_database()
        if not ObjectId.is_valid(project_id):
            return False

        result = await db.projects.delete_one({"_id": ObjectId(project_id)})
        return result.deleted_count > 0