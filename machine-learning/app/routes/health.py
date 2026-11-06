from fastapi import APIRouter
from app.schemas import HealthResponse
from app.services.classifier import classifier
from app.config import settings

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check endpoint",
    description="Checks the health status of the ML prediction API and model availability."
)
async def health_check():
    return HealthResponse(
        success=True,
        status="healthy",
        model_loaded=True,
        version=settings.version
    )

