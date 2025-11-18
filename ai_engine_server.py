from flask import Flask, request, jsonify
import requests

API_KEY = "3Uw4lrJFZQze0bgPsDuz622BU4j8ZwAH"  # Replace with actual key
API_URL = "https://api.mistral.ai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

app = Flask(__name__)

# Generate question
def generate_question(topic):
    system_prompt = (
        "You are an AI interviewer that generates technical multiple-choice questions. "
        f"Generate a question about {topic} with 4 options (A-D) and specify the correct answer. "
        "If the question involves code, include the code snippet formatted with triple backticks. "
        "Format exactly like this:\n\n"
        "Question: [question text]\n"
        "```[language]\n[code snippet]\n```\n"
        "A) Option 1\n"
        "B) Option 2\n"
        "C) Option 3\n"
        "D) Option 4\n"
        "Correct Answer: [letter]"
    )
    
    data = {
        "model": "mistral-tiny",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Ask a multiple-choice coding question about {topic} with a code snippet."}
        ]
    }
    response = requests.post(API_URL, headers=headers, json=data)
    return response.json()["choices"][0]["message"]["content"]

# Extract question and options
def extract_question_and_answer(full_question):
    lines = full_question.split('\n')
    question_text = []
    code_snippet = []
    in_code_block = False
    options = []
    correct_answer = None
    
    for line in lines:
        if line.startswith("```"):
            in_code_block = not in_code_block
            if in_code_block:
                code_snippet.append("")  # Skip the language tag
            continue
        
        if in_code_block:
            code_snippet.append(line)
        elif line.startswith(("A)", "B)", "C)", "D)")):
            options.append(line)
        elif line.startswith("Correct Answer:"):
            correct_answer = line.split(':')[1].strip().upper()
        elif line.startswith("Question:"):
            question_text.append(line.replace("Question: ", ""))
        elif line.strip() and not any(line.startswith(x) for x in ["A)", "B)", "C)", "D)", "Correct Answer:"]):
            question_text.append(line)
    
    formatted_question = "\n".join(question_text)
    if code_snippet:
        formatted_question += "\n\n```\n" + "\n".join(code_snippet) + "\n```"
    
    return formatted_question, options, correct_answer

# # API endpoint to get a quiz
# @app.route('/quiz', methods=['POST'])
# def get_quiz():
#     topic = request.json.get("topic")
#     num_questions = request.json.get("num_questions", 1)

#     if not topic:
#         return jsonify({"error": "Topic is required"}), 400
    
#     quiz = []
#     for question_num in range(1, num_questions + 1):
#         full_question = generate_question(topic)
#         question_text, options, correct_answer = extract_question_and_answer(full_question)
        
#         quiz.append({
#             "question": question_text,
#             "options": options,
#             "correct_answer": correct_answer
#         })
    
#     return jsonify({"quiz": quiz})

# # Run the app
# if __name__ == "__main__":
#     app.run(debug=True)
@app.route("/quiz", methods=["POST"])
def quiz():
    data = request.json
    topic = data.get("topic")
    num_questions = data.get("num_questions", 1)
    # Call your quiz logic here
    return jsonify({"message": f"Quiz for topic '{topic}' with {num_questions} questions"})

if __name__ == "__main__":
    app.run(debug=True)