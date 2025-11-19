AI Interviewer

A full-stack system that generates coding interview questions, collects answers, evaluates them using Mistral AI, and displays results in a web UI.
This project consists of three major components:

    Frontend — React + Vite
    Backend — Spring Boot (Java)
    AI Worker — Python service using Mistral API + RabbitMQ + PostgreSQL

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



1. Start Required Services
  PostgreSQL: Must run on localhost:5432
  RabbitMQ: Must run on localhost:5672
  Dashboard (optional): http://localhost:15672
2. Start the Backend (Spring Boot)
    cd backend/interview-api/interview-api
    ./mvnw spring-boot:run
  
  You should see:
  
  Tomcat started on port(s): 8080
  Started InterviewApiApplication...
  
  ✅ Backend now running → http://localhost:8080
  
3. Start the Python AI Worker
  Activate virtual environment:
      cd AI-Interviewer/ai_worker
      python -m venv mistral-env
      .\mistral-env\Scripts\activate
      pip install flask pika psycopg2-binary python-dotenv requests
  
  Run the worker:
      python mistralWorker.py
      
  You should see:
  🎯 Mistral worker is running and waiting for tasks...

4. Start the Frontend (React + Vite)
      cd interview-ui
      npm install        # only first time
      npm run dev
  
    You should see:
        VITE v5.x.x ready in 400ms
        Local: http://localhost:5173/
        Frontend → http://localhost:5173

5. Test the System (Send an Evaluation Task)
        Open a new terminal:
        
        cd AI-Interviewer/ai_worker
        .\mistral-env\Scripts\activate
        python db_send_eval_response.py
  
      When asked for a session ID, enter one from the DB.
  
      If you see:
      📤 Task sent to worker
      
      → RabbitMQ received it
      → Python worker will fetch the answer, call Mistral, evaluate, and update DB.
