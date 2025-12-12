# AI-Powered Interviewer

An end-to-end AI-driven technical interview platform that validates job descriptions,
generates role-aligned coding questions, conducts timed interview sessions, and evaluates
candidate answers asynchronously using large language models.

The system follows a distributed, event-driven architecture with a React frontend,
Spring Boot backend, PostgreSQL database, RabbitMQ message broker, and Python-based
AI worker services.

---

## System Overview

Frontend
- React + Vite
- Communicates with backend via REST APIs

Backend
- Java Spring Boot
- Manages interview lifecycle and sessions
- Publishes evaluation tasks to RabbitMQ
- Persists results to PostgreSQL

AI Workers
- Python-based services
- Consume tasks from RabbitMQ
- Perform JD validation, question generation, and answer evaluation

Infrastructure
- PostgreSQL
- RabbitMQ

---

## Repository Structure

AI-Interviewer/
│
├── ai_worker/              # Python AI evaluation microservice
│   ├── mistralWorker.py
│   ├── db_config.env
│   ├── ai_engine_server.py
│   ├── ai_interviewer.py
│   └── db_send_eval_response.py
│
├── backend/
│   └── interview-api/      # Java Spring Boot backend
│       ├── src/
│       ├── pom.xml
│       ├── mvnw / mvnw.cmd
│       └── HELP.md
│
├── interview-ui/           # React frontend (Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── RUN_NOTES.md            # Setup + run instructions
└── .gitignore


---

## Prerequisites

Make sure the following are installed:

- Java 17 or later
- Maven
- Node.js 18 or later
- Python 3.9 or later
- PostgreSQL (running)
- RabbitMQ (running): Must run on localhost:5672

Optional:
- DBeaver / pgAdmin
- RabbitMQ Management UI

---

## Environment Setup

### Clone the Repository
git clone <repository-url>
cd mistral

### Python Virtual Environment

python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt


Always activate the virtual environment before running any Python workers.

---

## Running the Application

### Step 1: Start Infrastructure Services

Ensure the following services are running:
- PostgreSQL
- RabbitMQ

---

### Step 2: Start Backend (Spring Boot)

cd java\interview-api
.\mvnw spring-boot:run

Backend will be available at:
http://localhost:8080

You should see:

Tomcat started on port(s): 8080
Started InterviewApiApplication...

---

### Step 3: Start Python AI Workers

From the project root:
Activate virtual environment:
.\venv\Scripts\activate

python mistralWorker.py
python jd_validator_worker.py
python question_generator_worker.py


Each worker will start listening for tasks from RabbitMQ.
  You should see:
  Mistral worker is running and waiting for tasks...
  Similarly others
  
---

### Step 4: Optional Manual Evaluation Test

Used only to verify RabbitMQ + worker communication.

.\venv\Scripts\activate
python db_send_eval_response.py


If the task is published successfully, the worker will process it asynchronously.

---

### Step 5: Start Frontend (React)

cd interview-ui
npm install # first time only
npm run dev

Frontend will be available at:
http://localhost:5173

    You should see:
        VITE v5.x.x ready in 400ms
        Local: http://localhost:5173/
        Frontend → http://localhost:5173
---

## Recommended Startup Order

1. PostgreSQL
2. RabbitMQ
3. Spring Boot backend
4. Python AI workers
5. React frontend

---

## Shutdown Order

1. Stop React frontend
2. Stop Python workers
3. Stop Spring Boot backend
4. Stop infrastructure services (optional)

Use Ctrl + C to stop each service.

---

## Notes

- Always run commands from the project root unless stated otherwise.
- Backend and AI workers are intentionally decoupled.
- All AI evaluation is handled asynchronously via RabbitMQ.

