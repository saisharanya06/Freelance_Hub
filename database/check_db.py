import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def check_database():
    client = AsyncIOMotorClient(os.getenv('MONGODB_URL'))
    db = client[os.getenv('DATABASE_NAME')]
    
    # Count projects
    count = await db.projects.count_documents({})
    print(f'\n✅ Total projects in database: {count}\n')
    
    # List all projects
    if count > 0:
        print('Projects:')
        async for p in db.projects.find():
            print(f"  - {p.get('title', 'Untitled')}")
            print(f"    Status: {p.get('status', 'N/A')}")
            print(f"    Budget: {p.get('budget', 0)}")
            print(f"    Tech: {p.get('tech_stack', [])}")
            print()
    else:
        print('❌ No projects found in database!')
    
    client.close()

if __name__ == '__main__':
    asyncio.run(check_database())