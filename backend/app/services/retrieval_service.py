import re
from app.models.schemas import ActSection

# Port of actMatcher.js ACT_KEYWORDS
ACT_KEYWORDS: dict[str, list[str]] = {
    "IPC": ["ipc", "penal", "murder", "theft", "rape", "crime"],
    "CRPC": ["crpc", "procedure", "bail", "arrest", "trial"],
    "CPC": ["cpc", "civil procedure", "suit", "injunction"],
    "IEA": ["evidence", "proof", "witness"],
    "HMA": ["marriage", "divorce", "husband", "wife"],
    "IDA": ["divorce act"],
    "MVA": ["motor", "vehicle", "accident"],
    "NIA": ["cheque", "negotiable", "dishonour"],
}


class RetrievalService:
    """Port of all retrieval modules: queryAnalyzer, actMatcher,
    sectionMatcher, ranker, retrieveSections.
    """

    def __init__(self, acts_data: list[ActSection]):
        self._acts_data = acts_data

    def analyze_query(self, query: str) -> dict:
        """Port of queryAnalyzer.js analyzeQuery()."""
        normalized = query.lower()
        normalized = re.sub(r"[^a-z0-9\s]", " ", normalized)
        normalized = re.sub(r"\s+", " ", normalized).strip()
        tokens = normalized.split(" ")
        return {"original": query, "normalized": normalized, "tokens": tokens}

    def detect_acts(self, tokens: list[str]) -> list[str]:
        """Port of actMatcher.js detectActs().
        Returns detected act codes, or ["IPC", "CRPC"] as default.
        """
        detected: set[str] = set()
        for act, keywords in ACT_KEYWORDS.items():
            for word in tokens:
                if word in keywords:
                    detected.add(act)
        return list(detected) if detected else ["IPC", "CRPC"]

    def extract_section_numbers(self, query: str) -> list[str]:
        """Port of sectionMatcher.js extractSectionNumbers().
        Extracts section numbers like '437', '302a' from query text.
        """
        matches = re.findall(r"section\s+(\d+[a-z]?)", query, re.IGNORECASE)
        if not matches:
            return []
        return [
            re.sub(r"[^0-9a-z]", "", m).lower()
            for m in matches
        ]

    def rank_sections(
        self, sections: list[ActSection], tokens: list[str]
    ) -> list[dict]:
        """Port of ranker.js rankSections().
        Scoring: token in title = +3, token in text = +2.
        Filters out score=0, sorts descending.
        """
        scored = []
        for sec in sections:
            score = 0
            text_lower = sec.text.lower()
            title_lower = sec.title.lower()
            for token in tokens:
                if token in text_lower:
                    score += 2
                if token in title_lower:
                    score += 3
            if score > 0:
                scored.append({**sec.model_dump(), "score": score})
        scored.sort(key=lambda s: s["score"], reverse=True)
        return scored

    def retrieve_relevant_sections(
        self, query: str, limit: int = 5
    ) -> list[dict]:
        """Port of retrieveSections.js retrieveRelevantSections().
        Full retrieval pipeline: analyze -> detect acts -> filter -> extract sections -> rank -> top N.
        """
        analysis = self.analyze_query(query)
        tokens = analysis["tokens"]
        normalized = analysis["normalized"]

        detected_acts = self.detect_acts(tokens)
        section_numbers = self.extract_section_numbers(normalized)

        # Filter by detected acts
        candidates = [s for s in self._acts_data if s.act in detected_acts]

        # If specific sections requested, narrow down
        if section_numbers:
            filtered = [
                s for s in candidates
                if s.section is not None
                and any(
                    re.sub(r"[^0-9a-z]", "", str(s.section).lower()).startswith(sn)
                    for sn in section_numbers
                )
            ]
            # Fallback: if section filter yields nothing, use all act candidates
            if section_numbers and not filtered:
                candidates = [s for s in self._acts_data if s.act in detected_acts]
            else:
                candidates = filtered

        ranked = self.rank_sections(candidates, tokens)
        return ranked[:limit]
