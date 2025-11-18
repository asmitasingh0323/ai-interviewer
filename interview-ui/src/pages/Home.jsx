import BackButton from "./BackButton";
import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/questions")
      .then(res => setQuestions(res.data))
      .catch(err => console.error("Failed to fetch:", err));
  }, []);

  return (
    <div>
      <BackButton />
      <h1>Available Questions</h1>
      <ul>
        {questions.map(q => (
          <li key={q.questionId}>
            <strong>{q.topic}:</strong> {q.questionText}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;

// import { useEffect, useState } from "react";
// import axios from "axios";

// function Home() {
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:8080/api/questions")
//       .then(res => setQuestions(res.data))
//       .catch(err => console.error("❌ Failed to load questions:", err));
//   }, []);

//   return (
//     <div style={{ padding: "40px" }}>
//       <h1 style={{ fontSize: "32px", marginBottom: "20px", color: "#2c3e50" }}>
//         📚 Available Questions
//       </h1>

//       {questions.length === 0 ? (
//         <p style={{ fontSize: "18px" }}>Loading questions...</p>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "16px" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f0f0f0", textAlign: "left" }}>
//               <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>#</th>
//               <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Question</th>
//               <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Topic</th>
//               <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Difficulty</th>
//             </tr>
//           </thead>
//           <tbody>
//             {questions.map((q, idx) => (
//               <tr key={q.question_id}>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{idx + 1}</td>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{q.question_text}</td>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{q.topic}</td>
//                 <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{q.difficulty_level}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default Home;
