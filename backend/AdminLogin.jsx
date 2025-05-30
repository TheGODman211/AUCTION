import React, { useState } from "react";
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        ',
        { username, password },
        { withCredentials: true }
      );
      setStatus("Login successful!");
      // Redirect to admin dashboard
      window.location.href = "/admin";
    } catch (err) {
      setStatus("Login failed: " + err.response?.data || "Server error");
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default AdminLogin;
