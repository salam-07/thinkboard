import { useState } from "react";
import { Link, useNavigate } from "react-router";

const LoginPage = () => {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // State to manage loading state and error messages
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Hook to navigate between pages programmatically
    const navigate = useNavigate();

    /**
     * Handle input changes in the form
     * Updates the corresponding field in formData state
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError("");
    };

    /**
     * Handle form submission
     * Sends login request to backend API
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Basic validation
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Send POST request to login endpoint
            const response = await fetch("http://localhost:5001/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                console.log("Login successful:", data);

                // Store the JWT token in localStorage for future requests
                localStorage.setItem("authToken", data.token);

                // Store user data in localStorage (optional)
                localStorage.setItem("user", JSON.stringify(data.user));

                // Redirect to home page or dashboard
                navigate("/");
            } else {
                // Login failed - show error message
                setError(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-center mb-6">
                        Login to ThinkBoard
                    </h2>

                    {/* Show error message if there is one */}
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary ${isLoading ? "loading" : ""}`}
                                disabled={isLoading}
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </form>

                    {/* Link to Signup Page */}
                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Don't have an account?{" "}
                            <Link to="/signup" className="link link-primary">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
