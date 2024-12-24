# app/main.py
from fastapi import FastAPI, HTTPException
from app.schemas import PredictionRequest, PredictionResponse
from app.ml.model import UpdateRecommendationModel
from app.utils import interpret_prediction

app = FastAPI()

# Load the model
model = UpdateRecommendationModel()

@app.get("/")
def root():
    return {"message": "Welcome to the AI Update Recommendation API"}

@app.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionRequest):
    try:
        # Make prediction
        prediction = model.predict(data.views)
        recommended = interpret_prediction(prediction)
        
        # Simulate probability (for demo purposes)
        probability = 0.85 if recommended else 0.15
        
        return PredictionResponse(recommended=recommended, probability=probability)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
