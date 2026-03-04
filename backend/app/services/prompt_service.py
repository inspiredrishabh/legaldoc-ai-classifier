class PromptService:
    """Port of promptBuilder.js buildPrompt()."""

    def build_prompt(self, context: str, question: str) -> str:
        return (
            "You are a legal assistant.\n"
            "If the document is in Hindi, respond in Hindi.\n"
            "If in English, respond in English.\n"
            "Answer using the context below.\n\n"
            f"Context:\n{context}\n\n"
            f"Question:\n{question}\n\n"
            "Answer:"
        )
