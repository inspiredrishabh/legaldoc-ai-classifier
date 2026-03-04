"""Tests for pipeline service - integration tests with mocked LLM."""
import pytest
from unittest.mock import AsyncMock, patch
from app.services.qa_service import QAService
from app.services.retrieval_service import RetrievalService
from app.services.context_service import ContextService
from app.services.prompt_service import PromptService
from app.services.pipeline_service import PipelineService
from app.models.schemas import ActSection, QAPair
from app.config import Settings


def _make_pipeline(qa_data=None, acts_data=None, settings=None):
    if settings is None:
        settings = Settings()
    if qa_data is None:
        qa_data = [
            QAPair(source="TEST", question="what is bail under crpc", answer="Bail is the release of accused..."),
        ]
    if acts_data is None:
        acts_data = [
            ActSection(act="CRPC", section="437", title="When bail may be taken", text="When any person accused of a non-bailable offence is arrested"),
            ActSection(act="CRPC", section="438", title="Direction for grant of bail", text="Where any person has reason to believe arrested bail"),
        ]

    return PipelineService(
        qa_service=QAService(qa_data),
        retrieval_service=RetrievalService(acts_data),
        context_service=ContextService(),
        prompt_service=PromptService(),
        settings=settings,
    )


@pytest.mark.asyncio
async def test_pipeline_qa_dataset_match():
    """High-confidence QA match returns qa_dataset method."""
    pipeline = _make_pipeline()
    result = await pipeline.ask_legal_question("what is bail under crpc")
    assert result["method"] == "qa_dataset"
    assert result["confidence"] >= 0.85


@pytest.mark.asyncio
async def test_pipeline_no_sections_fallback():
    """No matching sections returns fallback."""
    pipeline = _make_pipeline(qa_data=[], acts_data=[])
    result = await pipeline.ask_legal_question("something completely unrelated xyz")
    assert result["method"] == "fallback"


@pytest.mark.asyncio
async def test_pipeline_llm_unavailable():
    """When LLM is unavailable, returns no_llm method."""
    pipeline = _make_pipeline(qa_data=[])
    with patch("app.services.pipeline_service.check_llm_connection", new_callable=AsyncMock, return_value=False):
        result = await pipeline.ask_legal_question("bail under crpc section 437")
    assert result["method"] == "no_llm"


@pytest.mark.asyncio
async def test_pipeline_llm_success():
    """When LLM succeeds, returns llm method."""
    pipeline = _make_pipeline(qa_data=[])

    mock_provider = AsyncMock()
    mock_provider.generate_answer.return_value = "This is a comprehensive legal explanation about bail."

    with patch("app.services.pipeline_service.check_llm_connection", new_callable=AsyncMock, return_value=True), \
         patch("app.services.pipeline_service.get_llm_provider", return_value=mock_provider):
        result = await pipeline.ask_legal_question("bail under crpc section 437")

    assert result["method"] == "llm"
    assert "bail" in result["answer"].lower()


@pytest.mark.asyncio
async def test_pipeline_llm_error():
    """When LLM throws, returns error method."""
    pipeline = _make_pipeline(qa_data=[])

    mock_provider = AsyncMock()
    mock_provider.generate_answer.side_effect = Exception("Connection refused")

    with patch("app.services.pipeline_service.check_llm_connection", new_callable=AsyncMock, return_value=True), \
         patch("app.services.pipeline_service.get_llm_provider", return_value=mock_provider):
        result = await pipeline.ask_legal_question("bail under crpc section 437")

    assert result["method"] == "error"
