import axios from "axios";
import { getAuthToken } from "./auth";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
    baseURL: BASE_URL
});

// Add a request interceptor to include authentication token
api.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = getAuthToken();

        // If token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If we get a 401 (Unauthorized) response, the token is invalid
        if (error.response && error.response.status === 401) {
            // Clear the authentication data
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");

            // Redirect to login page
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;