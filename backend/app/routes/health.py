from fastapi import APIRouter, Depends
from app.models.schemas import HealthResponse
from app.dependencies import get_settings
from app.config import Settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check(settings: Settings = Depends(get_settings)):
    return HealthResponse(
        status="ok",
        service="LegalDoc AI Backend",
        llm_mode=settings.LLM_MODE,
    )
