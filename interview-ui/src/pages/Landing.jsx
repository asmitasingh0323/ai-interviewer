import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const goToGenerateTest = () => {
    navigate("/generate");
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
    </div>
  );
}

export default Landing;
