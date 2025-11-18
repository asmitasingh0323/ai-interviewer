import json
import pika


def send_task_to_worker(session_id):
    task = {
        "session_id": session_id
    }

    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()
    channel.queue_declare(queue="task_queue", durable=True)

    channel.basic_publish(
        exchange="",
        routing_key="task_queue",
        body=json.dumps(task),
        properties=pika.BasicProperties(delivery_mode=2)
    )

    print("📤 Task sent to worker.")
    connection.close()

def main():
    session_id = input("🔑 Enter session_id: ").strip()
    send_task_to_worker(session_id)
    
if __name__ == "__main__":
    main()
