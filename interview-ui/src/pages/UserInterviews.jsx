import BackButton from "./BackButton";
import '../App.css';
import { useEffect, useState } from "react";
import axios from "axios";

function UserInterviews() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/user-interviews")
      .then(res => setData(res.data))
      .catch(() => setError("Failed to load interview data."));
  }, []);

  // Handle resizer logic
  useEffect(() => {
    const initResize = (e) => {
      const th = e.target.parentElement;
      const startX = e.clientX;
      const startWidth = th.offsetWidth;

      const onMouseMove = (moveEvent) => {
        const newWidth = startWidth + (moveEvent.clientX - startX);
        th.style.width = `${newWidth}px`;
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    window.initResize = initResize;
  }, []);

  return (
    <div style={{ padding: "30px", maxWidth: "95%", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <BackButton />
      <h2>User Interviews</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && data.length === 0 && <p>No interview data found.</p>}

      {data.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr>
              {["User", "Email", "Test ID", "Session ID", "Question", "Answer", "Score", "Evaluation"].map((col, idx) => (
                <th key={idx} style={cellStyle} className="resizable-th">
                  {col}
                  <div className="resizer" onMouseDown={window.initResize}></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={idx}>
                <td style={cellStyle}>{entry.name}</td>
                <td style={cellStyle}>{entry.email}</td>
                <td style={cellStyle}>{entry.test_id}</td>
                <td style={cellStyle}>{entry.session_id}</td>
                <td style={cellStyle}>{entry.question_text}</td>
                <td style={cellStyle}>{entry.answer}</td>
                <td style={cellStyle}>{entry.score}</td>
                <td style={cellStyle}>{entry.evaluation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const cellStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
  verticalAlign: "top",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  position: "relative"
};

export default UserInterviews;
