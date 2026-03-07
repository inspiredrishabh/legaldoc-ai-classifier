from fastapi import APIRouter, Depends
from app.models.schemas import VoiceQueryRequest, VoiceQueryResponse
from app.dependencies import get_voice_service
from app.services.voice_service import VoiceService

router = APIRouter(prefix="/v1")


@router.post("/voice-query", response_model=VoiceQueryResponse)
async def voice_query(
    request: VoiceQueryRequest,
    voice_svc: VoiceService = Depends(get_voice_service),
):
    result = await voice_svc.process_voice_query(
        request.transcript, language=request.language
    )
    return VoiceQueryResponse(**result)
