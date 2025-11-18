import BackButton from "./BackButton";

import { useEffect, useState } from "react";
import axios from "axios";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/questions")
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Failed to load questions:", err);
        setError("Failed to load questions.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <BackButton />
      <h2 style={{ marginBottom: "30px", fontSize: "24px" }}>All Questions</h2>

      {loading && <p>Loading questions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && questions.length === 0 && (
        <p>No questions found.</p>
      )}

      {questions.map((q, idx) => (
        <div key={q.question_id} style={{ marginBottom: "40px", paddingBottom: "20px", borderBottom: "1px solid #ccc" }}>
          <h3 style={{ marginBottom: "10px" }}>Question {idx + 1}  — <span style={{ fontWeight: "normal" }}>ID: {q.question_id} </span> </h3>
          <pre style={{
            background: "#f9f9f9",
            padding: "15px",
            borderRadius: "6px",
            whiteSpace: "pre-wrap",
            fontFamily: "Courier New, monospace"
          }}>
            {q.question_text}
          </pre>
          <p><strong>Topic:</strong> {q.topic}</p>
          <p><strong>Difficulty:</strong> {q.difficulty_level}</p>
        </div>
      ))}
    </div>
  );
}

export default Questions;

