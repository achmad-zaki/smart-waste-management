import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.routes.health import router as health_router
from app.routes.predict import router as predict_router

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description=(
        "Internal Machine Learning Service for Smart Waste Management. "
        "Provides image classification for organic, plastic, and paper waste categories."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware (allowing calls from backend & local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler for consistent error response format
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail,
        },
    )


# Include route modules
app.include_router(health_router)
app.include_router(predict_router)


@app.get("/", include_in_schema=False)
async def root():
    return {
        "service": settings.app_name,
        "version": settings.version,
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )

