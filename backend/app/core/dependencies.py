from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from jose import JWTError, jwt
from bson import ObjectId
from database.connection import users_collection
from backend.app.core.config import SECRET_KEY, ALGORITHM

# Function to get token from cookie or header
async def get_token(request: Request):
    # Check cookie first
    token = request.cookies.get("access_token")
    if token:
        return token
    
    # Check Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    
    return None

async def get_current_user(request: Request):
    """Get current user (required authentication)"""
    token = await get_token(request)
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("id")
        if not user_id:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise credentials_exception

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name"),
    }


async def get_current_user_optional(request: Request):
    """Get current user if token provided, otherwise return None"""
    token = await get_token(request)
    if not token:
        return None
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("id")
        if not user_id:
            return None
        
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return None
        
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name"),
        }
    except (JWTError, ValueError, TypeError):
        return None
