from fastapi import APIRouter
from app.routes import health, ask, upload

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(ask.router, tags=["ask"])
api_router.include_router(upload.router, tags=["upload"])
