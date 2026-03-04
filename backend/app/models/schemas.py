from pydantic import BaseModel, Field
from .enums import ProcessingStatus, AnswerMethod


# --- Internal data models ---

class ActSection(BaseModel):
    act: str
    section: str | None
    title: str
    text: str


class QAPair(BaseModel):
    source: str
    question: str
    answer: str


# --- Request models ---

class AskRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=5000)


# --- Response models ---

class FileMetadata(BaseModel):
    page_count: int = 0
    confidence_score: float = 0.0


class FileUploadResult(BaseModel):
    file_id: str
    status: ProcessingStatus
    raw_text: str = ""
    metadata: FileMetadata = Field(default_factory=FileMetadata)
    error: str | None = None


class BatchUploadResponse(BaseModel):
    batch_id: str
    results: list[FileUploadResult]


class AskResponse(BaseModel):
    answer: str
    source: str
    method: AnswerMethod
    confidence: float | None = None


class HealthResponse(BaseModel):
    status: str
    service: str
    llm_mode: str
