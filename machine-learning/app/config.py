from pydantic import BaseModel
from typing import List, Set


class Settings(BaseModel):
    app_name: str = "Smart Waste Management - ML Service"
    version: str = "1.0.0"
    host: str = "127.0.0.1"
    port: int = 8001
    
    # 5 MB max file size, matching Laravel validation rules (5120 KB)
    max_file_size_bytes: int = 5 * 1024 * 1024
    
    # Allowed MIME types
    allowed_content_types: Set[str] = {
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    }
    
    # Valid waste categories expected by backend Laravel
    valid_categories: List[str] = ["organic", "plastic", "paper"]


settings = Settings()

