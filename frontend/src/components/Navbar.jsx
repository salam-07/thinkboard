import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { getCurrentUser, isAuthenticated, logout } from "../lib/auth";

const Navbar = () => {
    const isLoggedIn = isAuthenticated();
    const user = getCurrentUser();

    /**
     * Handle logout button click
     */
    const handleLogout = () => {
        logout(); // This will clear localStorage and redirect to login
    };

    return (
        <header className="bg-base-300 border-b border-base-content/10">
            <div className="mx-auto max-w-6xl p-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-3xl font-bold font-mono text-primary tracking-tight">
                        ThinkBoard
                    </Link>
                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            // User is logged in - show create button and user menu
                            <>
                                <Link to={"/create"} className="btn btn-primary">
                                    <PlusIcon className="size-5" />
                                    <span>New Note</span>
                                </Link>

                                {/* User dropdown menu */}
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                                            {user?.name?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    </label>
                                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                        <li className="disabled">
                                            <span className="font-semibold">{user?.name}</span>
                                        </li>
                                        <li className="disabled">
                                            <span className="text-sm opacity-70">{user?.email}</span>
                                        </li>
                                        <li><hr className="my-1" /></li>
                                        <li>
                                            <button onClick={handleLogout} className="text-error">
                                                Logout
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            // User is not logged in - show login/signup buttons
                            <div className="space-x-2">
                                <Link to="/login" className="btn btn-ghost">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;