import io
import pytest
from PIL import Image
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def create_dummy_image(color=(255, 0, 0), format="JPEG", size=(100, 100)) -> io.BytesIO:
    """Helper to create dummy in-memory image for testing."""
    image = Image.new("RGB", size, color=color)
    byte_arr = io.BytesIO()
    image.save(byte_arr, format=format)
    byte_arr.seek(0)
    return byte_arr


def test_health_check():
    """Verify /health endpoint returns correct structure and 200 status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True


def test_predict_valid_jpeg():
    """Verify /predict correctly processes a valid JPEG image."""
    img_bytes = create_dummy_image(color=(30, 200, 30), format="JPEG")
    files = {"image": ("test_waste.jpg", img_bytes, "image/jpeg")}
    response = client.post("/predict", files=files)

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "prediction" in data
    assert data["prediction"]["category"] in ["organic", "plastic", "paper"]
    assert 0.0 <= data["prediction"]["confidence"] <= 1.0


def test_predict_valid_png():
    """Verify /predict correctly processes a valid PNG image."""
    img_bytes = create_dummy_image(color=(50, 100, 240), format="PNG")
    files = {"image": ("test_plastic.png", img_bytes, "image/png")}
    response = client.post("/predict", files=files)

    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["prediction"]["category"] in ["organic", "plastic", "paper"]


def test_predict_invalid_file_type():
    """Verify /predict rejects non-image text files."""
    files = {"image": ("document.txt", io.BytesIO(b"Hello waste world"), "text/plain")}
    response = client.post("/predict", files=files)
    assert response.status_code in [400, 422]
    data = response.json()
    assert data["success"] is False


def test_predict_corrupted_image():
    """Verify /predict rejects corrupted image bytes."""
    files = {"image": ("corrupted.jpg", io.BytesIO(b"not an image at all"), "image/jpeg")}
    response = client.post("/predict", files=files)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False

