import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import HomeButton from "./HomeButton";


function Landing() {
  const navigate = useNavigate();

  const goToGenerateTest = () => {
    navigate("/generate");
  };

  const btnStyle = {
    padding: "12px 24px",
    margin: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
  };

  const goToTakeTest = () => {
    navigate("/taketestform");
  };

  const buttonStyle = {
    margin: "10px",
    padding: "10px 20px"
  };

  return (

    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <HomeButton />
      <h1> AI Interview System</h1>

      <button onClick={goToGenerateTest} style={buttonStyle}>
        Generate Test
      </button>

      <button onClick={goToTakeTest} style={buttonStyle}>
        Take Test
      </button>

      <button onClick={() => navigate("/questions")} style={buttonStyle}>
        View Questions
      </button>

      <button onClick={() => navigate("/add-question")} style={buttonStyle}>
        Add Question
      </button>

      <Link to="/user-interviews">
        <button style={buttonStyle}>View Interviews</button>
      </Link>

      <button
        onClick={() => navigate("/jd-interview")}
        style={{
          padding: "12px 24px",
          margin: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#f0f0f0",
          cursor: "pointer",
        }}
      >
        🧾 JD Interview
      </button>

    </div>
  );
}

export default Landing;
