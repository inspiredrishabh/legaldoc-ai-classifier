from app.models.schemas import QAPair
from app.utils.text_processing import normalize, jaccard_similarity


class QAService:
    """Port of qaRetriever.js findAnswerFromQA()."""

    def __init__(self, qa_data: list[QAPair]):
        self._qa_data = qa_data

    def find_answer(self, query: str, threshold: float = 0.6) -> dict | None:
        """Find best matching QA pair above threshold.
        Returns dict with answer, source, confidence or None.
        """
        normalized_query = normalize(query)
        best_match: QAPair | None = None
        best_score: float = 0.0

        for qa in self._qa_data:
            score = jaccard_similarity(normalized_query, normalize(qa.question))
            if score > best_score:
                best_score = score
                best_match = qa

        if best_score >= threshold and best_match is not None:
            return {
                "answer": best_match.answer,
                "source": best_match.source,
                "confidence": best_score,
            }
        return None
