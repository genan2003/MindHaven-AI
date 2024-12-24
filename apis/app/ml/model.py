# app/ml/model.py
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.datasets import make_classification

# Mock model for demonstration
class UpdateRecommendationModel:
    def __init__(self):
        # Create a simple dataset
        X, y = make_classification(
    n_samples=1000, 
    n_features=5,  # Match the expected input feature size
    n_informative=3,
    n_redundant=1,
    random_state=42
)
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train a Logistic Regression model
        self.model = LogisticRegression()
        self.model.fit(X_train, y_train)

    def predict(self, features):
        return self.model.predict(np.array(features).reshape(1, -1))[0]
