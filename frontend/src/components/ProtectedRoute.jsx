import { Navigate } from "react-router";
import { isAuthenticated } from "../lib/auth";

/**
 * ProtectedRoute component
 * Wrapper component that only renders children if user is authenticated
 * Otherwise redirects to login page
 * 
 * Usage:
 * <ProtectedRoute>
 *   <YourProtectedComponent />
 * </ProtectedRoute>
 */
const ProtectedRoute = ({ children }) => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the protected component
    return children;
};

export default ProtectedRoute;
