import requests

API_KEY = "3Uw4lrJFZQze0bgPsDuz622BU4j8ZwAH"  # Replace with actual key
API_URL = "https://api.mistral.ai/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}
def generate_question(topic):
    """Generate a multiple-choice question with code snippet when appropriate."""
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

def extract_question_and_answer(full_question):
    """Separate the question text, code snippet, options, and correct answer."""
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
    
    # Combine question lines and code snippet
    formatted_question = "\n".join(question_text)
    if code_snippet:
        formatted_question += "\n\n```\n" + "\n".join(code_snippet) + "\n```"
    
    return formatted_question, options, correct_answer

def conduct_quiz(topic, num_questions):
    """Run a quiz with the specified number of questions."""
    score = 0
    
    for question_num in range(1, num_questions + 1):
        print(f"\nQuestion {question_num}/{num_questions}:")
        
        # Generate and display question
        full_question = generate_question(topic)
        question_text, options, correct_answer = extract_question_and_answer(full_question)
        
        print(f"\n{question_text}")
        for option in options:
            print(option)
        
        # Get and validate user answer
        while True:
            user_answer = input("\nYour choice (A/B/C/D): ").upper()
            if user_answer in ["A", "B", "C", "D"]:
                break
            print("Invalid choice. Please enter A, B, C, or D.")
        
        # Check answer and provide feedback
        if user_answer == correct_answer:
            print("\n✅ Correct!")
            score += 1
        else:
            print(f"\n❌ Incorrect. The correct answer is {correct_answer}.")
        
        # Get explanation
        explanation = get_explanation(question_text, correct_answer)
        print(f"\nExplanation:\n{explanation}")
    
    # Final results
    print(f"\nQuiz complete! Your score: {score}/{num_questions} ({score/num_questions*100:.1f}%)")

def get_explanation(question, correct_answer):
    """Get explanation for why the answer is correct."""
    data = {
        "model": "mistral-tiny",
        "messages": [
            {"role": "system", "content": "Explain why this is the correct answer in 1-2 sentences."},
            {"role": "user", "content": f"Question: {question}\nWhy is {correct_answer} the correct answer?"}
        ]
    }
    response = requests.post(API_URL, headers=headers, json=data)
    return response.json()["choices"][0]["message"]["content"]

def get_num_questions():
    """Prompt user for number of questions."""
    while True:
        try:
            num = int(input("How many multiple-choice questions would you like? (1-10): "))
            if 1 <= num <= 10:
                return num
            print("Please enter a number between 1 and 10.")
        except ValueError:
            print("Please enter a valid number.")

if __name__ == "__main__":
    print("Welcome to the AI Interview Quiz!\n")
    topic = input("Enter an interview topic (e.g., Java, Python, OOP): ")
    num_questions = get_num_questions()
    conduct_quiz(topic, num_questions)