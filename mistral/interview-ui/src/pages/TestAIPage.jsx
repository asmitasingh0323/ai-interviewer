// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// export default function TestAIPage() {
//     const { testId } = useParams();   // ← read test_id from URL
//     const [question, setQuestion] = useState("Loading...");
//     const [answer, setAnswer] = useState("");
//     useEffect(() => {
//         fetch(`http://localhost:8080/api/test/get-question/${testId}`)
//             .then(res => res.json())
//             .then(data => {
//                 setQuestion(data.question);
//             })
//             .catch(err => {
//                 setQuestion("Error loading question");
//             });
//     }, [testId]);

//     return (
//         <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
//             <h1>AI Interview Test</h1>
//             <h2 style={{ textAlign: "center", marginTop: "20px" }}>
//                 {question}
//             </h2>

//             <div
//                 style={{
//                     marginTop: "20px",
//                     padding: "15px",
//                     borderRadius: "8px",
//                     background: "#eef2ff",
//                     border: "1px solid #c7d2fe"
//                 }}
//             >
//                 <strong>Test ID:</strong> {testId}
//             </div>

//             <h2 style={{ marginTop: "40px" }}>Question will appear here...</h2>

//             <textarea
//                 placeholder="Your answer goes here..."
//                 style={{
//                     width: "100%",
//                     height: "200px",
//                     marginTop: "20px",
//                     padding: "10px",
//                     fontSize: "16px"
//                 }}
//             ></textarea>

//             <button
//                 style={{
//                     marginTop: "20px",
//                     padding: "12px 25px",
//                     background: "#4338ca",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                     fontSize: "16px"
//                 }}
//             >
//                 Submit Answer
//             </button>
//         </div>
//     );
// }




import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TestAIPage() {
    const { testId } = useParams();
    const [question, setQuestion] = useState("Loading question...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`http://localhost:8080/api/get-question/${testId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.status === "pending") {
                        setQuestion("🔄 AI is generating your interview question...");
                    } else if (data.status === "ready") {
                        setQuestion(data.question);
                        setLoading(false);
                        clearInterval(interval); // stop polling once ready
                    }
                })
                .catch(() => {
                    setQuestion("❌ Error loading question.");
                });
        }, 2000); // poll every 2 sec

        return () => clearInterval(interval);
    }, [testId]);

    return (
        <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
            <h1>AI Interview Test</h1>

            <h2 style={{ textAlign: "center", marginTop: "20px" }}>
                {question}
            </h2>

            <div
                style={{
                    marginTop: "20px",
                    padding: "15px",
                    borderRadius: "8px",
                    background: "#eef2ff",
                    border: "1px solid #c7d2fe"
                }}
            >
                <strong>Test ID:</strong> {testId}
            </div>

            {!loading && (
                <>
                    <textarea
                        placeholder="Write your answer here..."
                        style={{
                            width: "100%",
                            height: "200px",
                            marginTop: "20px",
                            padding: "10px",
                            fontSize: "16px"
                        }}
                    ></textarea>

                    <button
                        style={{
                            marginTop: "20px",
                            padding: "12px 25px",
                            background: "#4338ca",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}
                    >
                        Submit Answer
                    </button>
                </>
            )}
        </div>
    );
}
