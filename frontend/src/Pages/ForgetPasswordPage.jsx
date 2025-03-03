// ForgotPasswordPage.js
import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/public/auth/forgot-password", { email });
      toast.success(response.data.message || "If the email exists, a reset link has been sent.");
      // Optionally redirect the user after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error requesting password reset");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-bold mb-4">Forgot Your Password?</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="flex items-center justify-between">
            <input 
              type="submit" 
              value="Send Reset Link" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
            />
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
