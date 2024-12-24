from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
from sklearn.linear_model import LogisticRegression

# Define the FastAPI app
app = FastAPI()

# Define the input data model
class ViewsInput(BaseModel):
    views: List[int]

# Dummy model for demonstration purposes
model = LogisticRegression()
X_train = np.random.randint(0, 100, (100, 5))  # Random training data
y_train = np.random.randint(0, 2, 100)        # Random labels
model.fit(X_train, y_train)                   # Train the model

@app.post("/predict")
def predict(input_data: ViewsInput):
    # Ensure views are valid
    if any(view < 0 for view in input_data.views):
        return {"error": "View counts must be non-negative"}

    # Pre-check: If all views are zero, recommend NOT to update
    if all(view == 0 for view in input_data.views):
        return {"recommended": False, "probability": 0.0}

    # Pass views to the model for prediction
    views = input_data.views
    prediction = model.predict([views])[0]
    probability = model.predict_proba([views])[0][1]
    return {"recommended": bool(prediction), "probability": probability}
