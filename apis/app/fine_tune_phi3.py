from transformers import AutoModelForCausalLM, AutoTokenizer
from transformers import Trainer, TrainingArguments
from datasets import load_dataset
import torch

# Check device availability
device = torch.device("cpu")  # Force usage of CPU
print(f"Using device: {device}")

# Model name (smaller model for demonstration)
model_name = "microsoft/phi-1_5"  # Consider using smaller models if resources are constrained

# Initialize tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Ensure that the tokenizer has a padding token
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token  # Use eos_token as pad_token

# Load model directly using from_pretrained (no need for load_checkpoint_and_dispatch)
print("Loading model directly from Hugging Face...")
model = AutoModelForCausalLM.from_pretrained(model_name)

# Load the dataset
print("Loading dataset...")
dataset = load_dataset("Amod/mental_health_counseling_conversations")

# Tokenize the dataset based on the correct column
def tokenize_function(examples):
    context_encodings = tokenizer(examples["Context"], padding="max_length", truncation=True, max_length=512)
    response_encodings = tokenizer(examples["Response"], padding="max_length", truncation=True, max_length=512)
    
    return {
        "input_ids": context_encodings["input_ids"],
        "attention_mask": context_encodings["attention_mask"],
        "labels": response_encodings["input_ids"]
    }

# Tokenize dataset
print("Tokenizing dataset...")
tokenized_dataset = dataset.map(tokenize_function, batched=True)

# Define training arguments
training_args = TrainingArguments(
    output_dir="/home/developer/Projects/Database-project/apis/app/results",
    overwrite_output_dir=True,
    evaluation_strategy="steps",
    save_strategy="steps",
    num_train_epochs=3,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=8,
    logging_dir="/home/developer/Projects/Database-project/apis/app/logs",
    logging_steps=100,
    save_steps=500,
    no_cuda=True,
    fp16=False
)

# Prepare the trainer
print("Initializing trainer...")
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset.get("validation", tokenized_dataset["train"]),
)

# Start training
print("Starting training...")
trainer.train()

# Save the fine-tuned model and tokenizer
print("Saving model...")
model.save_pretrained("/home/developer/Projects/Database-project/apis/app/phi3_finetuned_cpu")
tokenizer.save_pretrained("/home/developer/Projects/Database-project/apis/app/phi3_finetuned_cpu")

print("Training complete!")