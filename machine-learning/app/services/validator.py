import io
from fastapi import UploadFile, HTTPException, status
from PIL import Image, UnidentifiedImageError
from app.config import settings


async def validate_image_file(file: UploadFile) -> Image.Image:
    """
    Validate uploaded image:
    1. Check MIME content type.
    2. Check file size (<= 5MB).
    3. Verify that file is a valid readable image via Pillow.
    
    Returns the PIL Image instance.
    """
    if not file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No file was uploaded."
        )

    # 1. Check Content-Type header if provided
    content_type = file.content_type
    if content_type and content_type.lower() not in settings.allowed_content_types:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported media type '{content_type}'. Allowed types: {', '.join(sorted(settings.allowed_content_types))}."
        )

    # 2. Read bytes and check size
    contents = await file.read()
    if not contents or len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty."
        )

    if len(contents) > settings.max_file_size_bytes:
        max_mb = settings.max_file_size_bytes // (1024 * 1024)
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds the maximum limit of {max_mb}MB."
        )

    # 3. Verify image integrity with Pillow
    try:
        image = Image.open(io.BytesIO(contents))
        image.verify()  # Verifies image structure
        
        # Re-open because verify() closes/invalidates the stream
        image = Image.open(io.BytesIO(contents))
        image.load()
        return image
    except (UnidentifiedImageError, OSError, ValueError) as err:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid or corrupted image file: {str(err)}"
        )

