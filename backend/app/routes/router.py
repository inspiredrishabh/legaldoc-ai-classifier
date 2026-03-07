from fastapi import APIRouter
from app.routes import health, ask, upload, summary, timeline, voice, judgement

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(ask.router, tags=["ask"])
api_router.include_router(upload.router, tags=["upload"])
api_router.include_router(summary.router, tags=["document-summary"])
api_router.include_router(timeline.router, tags=["timeline-generator"])
api_router.include_router(voice.router, tags=["voice-assistant"])
api_router.include_router(judgement.router, tags=["judgement-prediction"])
