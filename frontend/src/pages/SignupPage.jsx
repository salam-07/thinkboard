import { useState } from "react";
import { Link, useNavigate } from "react-router";

const SignupPage = () => {
    // State to manage form inputs
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
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
     * Validate form data before submission
     * Returns true if valid, false otherwise
     */
    const validateForm = () => {
        // Check if all fields are filled
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all fields");
            return false;
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }

        // Check password length
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }

        return true;
    };

    /**
     * Handle form submission
     * Sends signup request to backend API
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Validate form before submitting
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Prepare data for API (exclude confirmPassword)
            const { confirmPassword, ...signupData } = formData;

            // Send POST request to signup endpoint
            const response = await fetch("http://localhost:5001/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData),
            });

            const data = await response.json();

            if (response.ok) {
                // Signup successful
                console.log("Signup successful:", data);

                // Store the JWT token in localStorage for automatic login
                localStorage.setItem("authToken", data.token);

                // Store user data in localStorage (optional)
                localStorage.setItem("user", JSON.stringify(data.user));

                // Redirect to home page or dashboard
                navigate("/");
            } else {
                // Signup failed - show error message
                setError(data.message || "Signup failed");
            }
        } catch (error) {
            console.error("Signup error:", error);
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
                        Join ThinkBoard
                    </h2>

                    {/* Show error message if there is one */}
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

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
                                placeholder="Enter your password (min 6 characters)"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        {/* Confirm Password Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
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
                                {isLoading ? "Creating Account..." : "Sign Up"}
                            </button>
                        </div>
                    </form>

                    {/* Link to Login Page */}
                    <div className="text-center mt-4">
                        <p className="text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="link link-primary">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
