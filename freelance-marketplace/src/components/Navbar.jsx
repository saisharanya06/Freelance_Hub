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
import { resetProjectsState } from "../features/projects/projectSlice";
import toast from "react-hot-toast";

export default function Navbar({ theme, setTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  /* ---------- THEME TOGGLE ---------- */
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  /* ---------- LOGOUT (FINAL FIX) ---------- */
  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(resetProjectsState()); // ✅ CLEAR PROJECT CACHE

    toast.success("Logged out");
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
            FreelanceHub
          </span>
        </Link>

        {/* DESKTOP NAV */}
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

          {/* 🌙☀ THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <>
                {/* 🌙 DARK MODE */}
                <Moon className="w-5 h-5 text-indigo-400" />
              </>
            ) : (
              <>
                {/* ☀ LIGHT MODE */}
                <Sun className="w-5 h-5 text-yellow-500" />
              </>
            )}
          </button>

          {/* AUTH */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {user?.name}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 z-50">
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 dark:text-gray-300"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-4 space-y-4">
          {isAuthenticated && (
            <div>
              <button
                onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
                className="w-full flex items-center justify-between text-gray-800 dark:text-gray-100 font-medium"
              >
                <span>Profile</span>
                <span>{mobileProfileOpen ? "▾" : "▸"}</span>
              </button>

              {mobileProfileOpen && (
                <div className="mt-2 pl-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-500">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          )}

          <Link to="/projects" onClick={() => setIsOpen(false)}>
            Projects
          </Link>

          {isAuthenticated && (
            <Link to="/post" onClick={() => setIsOpen(false)}>
              Post Project
            </Link>
          )}

          {/* 🌙☀ MOBILE THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            {theme === "dark" ? <Moon /> : <Sun />}
            Toggle Theme
          </button>

          {!isAuthenticated ? (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              Sign In
            </Link>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="text-red-600 font-medium"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
