from fastapi import FastAPI, HTTPException
from llama_cpp import Llama
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sklearn.linear_model import LogisticRegression
from transformers import pipeline
import torch
import logging
from transformers import AutoModelForCausalLM, AutoModelForSeq2SeqLM, AutoTokenizer, pipeline,BlenderbotTokenizer, BlenderbotForConditionalGeneration
import transformers
from accelerate import disk_offload
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Update with your Angular frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the FastAPI app


# Define the input data models
class ViewsInput(BaseModel):
    views: List[int]


    
    # Initialize ML model
model = LogisticRegression()
X_train = np.random.randint(0, 100, (100, 5))
y_train = np.random.randint(0, 2, 100)
model.fit(X_train, y_train)
    

@app.post("/predict")
async def predict(input_data: ViewsInput):
    try:
        if any(view < 0 for view in input_data.views):
            raise HTTPException(status_code=400, detail="View counts must be non-negative")
            
        if all(view == 0 for view in input_data.views):
            return {"recommended": False, "probability": 0.0}
            
        prediction = model.predict([input_data.views])[0]
        probability = float(model.predict_proba([input_data.views])[0][1])
        
        return {
            "recommended": bool(prediction),
            "probability": probability
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    
try:
    MODEL_NAME = "facebook/blenderbot-400M-distill"
    
    tokenizer = BlenderbotTokenizer.from_pretrained(MODEL_NAME)
    model = BlenderbotForConditionalGeneration.from_pretrained(MODEL_NAME)
except Exception as e:
    raise RuntimeError(f"Failed to load the BlenderBot model: {str(e)}")

# Define input and output models for the chatbot
class ChatInput(BaseModel):
    user_message: str

class ChatOutput(BaseModel):
    bot_response: str

@app.post("/chat", response_model=ChatOutput)
async def chat_endpoint(input: ChatInput):
    try:
        # Tokenize the user input
        inputs = tokenizer(input.user_message, return_tensors="pt")
        
        # Generate a response
        outputs = model.generate(
            inputs["input_ids"],
            max_length=500,              # Increased max_length for longer responses
            temperature=0.7,             # Balances randomness and coherence
            top_p=0.9,                   # Nucleus sampling for natural responses
            repetition_penalty=1.2,      # Penalizes repetitive patterns
            no_repeat_ngram_size=3,      # Avoids repeating n-grams
            num_return_sequences=1       # Single response
        )
        
        # Decode the response
        bot_response = tokenizer.decode(outputs[0], skip_special_tokens=True)

        return ChatOutput(bot_response=bot_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
