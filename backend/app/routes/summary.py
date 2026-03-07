from fastapi import APIRouter, Depends
from app.models.schemas import SummaryRequest, SummaryResponse
from app.dependencies import get_summary_service
from app.services.summary_service import SummaryService

router = APIRouter(prefix="/v1")


@router.post("/summarize", response_model=SummaryResponse)
async def summarize_document(
    request: SummaryRequest,
    summary_svc: SummaryService = Depends(get_summary_service),
):
    result = await summary_svc.summarize_document(
        request.document_text,
        language=request.language,
        detail_level=request.detail_level,
    )
    return SummaryResponse(**result)
