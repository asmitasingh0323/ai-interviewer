// import BackButton from "./BackButton";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";

// function formatQuestionHTML(text) {
//   return text
//     .replace(/\*\*Example:\*\*/g, "<br><br><strong>Example:</strong>")
//     .replace(/\*\*Constraints:\*\*/g, "<br><br><strong>Constraints:</strong>")
//     .replace(/•/g, "<br>•")
//     .replace(/\n/g, "<br>");
// }


// function StartTest() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { sessionId, testId, questionId, questionText, name, email } = location.state || {};

//   const [answer, setAnswer] = useState("");
//   const [timeLeft, setTimeLeft] = useState(5 * 60); // 15 minutes in seconds
//   const [isDisabled, setIsDisabled] = useState(false);

//   const handleSubmit = () => {
//     fetch("http://localhost:8080/api/submit_answers", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         sessionId,
//         questionId,
//         answer
//       }),
//     })
//     .then(res => {
//       if (!res.ok) throw new Error("Failed to submit");
//       alert("✅ Answer submitted successfully!");
//       navigate("/result", { state: { sessionId } });
//     })
//     .catch(err => alert("❌ Error: " + err.message));
//   };

//   // Timer Logic
//   useEffect(() => {
//     if (timeLeft <= 0) {
//       setIsDisabled(true); // Disable when time is over
//       return;
//     }
//     const timer = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   // Format seconds into MM:SS
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div style={{
//       minHeight: "100vh",
//       width: "100%",
//       backgroundColor: "#f0f2f5"
//     }}>
//       <BackButton />
//       {/* Header Bar */}
//       <div style={{
//         width: "100%",
//         backgroundColor: "#2c3e50",
//         padding: "15px 0",
//         color: "white",
//         fontSize: "22px",
//         textAlign: "center",
//         fontWeight: "bold",
//       }}>
//         🧠 AI Interview System - Test Mode
//       </div>

//       {/* Test Box */}
//       <div style={{
//         width: "100%",
//         padding: "40px 60px",
//         boxSizing: "border-box",
//         backgroundColor: "#fff",
//         borderRadius: "10px",
//         padding: "40px",
//         boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
//         marginTop: "30px"
//       }}>
//         {/* Timer */}
//         <div style={{
//           fontSize: "18px",
//           color: "#e74c3c",
//           fontWeight: "bold",
//           marginBottom: "20px",
//           textAlign: "right"
//         }}>
//           ⏳ Time Left: {formatTime(timeLeft)}
//         </div>

//         {/* Test Details */}
//         <div style={{
//           display: "flex",
//           gap: "40px",
//           flexWrap: "wrap",
//           justifyContent: "flex-start",
//           marginBottom: "20px",
//           fontSize: "16px"
//         }}>
//           <div><strong>Session ID:</strong> {sessionId}</div>
//           <div><strong>Test ID:</strong> {testId}</div>
//           <div><strong>Name:</strong> {name}</div>
//           <div><strong>Email:</strong> {email}</div>
//         </div>

//         {/* Question */}
//         <h3 style={{ marginTop: "30px", color: "#34495e" }}>📚 Question:</h3>
//           <div
//             style={{
//               backgroundColor: "#ecf0f1",
//               padding: "15px",
//               borderRadius: "8px",
//               fontSize: "18px",
//               marginBottom: "20px",
//               lineHeight: "1.6"
//             }}
//             dangerouslySetInnerHTML={{ __html: formatQuestionHTML(questionText) }}
//           ></div>

//         {/* Answer Box */}
//         <textarea
//           placeholder="✍️ Write your answer here..."
//           value={answer}
//           onChange={(e) => setAnswer(e.target.value)}
//           style={{
//             width: "100%",
//             height: "300px",
//             padding: "15px",
//             fontSize: "16px",
//             borderRadius: "8px",
//             border: "1px solid #bdc3c7",
//             marginBottom: "20px",
//             resize: "vertical"
//           }}
//           disabled={isDisabled}
//         />

//         {/* Submit Button */}
//         <div style={{ textAlign: "center" }}>
//           <button
//             onClick={handleSubmit}
//             disabled={isDisabled}
//             style={{
//               backgroundColor: isDisabled ? "#95a5a6" : "#3498db",
//               color: "white",
//               padding: "12px 30px",
//               fontSize: "16px",
//               border: "none",
//               borderRadius: "8px",
//               cursor: isDisabled ? "not-allowed" : "pointer"
//             }}
//           >
//             {isDisabled ? "⏳ Time Up!" : "🚀 Submit Answer"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default StartTest;

import BackButton from "./BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function formatQuestionHTML(text) {
  return text
    .replace(/\*\*Example:\*\*/g, "<strong style='display:block; margin-top: 10px;'>Example:</strong>")
    .replace(/\*\*Constraints:\*\*/g, "<strong style='display:block; margin-top: 15px;'>Constraints:</strong>")
    .replace(/•/g, "<li>")
    .replace(/\n/g, "") // remove line breaks from DB
    .replace(/<li>(.*?)<\/li>/g, "<ul><li>$1</li></ul>"); // wrap bullets
}
function StartTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, testId, questionId, questionText, name, email } = location.state || {};

  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = () => {
    fetch("http://localhost:8080/api/submit_answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, questionId, answer }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit");
        alert("✅ Answer submitted successfully!");
        navigate("/result", { state: { sessionId } });
      })
      .catch((err) => alert("❌ Error: " + err.message));
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsDisabled(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <BackButton />
      <div style={{
        width: "100%",
        backgroundColor: "#2c3e50",
        padding: "15px 0",
        color: "white",
        fontSize: "22px",
        textAlign: "center",
        fontWeight: "bold",
      }}>
        🧠 AI Interview System - Test Mode
      </div>

      <div style={{
        padding: "30px 50px",
        maxWidth: "100%",
        boxSizing: "border-box"
      }}>
        {/* Timer & User Info */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap"
        }}>
          <div style={{ fontSize: "16px" }}>
            <strong>Session ID:</strong> {sessionId} &nbsp;&nbsp;
            <strong>Test ID:</strong> {testId} &nbsp;&nbsp;
            <strong>Name:</strong> {name} &nbsp;&nbsp;
            <strong>Email:</strong> {email}
          </div>
          <div style={{
            fontSize: "18px",
            color: "#e74c3c",
            fontWeight: "bold"
          }}>
            ⏳ Time Left: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Main Content - Side by Side */}
        <div style={{
          display: "flex",
          gap: "30px",
          alignItems: "flex-start"
        }}>
          {/* Left: Question */}
          <div style={{
            flex: 1,
            backgroundColor: "#ecf0f1",
            padding: "20px",
            borderRadius: "10px",
            fontSize: "16px",
            lineHeight: "1.6",
            maxHeight: "500px",
            overflowY: "auto"
          }}>
            <h3 style={{ marginBottom: "10px" }}>📘 Question #{questionId}</h3>
            <div dangerouslySetInnerHTML={{ __html: formatQuestionHTML(questionText) }} />
          </div>

          {/* Right: Answer Box */}
          <div style={{ flex: 1 }}>
            <textarea
              placeholder=" Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{
                width: "100%",
                height: "500px",
                padding: "15px",
                fontSize: "16px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                resize: "vertical",
                boxSizing: "border-box",
                backgroundColor: "#f9f9f9"
              }}
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            style={{
              backgroundColor: isDisabled ? "#95a5a6" : "#3498db",
              color: "white",
              padding: "12px 30px",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              cursor: isDisabled ? "not-allowed" : "pointer"
            }}
          >
            {isDisabled ? "⏳ Time Up!" : "🚀 Submit Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartTest;
