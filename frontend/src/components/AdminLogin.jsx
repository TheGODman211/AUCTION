import React, { useState } from "react";
import axios from "axios";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await axios.post("https://auction-backend-wug0.onrender.com/api/admin/login", {
        username,
        password,
      });
      onLogin(); // Switch to dashboard
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h3>Admin Login</h3>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default AdminLogin;
