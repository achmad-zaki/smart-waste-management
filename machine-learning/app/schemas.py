from pydantic import BaseModel, Field
from typing import Optional


class HealthResponse(BaseModel):
    success: bool = True
    status: str = "healthy"
    model_loaded: bool = True
    version: str = "1.0.0"


class PredictionData(BaseModel):
    category: str = Field(..., description="Predicted category: organic, plastic, or paper")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")


class PredictResponse(BaseModel):
    success: bool = True
    prediction: PredictionData


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: Optional[str] = None

