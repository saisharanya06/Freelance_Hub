import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

# --------------------------------------------------
# Environment Variables
# --------------------------------------------------
MONGO_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGO_URL or not DATABASE_NAME:
    raise RuntimeError("MongoDB environment variables not set")

# --------------------------------------------------
# MongoDB Client
# --------------------------------------------------
client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]

# --------------------------------------------------
# Collections
# --------------------------------------------------
users_collection = db["users"]
projects_collection = db["projects"]
project_completions = db["project_completions"]

# --------------------------------------------------
# MongoDB Schema Documentation
# --------------------------------------------------
"""
USERS COLLECTION:
{
    "_id": ObjectId,
    "name": str,
    "email": str (unique),
    "password_hash": str,
    "created_at": datetime
}

PROJECTS COLLECTION:
{
    "_id": ObjectId,
    "title": str,
    "description": str,
    "budget": int,
    "tech_stack": [str],
    "status": str ("OPEN" | "COMPLETED"),
    "created_by": str (user_id),
    "created_at": datetime
}

PROJECT_COMPLETIONS COLLECTION:
{
    "_id": ObjectId,
    "user_id": str (reference to users._id),
    "project_id": str (reference to projects._id),
    "completed_at": datetime
}
"""

# --------------------------------------------------
# Database Initialization (Indexes)
# --------------------------------------------------
async def init_database():
    """
    Initialize database with required indexes.
    Call this once on app startup.
    """
    try:
        # Unique email for users
        await users_collection.create_index(
            "email",
            unique=True
        )

        # One completion per user per project
        await project_completions.create_index(
            [("user_id", 1), ("project_id", 1)],
            unique=True
        )

        print("✅ MongoDB indexes created successfully")

    except Exception as e:
        print(f"⚠️ Error creating MongoDB indexes: {e}")
