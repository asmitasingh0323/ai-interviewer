// import { useNavigate } from "react-router-dom";

// function HomeButton() {
//     const navigate = useNavigate();

//     return (
//         <button
//             onClick={() => navigate("/")}
//             style={{
//                 position: "absolute",
//                 top: "20px",
//                 left: "20px",
//                 background: "#2ecc71",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "8px",
//                 padding: "10px 16px",
//                 fontSize: "14px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//                 zIndex: 1000,
//             }}
//         >
//             🏠 Home
//         </button>
//     );
// }

// export default HomeButton;

import { useNavigate } from "react-router-dom";
import homeImg from "../assets/AI_Interviewer.png";

function HomeButton() {
    const navigate = useNavigate();

    return (
        <img
            src={homeImg}
            alt="Go Home"
            onClick={() => navigate("/")}
            style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                width: "42px",          // adjust if needed
                height: "42px",
                cursor: "pointer",
                zIndex: 1000,
            }}
        />
    );
}

export default HomeButton;
