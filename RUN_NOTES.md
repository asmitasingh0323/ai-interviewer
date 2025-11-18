# 🧠 AI-Powered Interviewer — Run & Setup Notes

**Project Root:**  
`C:\Users\ashmi\OneDrive\Desktop\finalYearProject\mistral`

This folder contains everything:

ai_interviewer.py
db_send_eval_response.py
mistralWorker.py
db_config.env
interview-ui/
java/
venv/

---

## 🚀 FULL STARTUP PROCESS (ALL COMPONENTS)

### 1️⃣ Start PostgreSQL and RabbitMQ
- Make sure **PostgreSQL** is running on port **5432**  
- Make sure **RabbitMQ** is running on port **5672**  
- RabbitMQ dashboard (optional): http://localhost:15672  

---

### 2️⃣ Start Backend (Spring Boot)
**Command:**
cd java\interview-api
.\mvnw spring-boot:run
You’ll know it’s working when you see:


Tomcat started on port(s): 8080
Started InterviewApiApplication in ...
✅ Backend is now running at http://localhost:8080

🛑 To Stop:
Press Ctrl + C in that terminal.

3️⃣ Start Python AI Worker
Command:

cd C:\Users\ashmi\OneDrive\Desktop\finalYearProject\mistral
.\venv\Scripts\activate
python mistralWorker.py
You should see:

🎯 Mistral worker is running and waiting for tasks...
🛑 To Stop:
Press Ctrl + C

4️⃣ Send a Manual Evaluation Task (for testing)
Open a new terminal, activate the same venv:


cd C:\Users\ashmi\OneDrive\Desktop\finalYearProject\mistral
.\venv\Scripts\activate
python db_send_eval_response.py
When it asks for a session id, enter:


d959d16a-bbb5-43e2-8a99-98a087db4c46
If it prints 📤 Task sent to worker, that means RabbitMQ got the message and the worker will process it.

5️⃣ Start Frontend (React + Vite)
Command:


cd interview-ui
npm install     # only needed first time
npm run dev
After a few seconds, it’ll show something like:



VITE v5.x.x  ready in 400ms
Local:  http://localhost:5173/
✅ The frontend is now live at http://localhost:5173

🛑 To Stop:
In the same terminal → press Ctrl + C → confirm with Y

RUN ORDER SUMMARY

Start PostgreSQL

Start RabbitMQ

Start Spring Boot backend

Start Python worker

Start React UI


🧹 SHUTDOWN ORDER

Stop React UI (Ctrl + C)

Stop Python worker (Ctrl + C)

Stop Spring Boot (Ctrl + C)

Optionally stop PostgreSQL & RabbitMQ services


🧾 CHECK DATABASE (DBeaver or pgAdmin)

Connection Info (from db_config.env):

Host: localhost
Port: 5432
Database: InterviewDatabase
User: postgres
Password: (your password)


To view data:

Open DBeaver or pgAdmin

Connect to the DB

Expand → Databases → InterviewDatabase → Schemas → public → Tables

Right-click interview_sessions → View/Edit Data → All Rows
✅ You’ll see question, answer, evaluation, score, etc.

⚙️ USEFUL COMMANDS RECAP
Purpose	Command
Activate Python venv	.\venv\Scripts\activate
Run AI Worker	python mistralWorker.py
Send eval task	python db_send_eval_response.py
Start Backend	.\mvnw spring-boot:run
Start Frontend	npm run dev
Stop any service	Ctrl + C
💡 Extra Notes

Always run terminals from the mistral root folder.

Always activate venv before running Python files.

If Vite says the port is busy, it means another instance is running — close it or change the port.

Use code . in PowerShell to open this project in VS Code instantly.

Keep this file (RUN_NOTES.md) in the same folder as mistralWorker.py for quick reference.

