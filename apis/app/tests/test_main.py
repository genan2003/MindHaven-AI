import sys
import os
from fastapi.testclient import TestClient

# Add the project directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

from app.main import app

# Initialize the test client
client = TestClient(app)

def test_predict_with_valid_views():
    response = client.post("/predict", json={"views": [10, 20, 30, 40, 50]})
    assert response.status_code == 200
    data = response.json()
    assert "recommended" in data
    assert "probability" in data
    assert isinstance(data["recommended"], bool)
    assert isinstance(data["probability"], float)

def test_predict_with_all_zero_views():
    response = client.post("/predict", json={"views": [0, 0, 0, 0, 0]})
    assert response.status_code == 200
    data = response.json()
    assert data["recommended"] is False
    assert data["probability"] == 0.0

def test_predict_with_negative_views():
    response = client.post("/predict", json={"views": [10, -5, 30, 40, 50]})
    assert response.status_code == 200
    data = response.json()
    assert "error" in data
    assert data["error"] == "View counts must be non-negative"

def test_predict_with_empty_views():
    response = client.post("/predict", json={"views": []})
    assert response.status_code == 422  # Unprocessable Entity (Validation Error)

def test_predict_with_large_views():
    response = client.post("/predict", json={"views": [1000, 2000, 3000, 4000, 5000]})
    assert response.status_code == 200
    data = response.json()
    assert "recommended" in data
    assert "probability" in data
    assert isinstance(data["recommended"], bool)
    assert isinstance(data["probability"], float)
