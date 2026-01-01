import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  IndianRupee,
  Clock,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  markAsCompleted,
  setCurrentProject,
} from "../features/projects/projectSlice";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { format } from "date-fns";

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { projects, currentProject, status } = useSelector(
    (state) => state.projects
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const project =
    currentProject ||
    projects.find((p) => p.id === id || p._id === id);

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

  /* ---------- MARK AS COMPLETED (AUTH CHECK) ---------- */
  const handleMarkCompleted = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to mark project as completed");
      navigate("/login");
      return;
    }

    try {
      await dispatch(markAsCompleted(project.id)).unwrap();
      toast.success("Project marked as completed 🎉");
    } catch {
      toast.error("Failed to update project status");
    }
  };

  const formatBudget = (budget) =>
    new Intl.NumberFormat("en-IN").format(budget);

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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
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
            className="
              rounded-xl border overflow-hidden
              bg-white dark:bg-gray-800
              border-gray-200 dark:border-gray-700
              transition-colors duration-300
            "
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {project.title}
                  </h1>
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(project.created_at), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(project.created_at), "h:mm a")}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    project.status === "OPEN"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>

            {/* Budget & Tech */}
            <div className="p-6 grid sm:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Project Budget
                </p>
                <div className="flex items-center gap-2 text-xl font-bold">
                  <IndianRupee className="w-5 h-5" />
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
                      className="
                        px-3 py-1 rounded-full text-sm
                        bg-indigo-100 dark:bg-indigo-900
                        text-indigo-700 dark:text-indigo-300
                      "
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
              {project.status === "OPEN" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 border-t bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h3 className="font-semibold">
                        Ready to close this project?
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mark as completed when the work is done
                      </p>
                    </div>

                    <button
                      onClick={handleMarkCompleted}
                      disabled={status === "loading"}
                      className="
                        flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                        bg-indigo-600 text-white hover:bg-indigo-700
                        transition
                      "
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Mark as Completed
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Completed Banner */}
            {project.status === "COMPLETED" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 border-t bg-green-50 dark:bg-green-900/20 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Project Completed</p>
                    <p className="text-sm">
                      This project has been successfully completed
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
