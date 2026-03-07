import logging

from app.services.llm_service import check_llm_connection, get_llm_provider
from app.config import Settings

logger = logging.getLogger(__name__)

SUMMARY_SYSTEM_PROMPT = (
    "You are an expert legal document summarizer specializing in Indian law. "
    "Create a clear, structured summary of the given legal document. "
    "Include: key parties involved, main legal provisions, obligations, "
    "important dates/deadlines, penalties, and critical clauses. "
    "Use bullet points for clarity."
)

SUMMARY_HINDI_SYSTEM = (
    "आप भारतीय कानून में विशेषज्ञ कानूनी दस्तावेज़ सारांशकर्ता हैं। "
    "दिए गए कानूनी दस्तावेज़ का स्पष्ट, संरचित सारांश बनाएं। "
    "शामिल करें: प्रमुख पक्ष, मुख्य कानूनी प्रावधान, दायित्व, "
    "महत्वपूर्ण तिथियां, दंड, और महत्वपूर्ण खंड। "
    "आपको अपना संपूर्ण उत्तर हिंदी में देवनागरी लिपि में लिखना होगा।"
)


class SummaryService:
    """Generates AI-powered summaries of legal documents."""

    def __init__(self, settings: Settings):
        self._settings = settings

    async def summarize_document(
        self, document_text: str, language: str = "en", detail_level: str = "standard"
    ) -> dict:
        """Summarize a legal document using the LLM.

        Args:
            document_text: The raw text of the document.
            language: 'en' or 'hi'.
            detail_level: 'brief', 'standard', or 'detailed'.

        Returns dict with keys: summary, key_points, word_count, status.
        """
        if not document_text or len(document_text.strip()) < 50:
            return {
                "summary": "",
                "key_points": [],
                "word_count": 0,
                "status": "error",
            }

        llm_available = await check_llm_connection(self._settings)
        if not llm_available:
            return {
                "summary": "AI engine is currently unavailable for document summarization.",
                "key_points": [],
                "word_count": 0,
                "status": "unavailable",
            }

        llm = get_llm_provider(self._settings)

        # Adjust context length based on detail level
        max_chars = {"brief": 2000, "standard": 4000, "detailed": 6000}.get(
            detail_level, 4000
        )
        text_for_summary = document_text[:max_chars]

        detail_instruction = {
            "brief": "Provide a concise 3-5 sentence summary.",
            "standard": "Provide a comprehensive summary with key points.",
            "detailed": "Provide an in-depth analysis covering every important aspect.",
        }.get(detail_level, "Provide a comprehensive summary with key points.")

        if language == "hi":
            prompt = (
                f"नीचे दिए गए कानूनी दस्तावेज़ का सारांश दें।\n\n"
                f"विस्तार स्तर: {detail_level}\n\n"
                "कृपया बताएं:\n"
                "1. मुख्य सारांश\n"
                "2. प्रमुख बिंदु (बुलेट पॉइंट्स में)\n"
                "3. महत्वपूर्ण कानूनी प्रावधान\n\n"
                f"दस्तावेज़ पाठ:\n{text_for_summary}\n\n"
                "सारांश (केवल हिंदी में):"
            )
            system_message = SUMMARY_HINDI_SYSTEM
        else:
            prompt = (
                f"Summarize the following legal document.\n\n"
                f"Detail Level: {detail_instruction}\n\n"
                "Please include:\n"
                "1. Main Summary\n"
                "2. Key Points (as bullet points)\n"
                "3. Important Legal Provisions\n"
                "4. Parties & Obligations (if applicable)\n\n"
                f"Document Text:\n{text_for_summary}\n\n"
                "Summary:"
            )
            system_message = SUMMARY_SYSTEM_PROMPT

        try:
            result = await llm.generate_answer(prompt, system_message=system_message)
        except Exception as exc:
            logger.error("Summary LLM call failed: %s", exc)
            return {
                "summary": "Failed to generate summary due to an AI processing error.",
                "key_points": [],
                "word_count": 0,
                "status": "error",
            }

        if not result or not result.strip():
            return {
                "summary": "The AI could not generate a summary for this document.",
                "key_points": [],
                "word_count": 0,
                "status": "error",
            }

        # Extract key points from bullet-point lines
        key_points = [
            line.strip().lstrip("-•*").strip()
            for line in result.split("\n")
            if line.strip().startswith(("-", "•", "*"))
            and len(line.strip()) > 5
        ]

        return {
            "summary": result.strip(),
            "key_points": key_points[:10],
            "word_count": len(result.split()),
            "status": "completed",
        }
