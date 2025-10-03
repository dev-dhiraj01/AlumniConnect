import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import "./App.css";
import AuthPage from "./components/AuthPage";
import AdminDashboard from "./components/AdminDashboard";
import AlumniDashboard from "./components/AlumniDashboard";
import Homepage from "./Homepage";
import LandingPage from "./components/LandingPage";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

// Axios interceptor for auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<Homepage />} /> */}
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={
              (console.log("Auth route, user:", user),
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/alumni" />
                )
              ) : (
                <AuthPage onLogin={login} />
              ))
            }
          />
          <Route
            path="/admin/*"
            element={
              user && user.role === "admin" ? (
                <AdminDashboard user={user} onLogout={logout} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/alumni/*"
            element={
              user && user.role === "alumni" ? (
                <AlumniDashboard user={user} onLogout={logout} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/alumni" />
                )
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
