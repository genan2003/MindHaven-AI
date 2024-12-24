# app/schemas.py
from pydantic import BaseModel
from typing import List

class PredictionRequest(BaseModel):
    views: List[float]  # List of numerical features representing views and metrics

class PredictionResponse(BaseModel):
    recommended: bool  # True if update is recommended
    probability: float  # Confidence score
