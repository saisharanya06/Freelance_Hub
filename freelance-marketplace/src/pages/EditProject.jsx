import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Plus,
  X,
  Loader2,
  Check,
  IndianRupee,
  FileText,
  Code2,
  ArrowLeft,
} from "lucide-react";
import { updateProject, fetchProjects } from "../features/projects/projectSlice";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const SUGGESTED_TECHS = [
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "MongoDB",
  "PostgreSQL",
  "TailwindCSS",
  "FastAPI",
  "Django",
  "Next.js",
  "Docker",
];

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { projects, status } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const project = projects.find((p) => p.id === id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const [techStack, setTechStack] = useState([]);
  const [customTech, setCustomTech] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load project data on mount
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        budget: project.budget,
      });
      setTechStack(project.tech_stack || []);

      // Check ownership
      if (project.created_by !== user?.id && project.created_by !== user?._id) {
        toast.error("You can only edit your own projects");
        navigate("/projects");
      }
    } else if (status !== "loading") {
      toast.error("Project not found");
      navigate("/projects");
    }
  }, [project, user, navigate, status]);

  // Fetch projects if not loaded
  useEffect(() => {
    if (!projects.length) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = "Title required";
    if (!formData.description.trim()) err.description = "Description required";
    if (!formData.budget || parseInt(formData.budget) <= 0) err.budget = "Valid budget required";
    if (techStack.length === 0) err.tech = "Select at least one tech";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      budget: parseInt(formData.budget),
      tech_stack: techStack,
    };

    try {
      await dispatch(updateProject({ projectId: id, data: payload })).unwrap();
      toast.success("Project updated successfully!");
      navigate(`/projects/${id}`);
    } catch (err) {
      toast.error(err || "Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const addTech = (tech) => {
    if (!techStack.includes(tech)) {
      setTechStack([...techStack, tech]);
    }
  };

  const addCustomTech = () => {
    if (customTech.trim() && !techStack.includes(customTech)) {
      setTechStack([...techStack, customTech]);
      setCustomTech("");
    }
  };

  const removeTech = (tech) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  if (status === "loading" && !project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <main className="pt-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <main className="pt-24 text-center">
          <p className="text-gray-600 dark:text-gray-400">Project not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="inline-flex items-center gap-2 mb-6 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </button>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Edit Project</h1>
            <p className="text-gray-600 dark:text-gray-400">Update your project details</p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Project Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="E-commerce Website Redesign"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="6"
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition resize-none ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Describe what you need..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Budget (₹)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition ${
                  errors.budget
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="50000"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
              )}
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Technology Stack
              </label>

              {/* Selected Techs */}
              <div className="mb-4 flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 text-sm font-medium"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTech(tech)}
                      className="hover:text-indigo-900 dark:hover:text-indigo-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>

              {errors.tech && (
                <p className="text-red-500 text-sm mb-3">{errors.tech}</p>
              )}

              {/* Suggested Techs */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Suggested:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TECHS.filter((t) => !techStack.includes(t)).map(
                    (tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => addTech(tech)}
                        className="px-3 py-1 rounded-full text-xs border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      >
                        + {tech}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Custom Tech */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTech}
                  onChange={(e) => setCustomTech(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTech();
                    }
                  }}
                  placeholder="Add custom technology..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={addCustomTech}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/projects/${id}`)}
                className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
}
