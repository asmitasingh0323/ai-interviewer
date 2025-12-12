import BackButton from "./BackButton";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HomeButton from "./HomeButton";

function GenerateTest() {
  const [questionId, setQuestionId] = useState("");
  const [testId, setTestId] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    const newTestId = uuidv4().slice(0, 8); // short testId
    setTestId(newTestId);

    axios.post("http://localhost:8080/api/generate_test", {
      testId: newTestId,
      questionId: parseInt(questionId),
    })
      .then(res => alert("✅ Test generated successfully!"))
      .catch(err => {
        console.error("❌ Error:", err);
        alert("❌ Failed to generate test");
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <HomeButton />
      <h2> Generate a New Test</h2>

      {/* <input
        type="text"
        placeholder="Enter Question ID"
        value={questionId}
        onChange={(e) => setQuestionId(e.target.value)}
      /> */}

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter Question ID"
          value={questionId}
          onChange={(e) => setQuestionId(e.target.value)}
          style={{ padding: "8px", fontSize: "14px" }}
        />
        <button
          onClick={() => navigate("/questions")}
          style={{
            padding: "8px 14px",
            backgroundColor: "#3498db",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🔍 View Questions
        </button>
      </div>

      <br /><br />

      <button onClick={handleGenerate}>Generate Test</button>

      {testId && (
        <div style={{ marginTop: "20px" }}>
          <strong>🆔 Test ID:</strong> {testId}
        </div>
      )}

      <br /><br />
      <button onClick={() => navigate("/")}>⬅️ Back</button>
    </div>
  );
}

export default GenerateTest;
