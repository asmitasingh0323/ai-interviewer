from datasets import load_dataset
from transformers import (
    AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer, pipeline
)

# Step 1: Load Dataset (Replace "greengerong/leetcode" with your dataset)
dataset = load_dataset("greengerong/leetcode", trust_remote_code=True)

# Step 2: Preprocess Data
def preprocess_function(example):
    return {
        "input_text": f"Title: {example['title']}\nContent: {example['content']}\nAnswer (Language): {example['python']}",
        "label": example["python"]  # Here, I'm using 'python' column as the answer
    }

# Apply preprocessing to the dataset
train_data = dataset["train"].map(preprocess_function)

# Step 3: Load Mistral-7B Model & Tokenizer
model_name = "mistralai/Mistral-7B-v0.1"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Step 4: Fine-Tune Model
training_args = TrainingArguments(
    output_dir="./mistral-mcq",
    per_device_train_batch_size=2,
    num_train_epochs=3,
    evaluation_strategy="epoch"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_data
)

trainer.train()

# Step 5: Save Model
model.save_pretrained("mistral-mcq")
tokenizer.save_pretrained("mistral-mcq")

# Step 6: Inference (Testing the Model)
qa = pipeline("text-generation", model="mistral-mcq")
response = qa("Title: What is the capital of France?\nContent: A question about world geography.\nAnswer (Language): python")
print(response)
