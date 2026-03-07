import logging

from app.services.llm_service import check_llm_connection, get_llm_provider
from app.config import Settings

logger = logging.getLogger(__name__)

TIMELINE_SYSTEM_PROMPT = (
    "You are an expert legal analyst specializing in Indian law. "
    "Extract and organize a chronological timeline of events, dates, deadlines, "
    "and key legal milestones from the given legal document or case description. "
    "Format each event as: [DATE/PERIOD] - [EVENT DESCRIPTION]. "
    "If exact dates are not available, use relative time references. "
    "Include filing dates, hearing dates, limitation periods, appeal deadlines, "
    "and statutory timelines applicable under Indian law."
)

TIMELINE_HINDI_SYSTEM = (
    "आप भारतीय कानून में विशेषज्ञ कानूनी विश्लेषक हैं। "
    "दिए गए कानूनी दस्तावेज़ या मामले के विवरण से घटनाओं, तिथियों, "
    "समय-सीमाओं और प्रमुख कानूनी मील के पत्थरों की कालानुक्रमिक समयरेखा निकालें। "
    "आपको अपना संपूर्ण उत्तर हिंदी में देवनागरी लिपि में लिखना होगा।"
)


class TimelineService:
    """Extracts and generates legal timelines from document text or case descriptions."""

    def __init__(self, settings: Settings):
        self._settings = settings

    async def generate_timeline(
        self, document_text: str, language: str = "en"
    ) -> dict:
        """Generate a legal timeline from text using the LLM.

        Returns dict with keys: timeline, event_count, status.
        """
        if not document_text or len(document_text.strip()) < 30:
            return {
                "timeline": "",
                "event_count": 0,
                "status": "error",
            }

        llm_available = await check_llm_connection(self._settings)
        if not llm_available:
            return {
                "timeline": "AI engine is currently unavailable for timeline generation.",
                "event_count": 0,
                "status": "unavailable",
            }

        llm = get_llm_provider(self._settings)
        text_for_analysis = document_text[:5000]

        if language == "hi":
            prompt = (
                "नीचे दिए गए कानूनी दस्तावेज़/मामले से कालानुक्रमिक समयरेखा निकालें।\n\n"
                "प्रत्येक घटना के लिए:\n"
                "- [तिथि/अवधि] — [घटना का विवरण]\n\n"
                "इसमें शामिल करें:\n"
                "• दाखिल करने की तिथियां\n"
                "• सुनवाई की तिथियां\n"
                "• परिसीमा अवधि\n"
                "• अपील की समयसीमा\n"
                "• वैधानिक समयसीमाएं\n\n"
                f"दस्तावेज़ पाठ:\n{text_for_analysis}\n\n"
                "समयरेखा (केवल हिंदी में):"
            )
            system_message = TIMELINE_HINDI_SYSTEM
        else:
            prompt = (
                "Extract a chronological legal timeline from the following document/case.\n\n"
                "For each event provide:\n"
                "- [DATE/PERIOD] — [EVENT DESCRIPTION]\n\n"
                "Include:\n"
                "• Filing dates\n"
                "• Hearing dates\n"
                "• Limitation periods\n"
                "• Appeal deadlines\n"
                "• Statutory timelines\n"
                "• Key legal milestones\n\n"
                "If exact dates aren't available, use relative references.\n"
                "Order events chronologically.\n\n"
                f"Document Text:\n{text_for_analysis}\n\n"
                "Legal Timeline:"
            )
            system_message = TIMELINE_SYSTEM_PROMPT

        try:
            result = await llm.generate_answer(prompt, system_message=system_message)
        except Exception as exc:
            logger.error("Timeline LLM call failed: %s", exc)
            return {
                "timeline": "Failed to generate timeline due to an AI processing error.",
                "event_count": 0,
                "status": "error",
            }

        if not result or not result.strip():
            return {
                "timeline": "The AI could not extract a timeline from this document.",
                "event_count": 0,
                "status": "error",
            }

        # Count timeline events (lines with date-like patterns or bullet points)
        event_count = sum(
            1 for line in result.split("\n")
            if line.strip()
            and (
                line.strip().startswith(("-", "•", "*"))
                or line.strip()[0].isdigit()
            )
        )

        return {
            "timeline": result.strip(),
            "event_count": max(event_count, 1),
            "status": "completed",
        }
