from abc import ABC, abstractmethod
import httpx
from app.config import Settings


class LLMProvider(ABC):
    """Port of LLMProvider.js -- abstract contract."""

    @abstractmethod
    async def generate_answer(self, prompt: str) -> str | None:
        ...


class LocalMistralProvider(LLMProvider):
    """Port of LocalMistralProvider.js.
    Uses httpx async client to call Ollama REST API.
    """

    def __init__(self, settings: Settings):
        self._host = settings.OLLAMA_HOST
        self._model = settings.OLLAMA_MODEL

    async def generate_answer(self, prompt: str) -> str | None:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self._host}/api/generate",
                json={"model": self._model, "prompt": prompt, "stream": False},
            )
            response.raise_for_status()
            data = response.json()
            result = data.get("response", "")
            return result.strip() if result else None


async def check_llm_connection(settings: Settings, timeout_s: float = 5.0) -> bool:
    """Port of healthCheck.js checkLLMConnection().
    Uses HTTP GET to Ollama /api/tags instead of spawning subprocess.
    More portable on Windows.
    """
    try:
        async with httpx.AsyncClient(timeout=timeout_s) as client:
            response = await client.get(f"{settings.OLLAMA_HOST}/api/tags")
            return response.status_code == 200
    except Exception:
        return False


def get_llm_provider(settings: Settings) -> LLMProvider:
    """Port of llm/index.js getLLMProvider().
    Factory function. Extensible via settings.LLM_MODE.
    """
    if settings.LLM_MODE == "local":
        return LocalMistralProvider(settings)
    return LocalMistralProvider(settings)
