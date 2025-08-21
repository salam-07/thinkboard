/**
 * Authentication utilities for the frontend
 * These functions help manage user authentication state
 */

/**
 * Get the authentication token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export const getAuthToken = () => {
    return localStorage.getItem("authToken");
};

/**
 * Get the current user data from localStorage
 * @returns {object|null} - User object or null if not found
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    }
    return null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} - true if user has a valid token
 */
export const isAuthenticated = () => {
    const token = getAuthToken();
    const user = getCurrentUser();
    return !!(token && user);
};

/**
 * Log out the user by removing token and user data
 */
export const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Optionally redirect to login page
    window.location.href = "/login";
};

/**
 * Make an authenticated API request
 * Automatically includes the JWT token in the Authorization header
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - Fetch promise
 */
export const authenticatedFetch = async (url, options = {}) => {
    const token = getAuthToken();

    // Set up default headers
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // If response is 401 (Unauthorized), token might be expired
    if (response.status === 401) {
        logout(); // Automatically log out user
        throw new Error("Session expired. Please log in again.");
    }

    return response;
};
