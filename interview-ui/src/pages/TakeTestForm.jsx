import BackButton from "./BackButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TakeTestForm() {
  const navigate = useNavigate(); // <-- add this

  const [form, setForm] = useState({
    testId: "",
    name: "",
    email: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTakeTest = () => {
    axios.post("http://localhost:8080/api/create_session", form)
      .then(res => {
        const sessionData = res.data;
        navigate("/starttest", { state: sessionData });
      })
      .catch(err => alert("❌ Error: " + (err.response?.data || err.message)));
  };

  return (
    <div style={{ padding: "20px" }}>
      <BackButton />
      <h2>🧪 Take a Test (Enter Details)</h2>
      <input name="testId" placeholder="Test ID" onChange={handleChange} /><br /><br />
      <input name="name" placeholder="Name" onChange={handleChange} /><br /><br />
      <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
      <button onClick={handleTakeTest}>Take Test</button>
    </div>
  );
}

export default TakeTestForm;
