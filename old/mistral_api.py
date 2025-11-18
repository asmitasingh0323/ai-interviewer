import requests

API_KEY = "3Uw4lrJFZQze0bgPsDuz622BU4j8ZwAH"  # Replace with actual key
API_URL = "https://api.mistral.ai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "mistral-tiny",
    "messages": [{"role": "user", "content": "Hello, how are you?"}]
}

response = requests.post(API_URL, headers=headers, json=data)

print(response.status_code, response.json())  # Print response to debug
