import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseURL from "../../url";// Adjust the import according to your project structure

const ConfirmAccountPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios
        .get(`${baseURL}/public/auth/confirm?token=${token}`)
        .then((response) => {
          setMessage(response.data);
          toast.success(response.data);
          // Redirect to login after a short delay
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        })
        .catch((error) => {
          const errorMsg =
            error.response?.data || "Confirmation failed. Please try again.";
          setMessage(errorMsg);
          toast.error(errorMsg);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setMessage("Invalid confirmation link.");
      setLoading(false);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-bold mb-4">Account Confirmation</h2>
          <p>{message}</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ConfirmAccountPage;
