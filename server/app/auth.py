# from fastapi import APIRouter, HTTPException, status
# from datetime import datetime
# from pydantic import BaseModel, EmailStr

# from .schemas import SignupSchema, LoginSchema
# from .database import users_collection
# from .jwt_utils import (
#     hash_password,
#     verify_password,
#     create_access_token
# )

# router = APIRouter(prefix="/auth", tags=["Auth"])


# # =====================================================
# # SIGNUP
# # =====================================================
# @router.post("/signup")
# async def signup(data: SignupSchema):
#     # Check if user already exists
#     existing_user = await users_collection.find_one({"email": data.email})
#     if existing_user:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="User with this email already exists"
#         )

#     # Hash password
#     hashed_password = hash_password(data.password)

#     # Create user document
#     user_doc = {
#         "name": data.name,
#         "email": data.email,
#         "password_hash": hashed_password,
#         "created_at": datetime.utcnow(),
#     }

#     # Insert user
#     result = await users_collection.insert_one(user_doc)

#     return {
#         "success": True,
#         "message": "User created successfully",
#         "user": {
#             "id": str(result.inserted_id),
#             "name": data.name,
#             "email": data.email,
#         }
#     }


# # =====================================================
# # LOGIN
# # =====================================================
# @router.post("/login")
# async def login(data: LoginSchema):
#     user = await users_collection.find_one({"email": data.email})
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid email or password"
#         )

#     if not verify_password(data.password, user["password_hash"]):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid email or password"
#         )

#     access_token = create_access_token(
#         data={
#             "id": str(user["_id"]),
#             "email": user["email"]
#         }
#     )

#     return {
#         "success": True,
#         "access_token": access_token,   # ✅ KEY FIX
#         "user": {
#             "id": str(user["_id"]),
#             "name": user["name"],
#             "email": user["email"],
#         }
#     }



# # =====================================================
# # DEBUG (OPTIONAL – DEV ONLY)
# # =====================================================
# @router.get("/debug/users")
# async def debug_users():
#     users = []
#     async for user in users_collection.find({}):
#         users.append({
#             "email": user["email"],
#             "id": str(user["_id"])
#         })
#     return users

from fastapi import APIRouter, HTTPException, status, Response
from datetime import datetime

from .schemas import SignupSchema, LoginSchema
from .database import users_collection
from .jwt_utils import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter(prefix="/auth", tags=["Auth"])


# =====================================================
# SIGNUP
# =====================================================
@router.post("/signup")
async def signup(data: SignupSchema, response: Response):
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Hash password
    hashed_password = hash_password(data.password)

    # Create user
    user_doc = {
        "name": data.name,
        "email": data.email,
        "password_hash": hashed_password,
        "created_at": datetime.utcnow(),
    }

    result = await users_collection.insert_one(user_doc)

    # Create JWT
    access_token = create_access_token(
        data={
            "id": str(result.inserted_id),
            "email": data.email
        }
    )

    # 🔥 SET COOKIE (AUTO LOGIN AFTER SIGNUP)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,      # REQUIRED (Render HTTPS)
        samesite="None"   # REQUIRED (Netlify ↔ Render)
    )

    return {
        "success": True,
        "message": "User created successfully",
        "user": {
            "id": str(result.inserted_id),
            "name": data.name,
            "email": data.email,
        }
    }


# =====================================================
# LOGIN
# =====================================================
@router.post("/login")
async def login(data: LoginSchema, response: Response):
    user = await users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Create JWT
    access_token = create_access_token(
        data={
            "id": str(user["_id"]),
            "email": user["email"]
        }
    )

    # 🔥 SET COOKIE (THIS FIXES EVERYTHING)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,      # REQUIRED (Render HTTPS)
        samesite="None"   # REQUIRED (Netlify ↔ Render)
    )

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
        }
    }


# =====================================================
# LOGOUT
# =====================================================
@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        secure=True,
        samesite="None"
    )
    return {"success": True, "message": "Logged out successfully"}


# =====================================================
# DEBUG (OPTIONAL – REMOVE IN PROD)
# =====================================================
@router.get("/debug/users")
async def debug_users():
    users = []
    async for user in users_collection.find({}):
        users.append({
            "email": user["email"],
            "id": str(user["_id"])
        })
    return users
