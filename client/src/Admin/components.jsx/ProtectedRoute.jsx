import React from "react";
import { Navigate } from "react-router-dom";
import { selectAdminToken } from "../../store/slices/authSlice";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  // const token = localStorage.getItem("adminToken");
  const adminToken = useSelector(selectAdminToken);

  if (!adminToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
