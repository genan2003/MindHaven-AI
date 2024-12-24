# app/utils.py
def interpret_prediction(prediction: int) -> bool:
    return prediction == 1  # 1 means recommended, 0 means not recommended
