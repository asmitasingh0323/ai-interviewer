import BackButton from "./BackButton";
import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import HomeButton from "./HomeButton";

function UserInterviews() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [openRows, setOpenRows] = useState({}); // <-- track expanded rows

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user-interviews")
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load interview data."));
  }, []);

  /** Toggle all three sections together */
  const toggleRow = (index) => {
    setOpenRows((prev) => ({
      ...prev,
      [index]: !prev[index], // toggle ON/OFF
    }));
  };

  // Apply search
  const filteredData = data.filter((entry) =>
    Object.values(entry)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "30px", maxWidth: "95%", margin: "auto" }}>
      <BackButton />
      <HomeButton />
      <h2 style={{ textAlign: "center", color: "white" }}>User Interviews</h2>

      <input
        type="text"
        placeholder="Search by name, email, test ID, session ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "25px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "white",
          fontSize: "16px",
        }}
      >
        <thead>
          <tr style={{ background: "#1d7f78" }}>
            {[
              "Name",
              "Email",
              "Test ID",
              "Session ID",
              "Question",
              "Answer",
              "Score",
              "Evaluation",
            ].map((col, idx) => (
              <th
                key={idx}
                style={{
                  padding: "14px",
                  borderBottom: "2px solid #145c56",
                  textAlign: "left",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredData.map((entry, idx) => (
            <>
              {/* ================= ROW ================= */}
              <tr
                key={idx}
                style={{
                  background: idx % 2 === 0 ? "#2a8c86" : "#257a75",
                }}
              >
                <td style={tdStyle}>{entry.name}</td>
                <td style={tdStyle}>{entry.email}</td>
                <td style={tdStyle}>{entry.test_id}</td>
                <td style={tdStyle}>{entry.session_id}</td>

                {/* VIEW BUTTON — controls all 3 fields */}
                <td style={tdStyle}>
                  <button style={viewBtn} onClick={() => toggleRow(idx)}>
                    ▶ View
                  </button>
                </td>
                <td style={tdStyle}>
                  <button style={viewBtn} onClick={() => toggleRow(idx)}>
                    ▶ View
                  </button>
                </td>
                <td style={tdStyle}>{entry.score}</td>
                <td style={tdStyle}>
                  <button style={viewBtn} onClick={() => toggleRow(idx)}>
                    ▶ View
                  </button>
                </td>
              </tr>

              {/* ================= EXPANDED SECTION ================= */}
              {openRows[idx] && (
                <tr>
                  <td colSpan="8" style={{ background: "#1e6f6a", padding: "20px" }}>
                    {/* QUESTION */}
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ color: "white" }}>Question:</h3>
                      <pre style={questionBox}>{entry.question_text}</pre>
                    </div>

                    {/* ANSWER */}
                    <div style={{ marginBottom: "20px" }}>
                      <h3 style={{ color: "white" }}>Answer:</h3>
                      <pre style={answerBox}>{entry.answer}</pre>
                    </div>

                    {/* EVALUATION */}
                    <div>
                      <h3 style={{ color: "white" }}>Evaluation:</h3>
                      <pre style={evaluationBox}>
                        {formatEvaluation(entry.evaluation)}
                      </pre>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- STYLES ---------- */

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #145c56",
};

const viewBtn = {
  background: "#e4e0d5ff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
  color: "#333",
};

const questionBox = {
  background: "#38794fec",
  padding: "12px",
  borderRadius: "8px",
  whiteSpace: "pre-wrap",
};

const answerBox = {
  background: "#83e7a6ec",
  padding: "12px",
  borderRadius: "8px",
  whiteSpace: "pre-wrap",
};

const evaluationBox = {
  background: "#6bbe88ec",
  padding: "12px",
  borderRadius: "8px",
  whiteSpace: "pre-wrap",
};

/* ---------- JSON formatter ---------- */
function formatEvaluation(text) {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

export default UserInterviews;
