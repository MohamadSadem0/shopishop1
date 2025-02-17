import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/logoutUser"; // Adjust the import path if needed

const TokenChecker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // If there's no token, nothing to validate.
    if (!token) return;

    const validateToken = async () => {
      try {
        const response = await axiosInstance.get("/public/auth/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200 && response.data) {
          const { role } = response.data;
          if (role && role !== "GUEST") {
            // Navigate based on the user's role.
            switch (role) {
              case "SUPERADMIN":
                // navigate("/superadmin-dashboard");
                break;
              case "MERCHANT":
                // navigate("/dashboard");
                break;
              case "CUSTOMER":
                // navigate("/profile");
                break;
              default:
                break;
            }
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.warn("Token expired or invalid. Logging out the user.");
          dispatch(logoutUser());
          navigate("/login");
        } else {
          console.error("Error during token validation:", error);
        }
      }
    };

    validateToken();
  }, [token, navigate, dispatch]);

  return null;
};

export default TokenChecker;
