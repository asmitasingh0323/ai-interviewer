import BackButton from "./BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function TakeTest() {
  const location = useLocation();
  const { sessionId, testId, questionId, name, email } = location.state || {};

  const [answer, setAnswer] = useState("");
  const [questionText, setQuestionText] = useState("");

  useEffect(() => {
    if (questionId) {
      axios.get(`http://localhost:8080/api/questions/${questionId}`)
        .then(res => {
          setQuestionText(res.data.questionText);  // ⚡ Check here res.data
        })
        .catch(err => {
          console.error(err);
          alert("❌ Failed to load question");
        });
    }
  }, [questionId]);

  const handleSubmit = () => {
    axios.post("http://localhost:8080/api/submit_answers", {
      sessionId,
      userId: 0, // not needed technically
      questionId,
      answer
    })
    .then(res => alert("✅ Answer submitted!"))
    .catch(err => alert("❌ Error: " + err.response?.data || err.message));
  };

  return (
    <div style={{ padding: "20px" }}>
      <BackButton />
      <h2>🧾 Take Your Test</h2>
      <p><strong>Session ID:</strong> {sessionId}</p>
      <p><strong>Test ID:</strong> {testId}</p>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>

      <br />

      <h3>📝 Question:</h3>
      <p>{questionText}</p>

      <br />

      <textarea 
        placeholder="Type your answer here..." 
        value={answer} 
        onChange={(e) => setAnswer(e.target.value)}
        rows="6"
        cols="50"
      /><br /><br />

      <button onClick={handleSubmit}>Submit Answer</button>
    </div>
  );
}

export default TakeTest;
