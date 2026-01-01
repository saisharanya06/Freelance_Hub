import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Menu,
  X,
  LogIn,
  Moon,
  Sun,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import toast from "react-hot-toast";

export default function Navbar({ theme, setTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
            FreelanceHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/projects"
            className={`px-3 py-2 rounded-lg text-sm transition ${
              isActive("/projects")
                ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            Projects
          </Link>

          {isAuthenticated && (
            <Link
              to="/post"
              className={`px-3 py-2 rounded-lg text-sm transition ${
                isActive("/post")
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Plus className="inline w-4 h-4 mr-1" />
              Post Project
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-yellow-400" />
            )}
          </button>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {user?.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 dark:text-gray-300"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-3 transition-colors duration-300">
          <Link
            to="/projects"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 dark:text-gray-300"
          >
            Projects
          </Link>

          {isAuthenticated && (
            <Link
              to="/post"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 dark:text-gray-300"
            >
              Post Project
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            {theme === "light" ? <Moon /> : <Sun />}
            Toggle Theme
          </button>

          {!isAuthenticated ? (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-indigo-600 dark:text-indigo-400 font-medium"
            >
              Sign In
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="block text-red-600"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
