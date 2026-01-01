from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://saisharanya747721_db_user:FJQdJuhxGQAVMUv9@freelancehub.pipsqjb.mongodb.net/?appName=freelancehub"

client = AsyncIOMotorClient(MONGO_URL)
db = client.freelancehub
projects_collection = db.projects
