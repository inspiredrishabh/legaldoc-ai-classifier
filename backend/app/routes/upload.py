import uuid
from fastapi import APIRouter, UploadFile, BackgroundTasks, Depends, HTTPException
from app.models.schemas import BatchUploadResponse, FileUploadResult, FileMetadata
from app.models.enums import ProcessingStatus
from app.dependencies import get_vision_service, get_settings
from app.utils.file_validation import validate_file_type
from app.config import Settings

router = APIRouter(prefix="/v1/files")

# In-memory store for batch results (replace with Redis in production)
_batch_results: dict[str, list[FileUploadResult]] = {}


@router.post("/upload-batch", response_model=BatchUploadResponse)
async def upload_batch(
    files: list[UploadFile],
    background_tasks: BackgroundTasks,
    settings: Settings = Depends(get_settings),
):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    batch_id = str(uuid.uuid4())
    results: list[FileUploadResult] = []

    for file in files:
        file_id = str(uuid.uuid4())

        # Read file bytes
        content = await file.read()

        # Edge case: empty file
        if not content or len(content) == 0:
            results.append(FileUploadResult(
                file_id=file_id,
                status=ProcessingStatus.FAILED,
                error="Empty file",
            ))
            continue

        # Size check
        if len(content) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
            results.append(FileUploadResult(
                file_id=file_id,
                status=ProcessingStatus.FAILED,
                error=f"File exceeds {settings.MAX_FILE_SIZE_MB}MB limit",
            ))
            continue

        # MIME validation
        is_valid, mime_type = validate_file_type(content)
        if not is_valid:
            results.append(FileUploadResult(
                file_id=file_id,
                status=ProcessingStatus.FAILED,
                error=f"Unsupported file type: {mime_type}",
            ))
            continue

        # Queue for background processing
        results.append(FileUploadResult(
            file_id=file_id,
            status=ProcessingStatus.PENDING,
        ))
        background_tasks.add_task(
            _process_file, batch_id, file_id, content, mime_type
        )

    _batch_results[batch_id] = results
    return BatchUploadResponse(batch_id=batch_id, results=results)


@router.get("/batch/{batch_id}", response_model=BatchUploadResponse)
async def get_batch_status(batch_id: str):
    if batch_id not in _batch_results:
        raise HTTPException(status_code=404, detail="Batch not found")
    return BatchUploadResponse(
        batch_id=batch_id, results=_batch_results[batch_id]
    )


async def _process_file(
    batch_id: str, file_id: str, content: bytes, mime_type: str
):
    """Background processing for a single file.
    Runs offline PaddleOCR, updates result status.
    """
    vision = get_vision_service()

    # Find the result entry
    results = _batch_results.get(batch_id, [])
    entry = next((r for r in results if r.file_id == file_id), None)
    if not entry:
        return

    entry.status = ProcessingStatus.PROCESSING

    try:
        if mime_type == "application/pdf":
            # PDF: basic header validation
            if content[:5] != b"%PDF-":
                entry.status = ProcessingStatus.FAILED
                entry.error = "Invalid or corrupted PDF"
                return
            result = await vision.extract_text_from_pdf(content)
        else:
            # Image: OCR directly (preprocessing is handled by the OCR engine)
            result = await vision.extract_text(content)

        if not result["raw_text"] or len(result["raw_text"].strip()) < 10:
            entry.status = ProcessingStatus.FAILED
            entry.error = "No text could be extracted (image may be blurred or empty)"
            return

        entry.status = ProcessingStatus.COMPLETED
        entry.raw_text = result["raw_text"]
        entry.metadata = FileMetadata(
            page_count=result["page_count"],
            confidence_score=result["confidence_score"],
        )
    except Exception as e:
        entry.status = ProcessingStatus.FAILED
        entry.error = str(e)
