import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Submit from "./pages/Submit";
import GenerateTest from "./pages/GenerateTest";
import TakeTestForm from "./pages/TakeTestForm";
import StartTest from "./pages/StartTest";
import Result from "./pages/Result";
import ResultPage from "./pages/ResultPage";
import Questions from "./pages/Questions"; 
import AddQuestion from "./pages/AddQuestion"; // ✅ Don't forget to import this too!
import UserInterviews from "./pages/UserInterviews";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> {/* ✅ Landing page */}
        <Route path="/submit" element={<Submit />} />
        <Route path="/generate" element={<GenerateTest />} />
        <Route path="/taketestform" element={<TakeTestForm />} />
        <Route path="/starttest" element={<StartTest />} />
        <Route path="/result" element={<Result />} />
        <Route path="/resultpage" element={<ResultPage />} />
        <Route path="/questions" element={<Questions />} /> {/* ✅ Show Questions */}
        <Route path="/add-question" element={<AddQuestion />} /> {/* ✅ Add Question */}
        <Route path="/user-interviews" element={<UserInterviews />} />
      </Routes>
    </Router>
  );
}

export default App;
