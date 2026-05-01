from fastapi import APIRouter, HTTPException, status, Response
from datetime import datetime
import os

from backend.app.schemas.schemas import SignupSchema, LoginSchema
from database.connection import users_collection
from backend.app.core.jwt_utils import (
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
    is_prod = os.getenv("RENDER") is not None
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=is_prod,
        samesite="None" if is_prod else "Lax"
    )

    return {
        "success": True,
        "message": "User created successfully",
        "access_token": access_token, # Added to JSON for frontend
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
    print(f"DEBUG: Login attempt for email: {data.email}")
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
    is_prod = os.getenv("RENDER") is not None
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=is_prod,
        samesite="None" if is_prod else "Lax"
    )

    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token, # Added to JSON for frontend
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
