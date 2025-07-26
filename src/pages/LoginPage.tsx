"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sessionManager } from "../utils/sessionManager";
import { Eye, EyeOff } from "lucide-react";
import { BASE_URL } from "../lib/config";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
user_id: "",    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  // Captcha state
  const [captcha, setCaptcha] = useState({
    num1: 0,
    num2: 0,
    answer: "",
  });

  // Generate captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Generate random numbers for captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: "" });
  };

  // Reset form
  const resetForm = () => {
    setFormData({ school_id: "", password: "" });
    generateCaptcha();
  };

  // Validate captcha answer
  const validateCaptcha = () => {
    return Number.parseInt(captcha.answer) === captcha.num1 + captcha.num2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate captcha before proceeding
    if (!validateCaptcha()) {
      toast.error("Incorrect captcha answer. Please try again.");
      generateCaptcha();
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}api/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === "success") {
        sessionManager.setSession({
          ...data.user,
          isAuthenticated: true,
        });
        toast.success("Login successful!");
        resetForm();
        navigate("/admin");
      } else {
        toast.error(data.message);
        generateCaptcha();
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error(error);
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/bg-signup.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md z-10 backdrop-filter backdrop-blur-sm bg-opacity-90">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="school_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
               ID
            </label>
            <input
              id="school_id"
              type="text"
              value={formData.school_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d542b] focus:border-[#0d542b] transition-colors"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d542b] focus:border-[#0d542b] transition-colors pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="captcha"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Security Check: What is {captcha.num1} + {captcha.num2}?
            </label>
            <input
              id="captcha"
              type="text"
              value={captcha.answer}
              onChange={(e) =>
                setCaptcha({ ...captcha, answer: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d542b] focus:border-[#0d542b] transition-colors"
              required
              placeholder="Enter the sum"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d542b] hover:bg-[#0a4322] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d542b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Secure login portal for administrators only</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
