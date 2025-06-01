import { useState } from "react";
import axios from "axios";

const RegisterAdmin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("https://auction-backend-wug0.onrender.com/api/admin/register", {
        username,
        password
      });
      setMsg("✅ Admin registered!");
    } catch (err) {
      setMsg("❌ " + (err.response?.data || "Error"));
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Register Admin</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={handleRegister}>Register</button>
      <p>{msg}</p>
    </div>
  );
};

export default RegisterAdmin;
