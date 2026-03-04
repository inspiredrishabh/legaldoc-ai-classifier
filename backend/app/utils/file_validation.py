import magic

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "image/png",
    "image/jpeg",
}


def validate_file_type(file_bytes: bytes) -> tuple[bool, str]:
    """Validate file MIME type using python-magic.
    Returns (is_valid, detected_mime_type).
    """
    mime = magic.from_buffer(file_bytes[:2048], mime=True)
    return (mime in ALLOWED_MIME_TYPES, mime)
