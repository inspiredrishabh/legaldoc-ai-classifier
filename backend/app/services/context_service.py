import re


class ContextService:
    """Port of contextBuilder.js buildContext()."""

    def build_context(self, sections: list[dict], max_chars: int = 3000) -> str:
        """Build context string from ranked sections.
        Respects max_chars limit with first-block truncation logic.
        """
        context = ""
        used_chars = 0

        for sec in sections:
            header = (
                f"Act: {sec['act']}\n"
                f"Section: {sec.get('section', 'N/A')}\n"
                f"Title: {sec.get('title', '')}\n"
            )
            clean_text = re.sub(r"\s+", " ", sec.get("text", "")).strip()
            block = f"{header}{clean_text}\n\n"

            # Case 1: first block too large -> truncate
            if used_chars == 0 and len(block) > max_chars:
                context += block[:max_chars]
                break

            # Case 2: normal accumulation
            if used_chars + len(block) > max_chars:
                break

            context += block
            used_chars += len(block)

        return context.strip()
