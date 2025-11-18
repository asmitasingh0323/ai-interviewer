import BackButton from "./BackButton";
import { useState } from "react";
import axios from "axios";

function Submit() {
  const [form, setForm] = useState({
    sessionId: "",
    userId: "",
    questionId: "",
    answer: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("📤 Submitting form data:", form); // Debug print

    axios.post("http://localhost:8080/api/submit_answers", form) 
      .then(res => alert("✅ " + res.data))
      .catch(err => {
        console.error("❌ Error submitting answer:", err);

        if (err.response) {
          alert("❌ Backend error: " + err.response.data);
        } else if (err.request) {
          alert("❌ No response from backend.");
        } else {
          alert("❌ Error: " + err.message);
        }
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <BackButton />
      <h2>📝 Submit Your Answer</h2>

      <input
        name="sessionId"
        placeholder="Session ID"
        value={form.sessionId}
        onChange={handleChange}
      /><br /><br />

      <input
        name="userId"
        placeholder="User ID"
        value={form.userId}
        onChange={handleChange}
      /><br /><br />

      <input
        name="questionId"
        placeholder="Question ID"
        value={form.questionId}
        onChange={handleChange}
      /><br /><br />

      <textarea
        name="answer"
        placeholder="Your answer"
        value={form.answer}
        onChange={handleChange}
        rows={4}
        cols={40}
      ></textarea><br /><br />

      <button onClick={handleSubmit}>Submit Answer</button>
    </div>
  );
}

export default Submit;
