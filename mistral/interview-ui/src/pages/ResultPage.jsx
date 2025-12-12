import BackButton from "./BackButton";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const { sessionId } = location.state || {};
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionId) {
      fetch(`http://localhost:8080/api/results/${sessionId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch result");
          return res.json();
        })
        .then((data) => setResult(data))
        .catch((err) => setError(err.message));
    }
  }, [sessionId]);

  if (error) return <div style={{ padding: "20px" }}>❌ {error}</div>;
  if (!result) return <div style={{ padding: "20px" }}>⏳ Loading result...</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "auto", fontFamily: "Arial" }}>
      <BackButton />
      <h2>📊 Test Result</h2>
      <p><strong>Session ID:</strong> {result.sessionId}</p>
      <p><strong>Question:</strong> {result.questionText}</p>
      <p><strong>Your Answer:</strong> {result.answer}</p>
      <p><strong>Score:</strong> {result.score}/10</p>
      <p><strong>AI Evaluation:</strong> {result.evaluation}</p>
    </div>
  );
}

export default ResultPage;
