// ResetPasswordPage.js
import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useQuery = () => new URLSearchParams(useLocation().search);

// Helper function to validate the new password
const isPasswordValid = (password) => {
  const minLength = 6;
  const hasMinLength = password.length >= minLength;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  return hasMinLength && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
};

const ResetPasswordPage = () => {
  const query = useQuery();
  const token = query.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Check if token is valid on mount
  useEffect(() => {
    if (!token) {
      toast.error("No token provided");
      navigate("/forget-password");
      return;
    }
    // Call your backend endpoint to verify the token
    axiosInstance
      .get(`/public/auth/verify-reset-token?token=${token}`)
      .then((res) => {
        // Token is valid; you can optionally show a success message
        // toast.success("Token verified. Please enter your new password.");
      })
      .catch((err) => {
        toast.error("Invalid or expired token");
        navigate("/forget-password");
      });
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!isPasswordValid(newPassword)) {
      toast.error(
        "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)."
      );
      return;
    }

    try {
      const response = await axiosInstance.post("/public/auth/reset-password", { token, newPassword });
      toast.success(response.data.message || "Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
              New Password
            </label>
            <input 
              type="password" 
              id="newPassword" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)}
              required 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            />
          </div>
          <div className="flex items-center justify-between">
            <input 
              type="submit" 
              value="Reset Password" 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
            />
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
