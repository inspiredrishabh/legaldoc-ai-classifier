from functools import lru_cache
from app.config import Settings
from app.loaders.data_loader import load_all_acts, load_all_qa
from app.services.qa_service import QAService
from app.services.retrieval_service import RetrievalService
from app.services.context_service import ContextService
from app.services.prompt_service import PromptService
from app.services.pipeline_service import PipelineService
from app.services.vision_service import VisionService
from app.services.summary_service import SummaryService
from app.services.timeline_service import TimelineService
from app.services.voice_service import VoiceService
from app.services.judgement_service import JudgementService


@lru_cache()
def get_settings() -> Settings:
    return Settings()


# Singleton service holders
_pipeline_service: PipelineService | None = None
_vision_service: VisionService | None = None
_summary_service: SummaryService | None = None
_timeline_service: TimelineService | None = None
_voice_service: VoiceService | None = None
_judgement_service: JudgementService | None = None


def init_services():
    """Called once during app lifespan startup.
    Loads data and initializes all service singletons.
    OCR engine (PaddleOCR) is lazy-initialized on first request.
    """
    global _pipeline_service, _vision_service
    global _summary_service, _timeline_service
    global _voice_service, _judgement_service
    settings = get_settings()

    acts_data = load_all_acts(settings)
    qa_data = load_all_qa(settings)

    qa_svc = QAService(qa_data)
    retrieval_svc = RetrievalService(acts_data)
    context_svc = ContextService()
    prompt_svc = PromptService()

    _pipeline_service = PipelineService(
        qa_svc, retrieval_svc, context_svc, prompt_svc, settings
    )

    # VisionService uses PaddleOCR (offline). The OCR engine is lazily loaded
    # on the first request, so startup stays fast.
    _vision_service = VisionService(lang=settings.OCR_LANG)
    print(f"OCR service initialised (lang={settings.OCR_LANG}, offline/PaddleOCR).")

    # New feature services
    _summary_service = SummaryService(settings)
    _timeline_service = TimelineService(settings)
    _voice_service = VoiceService(_pipeline_service, settings)
    _judgement_service = JudgementService(retrieval_svc, context_svc, settings)
    print("All AI feature services initialised.")


def get_pipeline_service() -> PipelineService:
    return _pipeline_service


def get_vision_service() -> VisionService:
    return _vision_service


def get_summary_service() -> SummaryService:
    return _summary_service


def get_timeline_service() -> TimelineService:
    return _timeline_service


def get_voice_service() -> VoiceService:
    return _voice_service


def get_judgement_service() -> JudgementService:
    return _judgement_service
