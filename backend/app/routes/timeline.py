from fastapi import APIRouter, Depends
from app.models.schemas import TimelineRequest, TimelineResponse
from app.dependencies import get_timeline_service
from app.services.timeline_service import TimelineService

router = APIRouter(prefix="/v1")


@router.post("/generate-timeline", response_model=TimelineResponse)
async def generate_timeline(
    request: TimelineRequest,
    timeline_svc: TimelineService = Depends(get_timeline_service),
):
    result = await timeline_svc.generate_timeline(
        request.document_text, language=request.language
    )
    return TimelineResponse(**result)
