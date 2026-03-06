from abc import ABC, abstractmethod
import logging
import httpx
from app.config import Settings

logger = logging.getLogger(__name__)

MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"


class LLMProvider(ABC):
    """Abstract contract for LLM providers."""

    @abstractmethod
    async def generate_answer(self, prompt: str, system_message: str | None = None) -> str | None:
        ...


class CloudMistralProvider(LLMProvider):
    """Calls the Mistral cloud API (api.mistral.ai) using an API key."""

    def __init__(self, settings: Settings):
        self._api_key = settings.MISTRAL_KEY
        self._model = "mistral-small-latest"

    async def generate_answer(self, prompt: str, system_message: str | None = None) -> str | None:
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
        }
        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})
        payload = {
            "model": self._model,
            "messages": messages,
            "temperature": 0.3,
            "max_tokens": 1024,
        }
        async with httpx.AsyncClient(timeout=120.0) as client:
            logger.info("Calling Mistral cloud API model=%s", self._model)
            response = await client.post(
                MISTRAL_API_URL, headers=headers, json=payload
            )
            response.raise_for_status()
            data = response.json()
            choices = data.get("choices", [])
            if not choices:
                return None
            result = choices[0].get("message", {}).get("content", "")
            logger.info("LLM response length: %d chars", len(result) if result else 0)
            return result.strip() if result else None


class LocalMistralProvider(LLMProvider):
    """Uses httpx async client to call Ollama REST API (local)."""

    def __init__(self, settings: Settings):
        self._host = settings.OLLAMA_HOST
        self._model = settings.OLLAMA_MODEL

    async def generate_answer(self, prompt: str, system_message: str | None = None) -> str | None:
        async with httpx.AsyncClient(timeout=180.0) as client:
            logger.info("Calling Ollama model=%s at %s", self._model, self._host)
            body: dict = {"model": self._model, "prompt": prompt, "stream": False}
            if system_message:
                body["system"] = system_message
            response = await client.post(
                f"{self._host}/api/generate",
                json=body,
            )
            response.raise_for_status()
            data = response.json()
            result = data.get("response", "")
            logger.info("LLM response length: %d chars", len(result) if result else 0)
            return result.strip() if result else None


async def check_llm_connection(settings: Settings, timeout_s: float = 5.0) -> bool:
    """Check if the configured LLM backend is reachable."""
    try:
        if settings.LLM_MODE == "cloud":
            # For cloud mode, just verify the API key is set
            return bool(settings.MISTRAL_KEY)
        async with httpx.AsyncClient(timeout=timeout_s) as client:
            response = await client.get(f"{settings.OLLAMA_HOST}/api/tags")
            return response.status_code == 200
    except Exception:
        return False


def get_llm_provider(settings: Settings) -> LLMProvider:
    """Factory function. Returns cloud or local provider based on LLM_MODE."""
    if settings.LLM_MODE == "cloud" and settings.MISTRAL_KEY:
        return CloudMistralProvider(settings)
    return LocalMistralProvider(settings)
