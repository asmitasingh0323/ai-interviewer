// import BackButton from "./BackButton";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function TakeTestForm() {
//   const navigate = useNavigate(); // <-- add this

//   const [form, setForm] = useState({
//     testId: "",
//     name: "",
//     email: ""
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleTakeTest = () => {
//     axios.post("http://localhost:8080/api/create_session", form)
//       .then(res => {
//         const sessionData = res.data;
//         navigate("/starttest", { state: sessionData });
//       })
//       .catch(err => alert("❌ Error: " + (err.response?.data || err.message)));
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <BackButton />
//       <h2>🧪 Take a Test (Enter Details)</h2>
//       <input name="testId" placeholder="Test ID" onChange={handleChange} /><br /><br />
//       <input name="name" placeholder="Name" onChange={handleChange} /><br /><br />
//       <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />
//       <button onClick={handleTakeTest}>Take Test</button>
//     </div>
//   );
// }

// export default TakeTestForm;

import BackButton from "./BackButton";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import HomeButton from "./HomeButton";

function TakeTestForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    testId: "",
    name: "",
    email: ""
  });

  // ⭐ IF the page comes from JD flow → auto-fill test ID
  useEffect(() => {
    const tid = searchParams.get("testId");
    if (tid) {
      setForm((prev) => ({ ...prev, testId: tid }));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTakeTest = () => {
    axios.post("http://localhost:8080/api/create_session", form)
      .then(res => {
        navigate("/starttest", { state: res.data });
      })
      .catch(err => alert("❌ Error: " + (err.response?.data || err.message)));
  };

  // const handleTakeTest = async () => {
  //   try {
  //     // 1) Create session
  //     const sessionRes = await axios.post(
  //       "http://localhost:8080/api/create_session",
  //       form
  //     );

  //     const session = sessionRes.data;

  //     // 2) Fetch full question details for this test
  //     const qRes = await axios.get(
  //       `http://localhost:8080/api/tests/${session.testId}`
  //     );

  //     const question = qRes.data;

  //     // 3) Navigate with ALL required fields
  //     navigate("/starttest", {
  //       state: {
  //         sessionId: session.sessionId,
  //         testId: session.testId,
  //         questionId: question.questionId,
  //         questionText: question.problem,          // ONLY PROBLEM TEXT
  //         constraintsJson: question.constraints,   // JSON string
  //         examplesJson: question.examples,         // JSON string
  //         name: form.name,
  //         email: form.email
  //       }
  //     });
  //   } catch (err) {
  //     alert("❌ Error: " + (err.response?.data || err.message));
  //   }
  // };


  return (
    <div style={{ padding: "20px" }}>
      <HomeButton />
      <BackButton />
      <h2>🧪 Take a Test (Enter Details)</h2>

      {/* Test Id input — remains editable */}
      <input
        name="testId"
        placeholder="Test ID"
        value={form.testId}
        onChange={handleChange}
      /><br /><br />

      <input name="name" placeholder="Name" onChange={handleChange} /><br /><br />
      <input name="email" placeholder="Email" onChange={handleChange} /><br /><br />

      <button onClick={handleTakeTest}>Take Test</button>
    </div>
  );
}

export default TakeTestForm;
