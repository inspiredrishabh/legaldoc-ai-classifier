class PromptService:
    """Port of promptBuilder.js buildPrompt()."""

    # Strong system-level instruction for Hindi output
    HINDI_SYSTEM = (
        "You are a legal assistant specializing in Indian law. "
        "CRITICAL RULE: You MUST write your ENTIRE response in Hindi using Devanagari script (हिंदी). "
        "Do NOT use any English words or Latin script anywhere in your answer. "
        "For legal terms, use their commonly known Hindi equivalents or transliterate them into Devanagari. "
        "Never switch to English under any circumstances."
    )

    def build_prompt(self, context: str, question: str, language: str = "en") -> tuple[str, str | None]:
        """Return (user_prompt, system_message). system_message is None for English."""
        if language == "hi":
            user_prompt = (
                "नीचे दिए गए कानूनी संदर्भ का उपयोग करके प्रश्न का उत्तर हिंदी में दें।\n\n"
                f"संदर्भ:\n{context}\n\n"
                f"प्रश्न:\n{question}\n\n"
                "उत्तर (केवल हिंदी में):"
            )
            return user_prompt, self.HINDI_SYSTEM
        user_prompt = (
            "You are a legal assistant.\n"
            "If the document is in Hindi, respond in Hindi.\n"
            "If in English, respond in English.\n"
            "Answer using the context below.\n\n"
            f"Context:\n{context}\n\n"
            f"Question:\n{question}\n\n"
            "Answer:"
        )
        return user_prompt, None
