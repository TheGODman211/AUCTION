// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
//
// const EmailVerification = ({ onVerified }) => {
//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState("");
//   const [step, setStep] = useState(1);
//   const navigate = useNavigate();
//
//   const sendOtp = async () => {
//     try {
//       await axios.post("https://auction-backend-wug0.onrender.com/api/send-otp", { email });
//       setStep(2);
//     } catch (err) {
//       alert("Only @oldmutual.com.gh emails allowed");
//     }
//   };
//
//   const verifyOtp = async () => {
//     try {
//       await axios.post("https://auction-backend-wug0.onrender.com/api/verify-otp", { email, code });
//       onVerified(email);
//     } catch (err) {
//       alert("Invalid OTP");
//     }
//   };
//    const goToAdminLogin = () => {
//     navigate("/admin-login");
//   };
//
//   return (
//     <div>
//       {step === 1 ? (
//         <div>
//           <h3>Enter your Old Mutual email</h3>
//           <input value={email} onChange={(e) => setEmail(e.target.value)} />
//           <button onClick={sendOtp}>Send OTP</button>
//         </div>
//       ) : (
//         <div>
//           <h3>Enter OTP sent to your email</h3>
//           <input value={code} onChange={(e) => setCode(e.target.value)} />
//           <button onClick={verifyOtp}>Verify</button>
//         </div>
//       )}
//
//       <hr />
//       <button onClick={() => navigate("/admin-login")}>Admin Login</button>
//     </div>
//   );
// };
//
// export default EmailVerification;


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmailVerification = ({ onVerified }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await axios.post("https://auction-backend-wug0.onrender.com/api/send-otp", { email });
      setStep(2);
    } catch (err) {
      alert("Only @oldmutual.com.gh emails allowed");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post("https://auction-backend-wug0.onrender.com/api/verify-otp", { email, code });
      onVerified(email);
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
      {step === 1 ? (
        <div>
          <h3>Enter your Old Mutual email</h3>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      ) : (
        <div>
          <h3>Enter OTP sent to your email</h3>
          <input value={code} onChange={(e) => setCode(e.target.value)} />
          <button onClick={verifyOtp}>Verify</button>
        </div>
      )}
      <hr />
      <button onClick={() => navigate("/admin-login")}>Admin Login</button>
    </div>
  );
};

export default EmailVerification;
