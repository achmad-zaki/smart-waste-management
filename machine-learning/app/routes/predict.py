from fastapi import APIRouter, File, UploadFile, status
from app.schemas import PredictResponse, PredictionData, ErrorResponse
from app.services.validator import validate_image_file
from app.services.classifier import classifier

router = APIRouter(tags=["Prediction"])


@router.post(
    "/predict",
    response_model=PredictResponse,
    status_code=status.HTTP_200_OK,
    summary="Classify waste image",
    description="Accepts an image file (multipart/form-data) and classifies it into organic, plastic, or paper.",
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request or empty file"},
        413: {"model": ErrorResponse, "description": "File size exceeds 5MB"},
        422: {"model": ErrorResponse, "description": "Invalid image format or corrupted file"},
    }
)
async def predict_waste(image: UploadFile = File(..., description="Waste image file (JPEG, PNG, WEBP)")):
    # 1. Validate image
    pil_image = await validate_image_file(image)

    # 2. Run prediction
    category, confidence = classifier.predict(pil_image)

    # 3. Return structured response
    return PredictResponse(
        success=True,
        prediction=PredictionData(
            category=category,
            confidence=confidence
        )
    )

