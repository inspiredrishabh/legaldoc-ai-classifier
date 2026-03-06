from fastapi import APIRouter, Depends
from app.models.schemas import AskRequest, AskResponse
from app.dependencies import get_pipeline_service
from app.services.pipeline_service import PipelineService

router = APIRouter(prefix="/v1")


@router.post("/ask", response_model=AskResponse)
async def ask_legal_question(
    request: AskRequest,
    pipeline: PipelineService = Depends(get_pipeline_service),
):
    result = await pipeline.ask_legal_question(request.query, language=request.language)
    return AskResponse(**result)
