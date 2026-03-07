from fastapi import APIRouter, Depends
from app.models.schemas import JudgementRequest, JudgementResponse
from app.dependencies import get_judgement_service
from app.services.judgement_service import JudgementService

router = APIRouter(prefix="/v1")


@router.post("/predict-judgement", response_model=JudgementResponse)
async def predict_judgement(
    request: JudgementRequest,
    judgement_svc: JudgementService = Depends(get_judgement_service),
):
    result = await judgement_svc.predict_judgement(
        request.case_description,
        case_type=request.case_type,
        language=request.language,
    )
    return JudgementResponse(**result)
