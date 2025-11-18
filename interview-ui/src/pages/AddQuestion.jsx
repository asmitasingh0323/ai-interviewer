import BackButton from "./BackButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [topic, setTopic] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    fetch("http://localhost:8080/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionText,
        topic,
        difficultyLevel,
      }),
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to add question");
      alert("✅ Question added!");
      navigate("/questions"); // Redirect to questions list
    })
    .catch(err => alert("❌ " + err.message));
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <BackButton />
      <h2>➕ Add New Question</h2>

      <input 
        placeholder="Question Text" 
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input 
        placeholder="Topic" 
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input 
        placeholder="Difficulty Level (Easy, Medium, Hard)" 
        value={difficultyLevel}
        onChange={(e) => setDifficultyLevel(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />

      <button onClick={handleSubmit} style={{ padding: "10px 20px", backgroundColor: "#3498db", color: "white", border: "none", cursor: "pointer" }}>
        Submit Question
      </button>
    </div>
  );
}

export default AddQuestion;
