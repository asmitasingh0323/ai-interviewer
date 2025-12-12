// JDInterviewSetup.jsx
import { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { useNavigate } from "react-router-dom";
import HomeButton from "./HomeButton";
function JDInterviewSetup() {
    const [jdText, setJdText] = useState("");
    const [skills, setSkills] = useState([]);
    const [loadingSkills, setLoadingSkills] = useState(false);
    const [validation, setValidation] = useState(null); // {isSoftwareJD, reason, ...}
    const [validating, setValidating] = useState(false);
    const [difficulty, setDifficulty] = useState("Mid-level");
    const [testId, setTestId] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!jdText.trim()) {
            alert("Please paste a Job Description first.");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/jd/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jd: jdText,
                    difficulty: difficulty
                }),
            });

            const data = await res.json();

            console.log("AI Response:", data);

            alert("Received mock response! Check console.");

            // Later: navigate to interview rounds
            // navigate("/jd-interview/rounds", { state: data });

        } catch (err) {
            console.error("Error:", err);
            alert("Something went wrong contacting backend.");
        }
    };


    const handleGenerateInterview = async () => {
        if (!jd.trim()) {
            alert("Please paste the job description before continuing.");
            return;
        }

        const payload = {
            jobTitle,
            difficulty,
            jd,
        };

        try {
            const response = await fetch("http://localhost:8080/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log("AI Response:", data);
            alert("Received mock response! Check console.");
            // Navigate to the Start Test page with question list
            // navigate("/start-test", {
            //     state: { questions: data.questions }
            // });

        } catch (error) {
            console.error(error);
            alert("Failed to generate interview from JD.");
        }
    };
    // Debounce timer
    useEffect(() => {
        if (!jdText.trim()) {
            setSkills([]);
            return;
        }

        const timer = setTimeout(() => {
            extractSkills(jdText);
            validateJD(jdText);
        }, 800);

        return () => clearTimeout(timer);
    }, [jdText]);

    const extractSkills = async (jd) => {
        setLoadingSkills(true);

        try {
            const res = await fetch("http://localhost:8080/api/jd/extract-skills", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jd }),
            });

            const data = await res.json();
            setSkills(data.skills || []);

        } catch (err) {
            console.error("Skill extraction failed", err);
        }

        setLoadingSkills(false);
    };

    const validateJD = async () => {
        setValidating(true);

        // Step 1: send JD for validation
        const res = await fetch("http://localhost:8080/api/jd/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jd: jdText }),
        });

        const data = await res.json();
        const id = data.correlationId;

        // Step 2: poll every 1 second
        const interval = setInterval(async () => {
            const r = await fetch(`http://localhost:8080/api/jd/validate-result/${id}`);
            const result = await r.json();

            if (result.status !== "pending") {
                clearInterval(interval);
                console.log("FINAL VALIDATION RESULT:", result);

                setValidation(result);

                setValidating(false);
            }
        }, 1000);
    };

    const handleCreateTest = async () => {
        const response = await fetch("http://localhost:8080/api/jd/create-test", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jd: jdText }),   // jdText = your JD textarea value
        });

        const data = await response.json();
        // setTestId(data.test_id);
        // navigate(`/test/${data.test_id}`);
        navigate(`/taketestform?testId=${data.test_id}`);
    };


    const pollResult = async (id) => {
        const res = await fetch(`http://localhost:8080/api/jd/validate-result/${id}`);
        const data = await res.json();
        if (data.status === "pending") return null;
        return data;
    };
    return (
        <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
            <BackButton />
            <HomeButton />
            <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
                JD-Based Interview Setup
            </h1>

            <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>
                Paste a <b>Software Developer / Software Engineer</b> job description.
                We’ll extract skills and generate an interview based on JD.
            </p>

            {/* Difficulty Dropdown */}
            <label><b>Experience Level</b></label>
            <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
            >
                <option>Junior</option>
                <option>Mid-level</option>
                <option>Senior</option>
            </select>

            {/* JD Text Area */}
            <label><b>Job Description (Software Engineering only)</b></label>
            <textarea
                rows="12"
                placeholder="Paste Software Developer / Software Engineer JD here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #bbb",
                    marginBottom: "20px"
                }}
            />
            {/* Validation Banner — INSERT THIS EXACTLY HERE */}
            {validating && <p>🔍 Checking JD validity...</p>}

            {validation && (
                <div
                    style={{
                        marginBottom: "20px",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: validation.is_valid ? "#e8f5e9" : "#ffebee",
                        color: validation.is_valid ? "#1b5e20" : "#b71c1c",
                        border: "1px solid",
                        borderColor: validation.is_valid ? "#81c784" : "#ef9a9a",
                        fontSize: "15px"
                    }}
                >
                    {validation.is_valid
                        ? `✅ This is a Software Engineer Job Description.`
                        : `❌ This is NOT a Software Engineer JD. Reason: ${validation.reason}`}
                </div>
            )}

            {validation && validation.is_valid && (
                <button
                    onClick={handleCreateTest}
                    style={{
                        marginTop: "10px",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                        backgroundColor: "#1976d2",
                        color: "white",
                        fontWeight: "500"
                    }}
                    disabled={validating}
                >
                    🎯 Start AI Interview
                </button>
            )
            }
            {testId && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "12px",
                        backgroundColor: "#eef4ff",
                        border: "1px solid #bcd0ff",
                        borderRadius: "8px",
                        fontSize: "16px",
                        color: "#1d3b8b",
                        textAlign: "center",
                        width: "fit-content",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                >
                    <strong>🆔 Test ID:</strong> {testId}
                </div>
            )}


            {/* Skills Section */}
            <h3>Extracted Skills</h3>

            {loadingSkills && <p>⏳ Extracting skills...</p>}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {skills.map((skill, idx) => (
                    <span
                        key={idx}
                        style={{
                            backgroundColor: "#85a920ff",
                            padding: "8px 14px",
                            borderRadius: "20px",
                            fontSize: "14px",
                            border: "1px solid #90caf9",
                            color: "#28313eff",
                        }}
                    >
                        {skill}
                    </span>
                ))}
            </div>

            {/* Button
            <button
                onClick={handleGenerateInterview}
                style={{
                    width: "100%",
                    padding: "14px",
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "8px",
                    fontSize: "16px"
                }}
            >
                🚀 Generate Interview From JD
            </button>*/}
        </div >
    );
}
export default JDInterviewSetup;
