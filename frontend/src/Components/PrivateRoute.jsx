import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ allowedRoles, children }) => {
  // Get the user's role and token from Redux state.
  const { role, token } = useSelector((state) => state.auth);

  // If there is no token or the user's role is not allowed, redirect to login.
  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the child component.
  return children;
};

export default PrivateRoute;
