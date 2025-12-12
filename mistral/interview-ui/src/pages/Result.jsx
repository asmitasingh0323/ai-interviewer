// import BackButton from "./BackButton";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// function Result() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { sessionId } = location.state || {};

//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [autoRefreshId, setAutoRefreshId] = useState(null);

//   const fetchResult = () => {
//     if (sessionId) {
//       axios.get(`http://localhost:8080/api/result/${sessionId}`)
//         .then(res => {
//           setResult(res.data);
//           if (res.data.score !== null && res.data.evaluation !== null) {
//             if (autoRefreshId) {
//               clearInterval(autoRefreshId);
//             }
//           }
//         })
//         .catch(err => {
//           console.error("Failed to load result", err);
//           setError("❌ Failed to load result.");
//         });
//     }
//   };

//   useEffect(() => {
//     if (sessionId) {
//       fetchResult();
//       const id = setInterval(fetchResult, 3000);
//       setAutoRefreshId(id);
//       return () => clearInterval(id);
//     }
//   }, [sessionId]);

//   if (error) {
//     return (
//       <div style={{ padding: "20px", textAlign: "center", color: "#e74c3c" }}>
//         <BackButton />
//         <h2>❌ {error}</h2>
//       </div>
//     );
//   }

//   if (!result) {
//     return (
//       <div style={{ padding: "20px", textAlign: "center" }}>
//         <h2>Loading...</h2>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       padding: "30px",
//       maxWidth: "800px",
//       margin: "auto",
//       backgroundColor: "#f8f9fa",
//       borderRadius: "10px",
//       boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//       marginTop: "50px"
//     }}>
//       <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>📊 Test Results</h2>
//       <p><strong>Session ID:</strong> {sessionId}</p>
//       <p><strong>Question:</strong> {result.questionText}</p>
//       <p><strong>Your Answer:</strong> {result.answer}</p>
//       <p><strong>Score:</strong> {result.score ?? "Not yet evaluated"}</p>
//       <p><strong>Evaluation:</strong> {result.evaluation ?? "Not yet evaluated"}</p>

//       <div style={{
//         display: "flex",
//         justifyContent: "center",
//         gap: "20px",
//         marginTop: "30px"
//       }}>
//         <button
//           onClick={fetchResult}
//           style={{
//             padding: "12px 25px",
//             backgroundColor: "#3498db",
//             color: "#fff",
//             border: "none",
//             borderRadius: "8px",
//             fontSize: "16px",
//             cursor: "pointer"
//           }}
//         >
//           🔄 Refresh Result
//         </button>

//         <button
//           onClick={() => navigate("/")}
//           style={{
//             padding: "12px 25px",
//             backgroundColor: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "8px",
//             fontSize: "16px",
//             cursor: "pointer"
//           }}
//         >
//           🏠 Home
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Result;

import BackButton from "./BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import HomeButton from "./HomeButton";
/* Pretty-print evaluation JSON if possible */
function formatEvaluation(text) {
  if (!text) return "Pending";
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state || {};

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fetchResult = () => {
    if (!sessionId) {
      setError("Session ID missing");
      return;
    }

    axios
      .get(`http://localhost:8080/api/result/${sessionId}`)
      .then((res) => setResult(res.data))
      .catch(() => setError("Failed to load result"));
  };

  useEffect(() => {
    fetchResult();
    const id = setInterval(fetchResult, 3000);
    return () => clearInterval(id);
  }, []);

  if (error) {
    return (
      <div style={{ padding: "40px", color: "#0f867a", textAlign: "center" }}>
        <BackButton />
        <h2>❌ {error}</h2>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ padding: "40px", color: "#0f867a", textAlign: "center" }}>
        <h2>⏳ Evaluating submission…</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#17857aff",
        padding: "40px",
      }}
    >
      <BackButton />
      <HomeButton />
      {/* RESULT CARD */}
      <div
        style={{
          maxWidth: "700px",
          margin: "40px auto",
          background: "#4ebea2ff",
          borderRadius: "14px",
          padding: "32px",
          boxShadow: "0 12px 30px rgba(9, 1, 1, 0.25)",
          color: "#1e1e1e",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "8px",
            color: "#121313ff",
            fontWeight: "700",
          }}
        >
          Test Results
        </h2>

        <p style={{ textAlign: "center", color: "#131212ff" }}>
          Session ID: <strong>{sessionId}</strong>
        </p>

        <hr style={{ margin: "20px 0" }} />

        {/* SCORE */}
        <div
          style={{
            background: "#76df9bff",
            padding: "16px",
            borderRadius: "10px",
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "25px",
          }}
        >
          Score: {result.score ?? "Pending"}
        </div>

        {/* EVALUATION */}
        <div>
          <h3 style={{ marginBottom: "10px" }}>Evaluation</h3>
          <pre
            style={{
              background: "#aaf6b5ff",
              padding: "16px",
              borderRadius: "10px",
              whiteSpace: "pre-wrap",
              overflowX: "auto",
              fontSize: "14px",
            }}
          >
            {formatEvaluation(result.evaluation)}
          </pre>
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <button
            onClick={fetchResult}
            style={{
              padding: "10px 22px",
              background: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            🔄 Refresh
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 22px",
              background: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;

