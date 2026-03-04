from app.services.qa_service import QAService
from app.services.retrieval_service import RetrievalService
from app.services.context_service import ContextService
from app.services.llm_service import check_llm_connection, get_llm_provider
from app.services.prompt_service import PromptService
from app.config import Settings


class PipelineService:
    """Port of askLegalQuestion.js askLegalQuestion().
    Preserves the exact 6-step pipeline flow and fallback behavior.
    """

    def __init__(
        self,
        qa_service: QAService,
        retrieval_service: RetrievalService,
        context_service: ContextService,
        prompt_service: PromptService,
        settings: Settings,
    ):
        self._qa = qa_service
        self._retrieval = retrieval_service
        self._context = context_service
        self._prompt = prompt_service
        self._settings = settings

    async def ask_legal_question(self, query: str) -> dict:
        # Step 1: Try QA dataset (threshold 0.85 for direct return)
        qa_result = self._qa.find_answer(query)
        if qa_result and qa_result["confidence"] >= 0.85:
            return {
                "answer": qa_result["answer"],
                "source": qa_result["source"],
                "method": "qa_dataset",
                "confidence": qa_result["confidence"],
            }

        # Step 2: Retrieve relevant sections
        sections = self._retrieval.retrieve_relevant_sections(query)
        if not sections:
            return {
                "answer": "No relevant legal provision was found for this query in the available Acts.",
                "source": "acts",
                "method": "fallback",
            }

        # Step 3: Build context
        context = self._context.build_context(sections)
        if not context or len(context) < 100:
            return {
                "answer": "Relevant legal provisions were found, but insufficient text was available to generate a reliable explanation.",
                "source": "acts",
                "method": "fallback",
            }

        # Step 4: Check LLM availability
        llm_available = await check_llm_connection(self._settings)
        if not llm_available:
            return {
                "answer": "AI engine is currently unavailable. Showing legal text-based information only.",
                "source": "system",
                "method": "no_llm",
            }

        # Step 5: Call LLM
        llm = get_llm_provider(self._settings)
        prompt = self._prompt.build_prompt(context, query)
        try:
            llm_answer = await llm.generate_answer(prompt)
        except Exception:
            return {
                "answer": "An error occurred while generating an AI-based explanation.",
                "source": "llm",
                "method": "error",
            }

        if not llm_answer or not llm_answer.strip():
            return {
                "answer": "The AI model could not generate a reliable answer from the provided legal context.",
                "source": "llm",
                "method": "fallback",
            }

        # Step 6: Final successful response
        return {
            "answer": llm_answer,
            "source": "LLM + Legal Acts",
            "method": "llm",
        }
