import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';

import EmailVerification from "./components/EmailVerification.jsx";
import LiveAuction from "./components/LiveAuction.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import RegisterAdmin from "./components/RegisterAdmin.jsx"; // ✅ make sure the path and name match

const App = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // useEffect(() => {
  //   axios
  //     .get("https://auction-backend-wug0.onrender.com/api/admin/status", {
  //       withCredentials: true,
  //     })
  //     .then((res) => setIsAdmin(res.data.isAdmin))
  //     .catch(() => setIsAdmin(false))
  //     .finally(() => setCheckingStatus(false));
  // }, []);

  useEffect(() => {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    setIsAdmin(false);
    setCheckingStatus(false);
    return;
  }

  axios
    .get("https://auction-backend-wug0.onrender.com/api/admin/status", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setIsAdmin(res.data.isAdmin))
    .catch(() => setIsAdmin(false))
    .finally(() => setCheckingStatus(false));
}, []);


  if (checkingStatus) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            userEmail ? (
              <LiveAuction userEmail={userEmail} />
            ) : (
              <EmailVerification onVerified={setUserEmail} />
            )
          }
        />
        <Route
          path="/admin-login"
          element={
            isAdmin ? <Navigate to="/admin" /> : <AdminLogin onLogin={() => setIsAdmin(true)} />
          }
        />
        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin-login" />}
        />
        <Route
          path="/admin-register"
          element={<RegisterAdmin />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
