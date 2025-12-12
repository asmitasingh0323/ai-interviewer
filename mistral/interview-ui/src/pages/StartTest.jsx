import BackButton from "./BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeButton from "./HomeButton";

function formatQuestionHTML(text) {
  if (!text) return "";

  let safe = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  safe = safe
    .replace(/\*\*Example:\*\*/g, "<br><strong>Example:</strong><br>")
    .replace(/\*\*Constraints:\*\*/g, "<br><strong>Constraints:</strong><br>")
    .replace(/•/g, "<br>• ")
    .replace(/\n/g, "<br>");

  return safe;
}

function StartTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState(null);
  const { sessionId, testId, questionId, questionText, constraints, examples, name, email } =
    location.state || {};

  const [answer, setAnswer] = useState("");

  /** TIMER STATE **/
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  /** START TIMER **/
  const startTimer = () => {
    setTimeLeft(timerMinutes * 60);
    setIsRunning(true);
  };

  /** TIMER TICK **/
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      setIsDisabled(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    console.log("Effect triggered");
    console.log("questionText:", questionText);
    const autoFlow = questionText && constraints && examples;

    if (autoFlow) return;

    // Manual workflow: get question using questionId
    if (questionId) {
      fetch(`http://localhost:8080/api/questions/${questionId}`)
        .then(res => res.json())
        .then(data => {
          setQ({
            questionId: data.questionId,
            questionText: data.questionText
          });
        })
        .catch(err => console.error("Failed to fetch question", err));
    }
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    fetch("http://localhost:8080/api/submit_answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, questionId, answer }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Submit failed");
        alert("✅ Answer submitted");
        navigate("/result", { state: { sessionId } });
      })
      .catch((err) => alert(err.message));
  };

  const parsedConstraints = Array.isArray(constraints)
    ? constraints
    : (() => {
      try {
        return constraints ? JSON.parse(constraints) : [];
      } catch {
        return [];
      }
    })();

  const parsedExamples = Array.isArray(examples)
    ? examples
    : (() => {
      try {
        return examples ? JSON.parse(examples) : [];
      } catch {
        return [];
      }
    })();


  const finalQuestionId = q?.questionId || questionId;
  const finalQuestionText = q?.questionText || questionText;

  if (!finalQuestionText) {
    return <div style={{ padding: 40, color: "white" }}>Loading question...</div>;
  }



  return (
    <div style={{ minHeight: "100vh", background: "#30a1a2ff" }}>
      <BackButton />
      <HomeButton />
      {/* HEADER */}
      <div
        style={{
          background: "#2c3e50",
          color: "white",
          padding: "14px",
          textAlign: "center",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        AI Interview System – Test Mode
      </div>

      {/* USER + TIMER BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 40px",
          color: "white",
          background: "#278e90ff",
        }}
      >
        <div>
          <strong>Session:</strong> {sessionId} &nbsp;
          <strong>Test:</strong> {testId} &nbsp;
          <strong>Name:</strong> {name} &nbsp;
          <strong>Email:</strong> {email}
        </div>

        {/* TIMER CONTROLS */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!isRunning && timeLeft === 0 && (
            <>
              <select
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(Number(e.target.value))}
                style={{ padding: "6px" }}
              >
                {[5, 10, 15, 20, 30, 45, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </select>
              <button
                onClick={startTimer}
                style={{
                  padding: "6px 12px",
                  background: "#2ecc71",
                  border: "none",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ▶ Start
              </button>
            </>
          )}

          {isRunning && (
            <div style={{ color: "#ff3b3b", fontWeight: "bold" }}>
              ⏳ {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ display: "flex", gap: "30px", padding: "30px 40px" }}>
        {/* QUESTION */}
        <div
          style={{
            flex: 1,
            background: "#42b4d1ff",
            padding: "20px",
            borderRadius: "10px",
            maxHeight: "75vh",
            overflowY: "auto",
          }}
        >
          {/* <h3>📘 Question #{questionId}</h3>
          <div dangerouslySetInnerHTML={{ __html: formatQuestionHTML(questionText) }} /> */}
          <h3>📘 Question #{finalQuestionId}</h3>
          <div dangerouslySetInnerHTML={{ __html: formatQuestionHTML(finalQuestionText) }} />

          {/* <h4>Constraints:</h4>
          <ul>
            {parsedConstraints.map((c, i) => <li key={i}>{c}</li>)}
          </ul>

          <h4>Examples:</h4>
          {parsedExamples.map((ex, i) => (
            <div key={i} style={{ marginBottom: "15px" }}>
              <pre>{JSON.stringify(ex.input, null, 2)}</pre>
              <pre>{JSON.stringify(ex.output, null, 2)}</pre>
              <p>{ex.explanation}</p>
            </div>
          ))} */}
          {/* <div style={{ textAlign: "left" }}>
            <h4>Constraints:</h4>
            <ul style={{ marginLeft: "0px", paddingLeft: "20px" }}>
              {parsedConstraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            <h4>Examples:</h4>
            <div style={{ marginLeft: "0px" }}>
              {parsedExamples.map((ex, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <pre>{JSON.stringify(ex.input, null, 2)}</pre>
                  <pre>{JSON.stringify(ex.output, null, 2)}</pre>
                  <p>{ex.explanation}</p>
                </div>
              ))}
            </div>
          </div> */}

          <div style={{ textAlign: "left" }}>

            {/* CONSTRAINTS (show only if exists) */}
            {parsedConstraints.length > 0 && (
              <>
                <h4>Constraints:</h4>
                <ul style={{ marginLeft: "0px", paddingLeft: "20px" }}>
                  {parsedConstraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </>
            )}

            {/* EXAMPLES (show only if exists) */}
            {parsedExamples.length > 0 && (
              <>
                <h4>Examples:</h4>
                <div style={{ marginLeft: "0px" }}>
                  {parsedExamples.map((ex, i) => (
                    <div key={i} style={{ marginBottom: "15px" }}>
                      <pre>{JSON.stringify(ex.input, null, 2)}</pre>
                      <pre>{JSON.stringify(ex.output, null, 2)}</pre>
                      <p>{ex.explanation}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>


        </div>


        {/* ANSWER */}
        <textarea
          placeholder="Write your answer here..."
          value={answer}
          disabled={isDisabled}
          onChange={(e) => setAnswer(e.target.value)}
          style={{
            flex: 1,
            height: "75vh",
            padding: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />
      </div>

      {/* SUBMIT */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          style={{
            background: isDisabled ? "#aaa" : "#3498db",
            color: "white",
            padding: "12px 30px",
            borderRadius: "8px",
            fontSize: "16px",
            border: "none",
          }}
        >
          {isDisabled ? "⏳ Time Up" : "Submit Answer"}
        </button>
      </div>
    </div >
  );
}

export default StartTest;
