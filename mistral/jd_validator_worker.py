import pika
import os
import json
from dotenv import load_dotenv

from mistralai import Mistral
# ---------- CONFIG ----------
RABBITMQ_HOST = "localhost"
mistral_client = Mistral(api_key="3Uw4lrJFZQze0bgPsDuz622BU4j8ZwAH")

REQUEST_QUEUE = "jd_validation_requests"
RESULT_QUEUE = "jd_validation_results"

# ---------- JD VALIDATION ----------


def review_jd(jd_text):
    prompt = f"""
    You are a strict validator. Determine if this Job Description is for a Software Engineer / SDE role.

    JD:
    {jd_text}

    Respond in JSON ONLY:
    {{
        "is_valid": true/false,
        "reason": "short explanation"
    }}
    """
    res = mistral_client.chat.complete(
        model="mistral-large-latest",
        messages=[{"role": "user", "content": prompt}]
    )

    print("RAW MISTRAL RESPONSE:", res)

    # Mistral output format
    ai_text = res.choices[0].message.content
    print("AI TEXT RETURNED:", ai_text)
    return ai_text


def extract_json(text):
    text = text.strip()

    # Remove ```json ... ``` wrappers
    if text.startswith("```"):
        text = text.split("```", 2)[1]  # keep content inside
        text = text.replace("json", "", 1).strip()

    # Try to extract the JSON block
    import re
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return None  # invalid JSON
    return match.group(0)


# ---------- CALLBACK ----------


def callback(ch, method, properties, body):
    msg = json.loads(body)
    jd = msg["jd"]
    correlation_id = msg["correlationId"]

    print("Received JD for validation:", jd[:80])

    ai_result = review_jd(jd)
    print("AI RAW:", ai_result)

    clean = extract_json(ai_result)

    if clean is None:
        print("❌ Could not extract valid JSON from AI response.")
        result_json = {"is_valid": False,
                       "reason": "AI returned invalid JSON format"}
    else:
        result_json = json.loads(clean)

    output_msg = {
        "correlationId": correlation_id,
        "result": result_json
    }

    ch.basic_publish(
        exchange="",
        routing_key=RESULT_QUEUE,
        body=json.dumps(output_msg)
    )

    print("Sent validation result:", output_msg)


# ---------- SETUP ----------
connection = pika.BlockingConnection(
    pika.ConnectionParameters(RABBITMQ_HOST)
)
channel = connection.channel()

# Ensure queues exist
channel.queue_declare(queue=REQUEST_QUEUE, durable=True)
channel.queue_declare(queue=RESULT_QUEUE, durable=True)

channel.basic_consume(
    queue=REQUEST_QUEUE,
    on_message_callback=callback,
    auto_ack=True
)

print("🔥 AI JD Validator Worker Running — Waiting for JD…")
channel.start_consuming()
