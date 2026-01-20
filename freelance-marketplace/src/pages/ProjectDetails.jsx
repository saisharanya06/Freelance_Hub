import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  setCurrentProject,
} from "../features/projects/projectSlice";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import api from "../config/api";
// import api from "../../config/api";


const ProjectDetails = () => {
  const [completedNow, setCompletedNow] = useState(false); // ✅ MUST BE HERE
  const [refresh, setRefresh] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { projects, currentProject, status } = useSelector(
    (state) => state.projects
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  // USER (for localStorage)
  const { user } = useSelector((state) => state.auth);
const userId = user?.id || user?._id;


  // PROJECT
  const project =
    projects.find((p) => p.id === id || p._id === id) || currentProject;

  // Use API-provided isCompleted status
  const isCompletedByMe = project?.isCompleted || completedNow;

  /* ---------- FORMAT BUDGET ---------- */
  const formatBudget = (budget) => {
    if (!budget) return "0";
    return new Intl.NumberFormat("en-IN").format(budget);
  };

  /* ---------- FETCH PROJECTS ---------- */
  useEffect(() => {
    if (!projects.length) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  /* ---------- SET CURRENT PROJECT ---------- */
  useEffect(() => {
    const found = projects.find((p) => p.id === id || p._id === id);
    if (found) {
      dispatch(setCurrentProject(found));
    }
  }, [dispatch, id, projects]);

  /* ---------- MARK AS COMPLETED (FIXED) ---------- */
  const handleMarkCompleted = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to mark project as completed");
      navigate("/login");
      return;
    }

    const projectId = project.id || project._id;

    try {
      await api.patch(`/projects/${projectId}/complete`);
      setCompletedNow(true);
      setRefresh((prev) => !prev);
      toast.success("Project marked as completed 🎉");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to mark project as completed");
    }
  };


  /* ---------- NOT FOUND ---------- */
  if (!project && status !== "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="pt-24 pb-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <Link to="/projects" className="text-indigo-600 dark:text-indigo-400">
            ← Back to Projects
          </Link>
        </main>
      </div>
    );
  }

  /* ---------- LOADING ---------- */
  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <main className="pt-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    {project.title}
                    {isAuthenticated && isCompletedByMe && (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    )}
                  </h1>
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(project.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      project.status === "OPEN"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {project.status}
                  </span>

                  {isAuthenticated && isCompletedByMe && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      You Completed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Budget & Tech */}
            <div className="p-6 grid sm:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Project Budget
                </p>
                <div className="text-xl font-bold">
                  ₹{formatBudget(project.budget)}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {(project.tech_stack || []).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6">
              <h3 className="font-semibold mb-2">Project Description</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Action */}
            <AnimatePresence>
              {isAuthenticated && !isCompletedByMe && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 border-t bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h3 className="font-semibold">
                        Have you completed this project?
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mark it as completed to track your progress
                      </p>
                    </div>

                    <button
                      onClick={handleMarkCompleted}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Mark as Completed
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Completed Banner */}
            {isAuthenticated && isCompletedByMe && (
  <div className="p-6 border-t bg-green-50 dark:bg-green-900/20 border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
      <CheckCircle2 className="w-6 h-6" />
      <div>
        <p className="font-semibold">
          Completed Project! 
        </p>
        <p className="text-sm">
          {completedNow
            ? "You have just completed this project 🎉"
            : "Great work! This project is marked as completed in your profile."}
        </p>
      </div>
    </div>
  </div>
)}

          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
