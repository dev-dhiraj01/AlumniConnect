import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, User, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "alumni",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await axios.post(`${API_BASE}${endpoint}`, formData);

      onLogin(response.data.access_token, response.data.user);
    } catch (error) {
      console.error("Authentication error:", error);

      const message =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Authentication failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: "#fcf6f6" }}>
      {/* <Link
        to="/"
        className="text-red-600 hover:text-red-800 mb-4 font-medium"
      >
        ← Home
      </Link> */}
      <div className="flex items-center justify-end ">
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-4 mb-0 mt-3"
        >
          Home
        </button>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-12 -mt-10">
        <div className="max-w-md w-full">
          <div className="glass p-8 slide-in ">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                AlumniSphere
              </h2>
              <p className="text-gray-600">
                {isLogin ? "Welcome back!" : "Join our alumni community"}
              </p>
            </div>

            {error && <div className="alert-error fade-in">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="form-label">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="form-label">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="form-label">
                    <User className="w-4 h-4 inline mr-2" />
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="alumni">Alumni</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center "
              >
                {loading ? (
                  <div className="loading-spinner "></div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
