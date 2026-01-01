from fastapi import APIRouter, HTTPException
from .schemas import SignupSchema, LoginSchema

router = APIRouter(prefix="/auth", tags=["Auth"])

# TEMP storage (later DB)
users = []

@router.post("/signup")
async def signup(data: SignupSchema):
    for u in users:
        if u["email"] == data.email:
            raise HTTPException(status_code=400, detail="User already exists")

    user = {
        "id": str(len(users) + 1),
        "name": data.name,
        "email": data.email,
        "password": data.password,
    }

    users.append(user)

    return {
        "success": True,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
        }
    }


@router.post("/login")
async def login(data: LoginSchema):
    for u in users:
        if u["email"] == data.email and u["password"] == data.password:
            return {
                "success": True,
                "user": {
                    "id": u["id"],
                    "name": u["name"],
                    "email": u["email"],
                }
            }

    raise HTTPException(status_code=401, detail="Invalid credentials")


    # raise HTTPException(status_code=401, detail="Invalid credentials")
