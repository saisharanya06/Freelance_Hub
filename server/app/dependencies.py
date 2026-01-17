from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from bson import ObjectId
from app.database import users_collection
from app.config import SECRET_KEY, ALGORITHM

# Single instance reused for both required and optional auth
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user (required authentication)"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
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


async def get_current_user_optional(token: Optional[str] = Depends(oauth2_scheme_optional)):
    """Get current user if token provided, otherwise return None"""
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
