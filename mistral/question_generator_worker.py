# import pika
# import json
# import psycopg2
# from mistralai import Mistral
# from dotenv import load_dotenv
# import os
# import re

# # ---------------------------------------------------------
# # RABBITMQ CONFIG
# # ---------------------------------------------------------
# RABBITMQ_HOST = "localhost"
# REQUEST_QUEUE = "question_generation_requests"

# # ---------------------------------------------------------
# # DATABASE CONFIG
# # ---------------------------------------------------------
# load_dotenv("db_config.env")


# def get_db_connection():
#     return psycopg2.connect(
#         dbname=os.getenv("DB_NAME"),
#         user=os.getenv("DB_USER"),
#         password=os.getenv("DB_PASSWORD"),
#         host=os.getenv("DB_HOST"),
#         port=os.getenv("DB_PORT")
#     )


# # ---------------------------------------------------------
# # MISTRAL CLIENT
# # ---------------------------------------------------------
# mistral_client = Mistral(api_key=os.getenv(
#     "MISTRAL_API_KEY", "3Uw4lrJFZQze0bgPsDuz622BU4j8ZwAH"))


# def generate_question(jd_text):
#     prompt = f"""
# You are an expert software engineering interviewer.
# Your task is to generate EXACTLY ONE coding question.
# Generate the Coding questions mostly around Problem Solving
# using Data Structure and Algorithms.
# Make sure the Problem is related to Job description as much as possible
# ---------------------------------------------------------
# JOB DESCRIPTION (for context only):
# {jd_text}
# ---------------------------------------------------------
# STRICT OUTPUT REQUIREMENTS (MANDATORY):
# Return ONE and ONLY ONE valid JSON object.
# ALL fields below are REQUIRED and MUST be NON-EMPTY.
# ---------------------------------------------------------
# PROBLEM REQUIREMENTS (MANDATORY):
# The problem MUST:
# - Format the input as needed.
# - Clearly specify how the OUTPUT format of the result should be.
# ---------------------------------------------------------
# REQUIRED JSON SCHEMA (STRICT):
# {{
#   "coding_question": {{
#     "problem": "Plain-text problem statement describing the task, input format, output format, and edge cases. NO markdown. NO HTML.",
#     "difficulty": "medium",
#     "constraints": [
#       "numeric constraint on input size",
#       "numeric constraint on input values",
#       "numeric constraint on output size or behavior"
#     ],
#     "examples": [
#       {{
#             Provide Example 1 here
#       }},
#       {{
#             Provide Example 2 here
#       }},
#       {{
#             Provide Edge Case here
#       }}
#     ]
#   }}
# }}
# ---------------------------------------------------------
# STYLE REQUIREMENTS (MANDATORY):
# - The problem must be around Problem Solving/Basic Data Structure and Algorithms.
# - The task must be solvable using basic iteration or counting.
# - Examples MUST explicitly name all parameters.
# - Examples MUST align with the constraints.
# - Arrays MUST be fully expanded (no placeholders like items[i]).
# - Constraints MUST use realistic numeric bounds.
# ---------------------------------------------------------
# FORMAT RULES (NO EXCEPTIONS):
# - Output MUST be valid, beautified JSON
# - JSON ONLY — no markdown, no backticks, no comments
# - EXACTLY 3 constraints related to input type or size or measurements
# - EXACTLY 2 examples explaining happy case along with 1 edge case
# - NO text before or after JSON
# - Give me the whole question in the plain english along with examples and constraints
# ---------------------------------------------------------
# Sample Question:
# Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
# You may assume that each input would have exactly one solution, and you may not use the same element twice.
# You can return the answer in any order.
# Constraints:
# 2 <= nums.length <= 10^4
# -10^9 <= nums[i] <= 10^9
# -10^9 <= target <= 10^9
# Only one valid answer exists.
# Example 1:
# Input: nums = [2,7,11,15], target = 9
# Output: [0,1]
# Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
# Example 2:
# Input: nums = [3,2,4], target = 6
# Output: [1,2]
# """

#     print("➡️ Sending prompt to Mistral...")

#     response = mistral_client.chat.complete(
#         model="mistral-large-latest",
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.2
#     )

#     print("⬅️ Received response from Mistral")

#     raw = response.choices[0].message.content.strip()

#     match = re.search(r"\{.*\}", raw, re.DOTALL)
#     if not match:
#         print("❌ RAW MODEL OUTPUT:\n", raw)
#         raise ValueError("❌ Failed to extract valid JSON")

#     return json.loads(match.group(0))


# # ---------------------------------------------------------
# # SAVE QUESTION TO DATABASE
# # ---------------------------------------------------------


# def save_question_to_db(test_id, coding_question):
#     question_text = coding_question["problem"]
#     difficulty = coding_question.get("difficulty", "medium")
#     topic = "coding"

#     conn = get_db_connection()
#     cur = conn.cursor()

#     # Insert question
#     cur.execute("""
#         INSERT INTO questions(question_text, difficulty_level, topic)
#         VALUES ( %s, %s, %s)
#         RETURNING question_id;
#     """, (question_text, difficulty, topic))

#     question_id = cur.fetchone()[0]

#     # Update test row
#     cur.execute("""
#         UPDATE tests
#         SET question_id = %s, question_text = %s
#         WHERE test_id = %s;
#     """, (question_id, question_text, test_id))

#     conn.commit()
#     cur.close()
#     conn.close()

#     print(f"✅ Saved question_id={question_id} for test_id={test_id}")
#     return question_id

# # ---------------------------------------------------------
# # RABBITMQ CALLBACK
# # ---------------------------------------------------------


# def callback(ch, method, properties, body):
#     msg = json.loads(body)
#     test_id = msg["correlationId"]
#     jd = msg["jd"]

#     print(f"\n🔥 Generating question for test_id {test_id}")

#     try:
#         result = generate_question(jd)

#         print("Print result ", result)
#         coding_question = result["coding_question"]

#         print("Print coding  ", coding_question)
#         # Save in DB
#         save_question_to_db(test_id, coding_question)

#     except Exception as e:
#         print("ERROR during question generation:", e)

#     ch.basic_ack(delivery_tag=method.delivery_tag)


# # ---------------------------------------------------------
# # START LISTENING
# # ---------------------------------------------------------
# connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
# channel = connection.channel()

# channel.queue_declare(queue=REQUEST_QUEUE, durable=True)
# channel.basic_qos(prefetch_count=1)
# channel.basic_consume(queue=REQUEST_QUEUE, on_message_callback=callback)

# print("🔥 Python Question Generator Worker Running — DB Mode ON")
# channel.start_consuming()
import pika
import json
import psycopg2
from mistralai import Mistral
# from mistralai.client import MistralClient
from dotenv import load_dotenv
import os
import re

# ---------------------------------------------------------
# RABBITMQ CONFIG
# ---------------------------------------------------------
RABBITMQ_HOST = "localhost"
REQUEST_QUEUE = "question_generation_requests"

# ---------------------------------------------------------
# DATABASE CONFIG
# ---------------------------------------------------------
load_dotenv("db_config.env")


def get_db_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )


# ---------------------------------------------------------
# MISTRAL CLIENT
# ---------------------------------------------------------
mistral_client = Mistral(api_key=os.getenv(
    "MISTRAL_API_KEY", "3Uw4lrJFZQze0bgPsDuz622BU4j8ZwAH"))

# ---------------------------------------------------------
# QUESTION GENERATOR
# ---------------------------------------------------------


def generate_question(jd_text):
    prompt = f"""
You are an expert software engineering interviewer.
Your task is to generate EXACTLY ONE coding question.
Generate the Coding questions mostly around Problem Solving
using Data Structure and Algorithms.
Make sure the Problem is related to Job description as much as possible
---------------------------------------------------------
JOB DESCRIPTION (for context only):
{jd_text}
---------------------------------------------------------
STRICT OUTPUT REQUIREMENTS (MANDATORY):
Return ONE and ONLY ONE valid JSON object.
ALL fields below are REQUIRED and MUST be NON-EMPTY.
---------------------------------------------------------
PROBLEM REQUIREMENTS (MANDATORY):
The problem MUST:
- Format the input as needed.
- Clearly specify how the OUTPUT format of the result should be.
- Make sure the problem isn't too big
---------------------------------------------------------
REQUIRED JSON SCHEMA (STRICT):
{{
  "coding_question": {{
    "problem": "Plain-text problem statement describing the task, input format, output format, and edge cases. NO markdown. NO HTML.",
    "difficulty": "medium",
    "constraints": [
      "numeric constraint on input size",
      "numeric constraint on input values",
      "numeric constraint on output size or behavior"
    ],
    "examples": [
      {{
            Provide Example 1 here
      }},
      {{
            Provide Example 2 here
      }},
      {{
            Provide Edge Case here
      }}
    ]
  }}
}}
---------------------------------------------------------
FORMAT RULES (NO EXCEPTIONS):
- JSON ONLY — valid, beautified, nothing else.
---------------------------------------------------------
Sample Question:
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
"""

    print("➡️ Sending prompt to Mistral AIIII...")
    print("DEBUG chat attribute ->",
          mistral_client.chat, type(mistral_client.chat))

    response = mistral_client.chat.complete(
        model="mistral-large-latest",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    print("⬅️ Received response from Mistral")

    raw = response.choices[0].message.content.strip()

    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        print("❌ RAW MODEL OUTPUT:\n", raw)
        raise ValueError("❌ Failed to extract valid JSON")

    return json.loads(match.group(0))

# ---------------------------------------------------------
# SAVE QUESTION TO DATABASE (FULL JSON ONLY)
# ---------------------------------------------------------


# def save_question_to_db(test_id, coding_question):
#     full_json = json.dumps(coding_question)
#     difficulty = coding_question.get("difficulty", "medium")
#     topic = "coding"

#     conn = get_db_connection()
#     cur = conn.cursor()

#     # Insert ONLY the full JSON
#     cur.execute("""
#         INSERT INTO questions(difficulty_level, topic, question_json)
#         VALUES (%s, %s, %s)
#         RETURNING question_id;
#     """, (difficulty, topic, full_json))

#     question_id = cur.fetchone()[0]

#     # Update test row (save JSON not problem text)
#     cur.execute("""
#         UPDATE tests
#         SET question_id = %s, question_json = %s
#         WHERE test_id = %s;
#     """, (question_id, full_json, test_id))

#     conn.commit()
#     cur.close()
#     conn.close()

#     print(f"✅ Saved FULL coding question for test_id={test_id}")
#     return question_id

def save_question_to_db(test_id, coding_question):
    difficulty = coding_question.get("difficulty", "medium")
    topic = "coding"

    # Extract structured fields
    problem = coding_question["problem"]
    constraints = json.dumps(coding_question["constraints"])
    examples = json.dumps(coding_question["examples"])

    conn = get_db_connection()
    cur = conn.cursor()

    # Save FULL question in questions table
    cur.execute("""
        INSERT INTO questions(question_text, difficulty_level, topic, constraints_json, examples_json)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING question_id;
    """, (problem, difficulty, topic, constraints, examples))

    question_id = cur.fetchone()[0]

    # Save ONLY problem in tests table
    cur.execute("""
        UPDATE tests
        SET question_id = %s,
            question_text = %s,
            constraints_json = %s,
            examples_json = %s
        WHERE test_id = %s;
    """, (question_id, problem, constraints, examples, test_id))

    conn.commit()
    cur.close()
    conn.close()

    print(f"✅ Saved question_id={question_id} for test_id={test_id}")

    return question_id

# ---------------------------------------------------------
# RABBITMQ CALLBACK
# ---------------------------------------------------------


def callback(ch, method, properties, body):
    msg = json.loads(body)
    test_id = msg["correlationId"]
    jd = msg["jd"]

    print(f"\n🔥 Generating question for test_id {test_id}")

    try:
        result = generate_question(jd)
        coding_question = result["coding_question"]

        print("Generated full question JSON:", coding_question)

        save_question_to_db(test_id, coding_question)

    except Exception as e:
        print("ERROR during question generation:", e)

    ch.basic_ack(delivery_tag=method.delivery_tag)

# ---------------------------------------------------------
# START LISTENING
# ---------------------------------------------------------


connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
channel = connection.channel()

channel.queue_declare(queue=REQUEST_QUEUE, durable=True)
channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue=REQUEST_QUEUE, on_message_callback=callback)

print("🔥 Python Question Generator Worker Running — FULL JSON MODE")
channel.start_consuming()
