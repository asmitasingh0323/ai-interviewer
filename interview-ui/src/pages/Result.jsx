import BackButton from "./BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state || {};

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [autoRefreshId, setAutoRefreshId] = useState(null);

  const fetchResult = () => {
    if (sessionId) {
      axios.get(`http://localhost:8080/api/result/${sessionId}`)
        .then(res => {
          setResult(res.data);
          if (res.data.score !== null && res.data.evaluation !== null) {
            if (autoRefreshId) {
              clearInterval(autoRefreshId);
            }
          }
        })
        .catch(err => {
          console.error("Failed to load result", err);
          setError("❌ Failed to load result.");
        });
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchResult();
      const id = setInterval(fetchResult, 3000);
      setAutoRefreshId(id);
      return () => clearInterval(id);
    }
  }, [sessionId]);

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#e74c3c" }}>
        <BackButton />
        <h2>❌ {error}</h2>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{
      padding: "30px",
      maxWidth: "800px",
      margin: "auto",
      backgroundColor: "#f8f9fa",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      marginTop: "50px"
    }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>📊 Test Results</h2>
      <p><strong>Session ID:</strong> {sessionId}</p>
      <p><strong>Question:</strong> {result.questionText}</p>
      <p><strong>Your Answer:</strong> {result.answer}</p>
      <p><strong>Score:</strong> {result.score ?? "Not yet evaluated"}</p>
      <p><strong>Evaluation:</strong> {result.evaluation ?? "Not yet evaluated"}</p>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "30px"
      }}>
        <button
          onClick={fetchResult}
          style={{
            padding: "12px 25px",
            backgroundColor: "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          🔄 Refresh Result
        </button>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 25px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
}

export default Result;

