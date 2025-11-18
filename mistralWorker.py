import pika
import os
import json
import requests
import psycopg2
from dotenv import load_dotenv

API_KEY = "3Uw4lrJFZQze0bgPsDuz622BU4j8ZwAH"
API_URL = "https://api.mistral.ai/v1/chat/completions"

# Load database credentials
load_dotenv("db_config.env")


def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )


def fetch_question_answer(session_id):
    conn = get_db_connection()
    cur = conn.cursor()

    query = """
        SELECT q.question_text, s.answer
        FROM interview_sessions s
        JOIN questions q ON s.question_id = q.question_id
        WHERE s.session_id = %s
        LIMIT 1;
    """
    cur.execute(query, (session_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()

    if result:
        return result[0], result[1]  # question, answer
    return None, None


def update_evaluation_in_db(session_id, evaluation, score):
    conn = get_db_connection()
    cur = conn.cursor()
    print(
        f"Updating DB with -> Eval: {evaluation}, Score: {score}, Type of score: {type(score)}")

    if score < 0 or score > 100:
        print(f"⚠️ Score {score} is out of valid range. Setting to 0.")
        score = 0

    query = """
        UPDATE interview_sessions
        SET evaluation = %s, score = %s
        WHERE session_id = %s
    """
    cur.execute(query, (evaluation, score, session_id))
    conn.commit()
    cur.close()
    conn.close()


# def evaluate_answer(question, answer):
#     prompt = (
#         "You are an AI interviewer evaluating a candidate's answer to a technical question. "
#         "Provide a short evaluation in no more than 100 words and give a score out of 100 and Check syntax of the answer and if incorrect then reduce score\n\n"
#         "Give 50 marks for correct logic and give 20 marks for better time complexity and give 20 marks for better space complexity and 10 marks for correct syntax"
#         f"Question: {question}\nAnswer: {answer}\n\n"
#         "Provide output in json format where key Evaluation should hold the evaluation reason and key Score should hold the value"

#     )

# def evaluate_answer(question, answer):
#     prompt = (
#         "You are an AI interviewer evaluating a candidate's solution to a coding problem.\n\n"
#         "Evaluate the answer based on the following criteria and scoring breakdown:\n"
#         "- Logic correctness: 50 points\n"
#         "- Time complexity: 20 points\n"
#         "- Space complexity: 20 points\n"
#         "- Syntax correctness: 10 points\n\n"

#         "For each of these categories, provide:\n"
#         "- A short explanation\n"
#         "- The actual time and space complexity (e.g., O(n), O(n^2)) if applicable\n"
#         "- Justification for the score\n\n"

#         "Then return a JSON with the following structure:\n"
#         ```json
#         {
#           \"Evaluation\": {
#             \"Logic\": \"...explanation...\",
#             \"TimeComplexity\": {
#               \"Complexity\": \"O(n^2)\",
#               \"Explanation\": \"Used bubble sort which is inefficient for this task.\"
#             },
#             \"SpaceComplexity\": {
#               \"Complexity\": \"O(n)\",
#               \"Explanation\": \"Used additional list to store all node values.\"
#             },
#             \"Syntax\": \"...comment on code syntax...\"
#           },
#           \"ScoreBreakdown\": {
#             \"Logic\": 45,
#             \"TimeComplexity\": 10,
#             \"SpaceComplexity\": 15,
#             \"Syntax\": 8
#           },
#           \"TotalScore\": 78
#         }
#         ```

#         f"Question: {question}\n"
#         f"Answer: {answer}\n\n"
#         "Output JSON only. No prose or explanation outside JSON."
#     )
#     # return prompt

#     payload = {
#         "model": "mistral-tiny",
#         "messages": [
#             {"role": "system", "content": prompt}
#         ]
#     }

#     headers = {
#         "Authorization": f"Bearer {API_KEY}",
#         "Content-Type": "application/json"
#     }

#     response = requests.post(API_URL, headers=headers, json=payload)
#     if response.status_code == 200:
#         return response.json()["choices"][0]["message"]["content"]
#     else:
#         return f"❌ Error: {response.status_code} - {response.text}"

def evaluate_answer(question, answer):
    prompt = (
        "You are an AI interviewer evaluating a candidate's solution to a coding problem.\n\n"
        "Evaluate the answer based on the following criteria and scoring breakdown:\n"
        "- Logic correctness: 50 points\n"
        "- Time complexity: 20 points\n"
        "- Space complexity: 20 points\n"
        "- Syntax correctness: 10 points\n\n"

        "For each category, provide:\n"
        "- A short explanation\n"
        "- The actual time and space complexity (O(n), O(n^2), etc.) if applicable\n"
        "- Justification for the score\n\n"

        "Return a JSON object with this structure:\n"
        "{\n"
        "  \"Evaluation\": {\n"
        "    \"Logic\": \"...\",\n"
        "    \"TimeComplexity\": {\n"
        "      \"Complexity\": \"...\",\n"
        "      \"Explanation\": \"...\"\n"
        "    },\n"
        "    \"SpaceComplexity\": {\n"
        "      \"Complexity\": \"...\",\n"
        "      \"Explanation\": \"...\"\n"
        "    },\n"
        "    \"Syntax\": \"...\"\n"
        "  },\n"
        "  \"ScoreBreakdown\": {\n"
        "    \"Logic\": 0,\n"
        "    \"TimeComplexity\": 0,\n"
        "    \"SpaceComplexity\": 0,\n"
        "    \"Syntax\": 0\n"
        "  },\n"
        "  \"TotalScore\": 0\n"
        "}\n\n"
        f"Question: {question}\n"
        f"Answer: {answer}\n\n"
        "Output JSON only. No explanation outside JSON."
    )

    payload = {
        "model": "open-mistral-7b",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(API_URL, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    return f"❌ Error: {response.status_code} - {response.text}"


# def extract_result(result):
    # Since result is already a string, no need to decode it
    result_json = json.loads(result)

    evaluation = result_json.get("Evaluation", "").strip()
    score_raw = result_json.get("Score", 0)

    try:
        # Safely convert score to float
        score = float(score_raw)
        # Optionally round or convert to int if needed by your DB
        score = round(score, 2)  # or just int(score)
    except (ValueError, TypeError):
        score = 0.0  # fallback in case of malformed value

    return evaluation, score


def extract_result(result):
    try:
        result_json = json.loads(result)
    except Exception as e:
        print("❌ JSON PARSE ERROR:", e)
        print("RAW RESULT:", result)
        return "Malformed JSON", 0

    # The LLM returns nested structured evaluation
    evaluation_section = result_json.get("Evaluation", {})

    # Convert the dict to a readable text block
    evaluation_text = json.dumps(evaluation_section, indent=2)

    # Score breakdown
    score = result_json.get("TotalScore", 0)

    try:
        score = float(score)
    except:
        score = 0

    return evaluation_text, score


def on_message(ch, method, properties, body):
    print(body)
    task = json.loads(body.decode())
    session = task.get("session_id", "")

    print("\n🔍 Received task")
    print(f"Question: {session}")
    question, answer = fetch_question_answer(session)
    print(f"✅ Found question and answer:\nQ: {question}\nA: {answer}")

    if not question or not answer:
        print("❌ No record found for that session_id.")
        return

    result = evaluate_answer(question, answer)
    print(f"\n✅ Evaluation:\n{result}")
    evaluation, score = extract_result(result)
    update_evaluation_in_db(session, evaluation, score)
    print(
        f"✅ Updated evaluation and score in the database for session_id {session}.")

    ch.basic_ack(delivery_tag=method.delivery_tag)


# Connect to RabbitMQ and start consuming
connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
channel = connection.channel()
channel.queue_declare(queue="task_queue", durable=True)
# channel.queue_purge(queue='task_queue')

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue="task_queue", on_message_callback=on_message)

print("🎯 Mistral worker is running and waiting for tasks...")
channel.start_consuming()
