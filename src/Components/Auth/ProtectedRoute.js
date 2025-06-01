import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
    const userRole = localStorage.getItem("userRole"); // Changed to match your existing storage key
    
    if (!userRole) {
        // If not logged in, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    return allowedRoles.includes(userRole) ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace />
    );
};

export default ProtectedRoute;