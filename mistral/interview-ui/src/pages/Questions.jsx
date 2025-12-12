// import BackButton from "./BackButton";

// import { useEffect, useState } from "react";
// import axios from "axios";

// function Questions() {
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axios.get("http://localhost:8080/api/questions")
//       .then(res => {
//         setQuestions(res.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error("❌ Failed to load questions:", err);
//         setError("Failed to load questions.");
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div style={{ padding: "40px", maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
//       <BackButton />
//       <h2 style={{ marginBottom: "30px", fontSize: "24px" }}>All Questions</h2>

//       {loading && <p>Loading questions...</p>}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!loading && questions.length === 0 && (
//         <p>No questions found.</p>
//       )}

//       {questions.map((q, idx) => (
//         <div key={q.question_id} style={{ marginBottom: "40px", paddingBottom: "20px", borderBottom: "1px solid #ccc" }}>
//           <h3 style={{ marginBottom: "10px" }}>Question {idx + 1}  — <span style={{ fontWeight: "normal" }}>ID: {q.question_id} </span> </h3>
//           <pre style={{
//             background: "#2ac3b6ff",
//             padding: "15px",
//             borderRadius: "6px",
//             whiteSpace: "pre-wrap",
//             fontFamily: "Courier New, monospace"
//           }}>
//             {q.question_text}
//           </pre>
//           <p><strong>Topic:</strong> {q.topic}</p>
//           <p><strong>Difficulty:</strong> {q.difficulty_level}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Questions;

import BackButton from "./BackButton";
import { useEffect, useState } from "react";
import axios from "axios";

import HomeButton from "./HomeButton";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/questions")
      .then((res) => {
        const sorted = res.data.sort((a, b) => b.question_id - a.question_id);

        setQuestions(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Failed to load questions:", err);
        setError("Failed to load questions.");
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        padding: "40px",

        maxWidth: "900px",
        margin: "auto",
        fontFamily: "Inter, Arial, sans-serif",
        color: "white",
      }}
    >
      <HomeButton />
      <BackButton />

      <h2
        style={{
          fontSize: "32px",
          marginBottom: "30px",
          textAlign: "center",
          fontWeight: "700",
        }}
      >
        All Questions
      </h2>

      {loading && <p>Loading questions...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && questions.length === 0 && <p>No questions found.</p>}

      {questions.map((q, idx) => (
        <div
          key={q.question_id}
          style={{
            background: "rgba(178, 20, 20, 0.1)",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "30px",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {/* Title */}
          <h3
            style={{
              marginBottom: "12px",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            Question {q.question_id}
          </h3>


          {/* Question Text */}
          <pre
            style={{
              background: "#5dbeb5ff",
              padding: "16px",
              borderRadius: "8px",
              whiteSpace: "pre-wrap",
              fontFamily: "Courier New, monospace",
              fontSize: "14px",
              lineHeight: "1.5",
              color: "#fff",
            }}
          >
            {q.question_text}
          </pre>

          {/* Metadata Row */}
          < div
            style={{
              marginTop: "14px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "15px",
            }}
          >
            <p>
              <strong>Topic:</strong> {q.topic}
            </p>
            <p>
              <strong>Difficulty:</strong> {q.difficulty_level}
            </p>
          </div>
        </div >
      ))
      }
    </div >
  );
}

export default Questions;
