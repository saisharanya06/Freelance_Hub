import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  X,
  Loader2,
  Check,
  IndianRupee,
  FileText,
  Code2,
  Sparkles,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createProject } from "../features/projects/projectSlice";
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

export default function PostProject() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const status = useSelector(
    (state) => state.projects?.status || "idle"
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const [techStack, setTechStack] = useState([]);
  const [customTech, setCustomTech] = useState("");
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const err = {};
    if (!formData.title.trim()) err.title = "Title required";
    if (!formData.description.trim())
      err.description = "Description required";
    if (!formData.budget || parseInt(formData.budget) <= 0)
      err.budget = "Valid budget required";
    if (techStack.length === 0)
      err.tech = "Select at least one tech";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title,
      description: formData.description,
      budget: parseInt(formData.budget),
      tech_stack: techStack,
    };

    try {
      const result = await dispatch(createProject(payload)).unwrap();
      console.log("✅ Project created successfully:", result);
      setIsSuccess(true);
      toast.success("Project posted successfully!");
      // Reset form
      setFormData({ title: "", description: "", budget: "" });
      setTechStack([]);
      // Navigate after a short delay
      setTimeout(() => navigate("/projects"), 800);
    } catch (error) {
      console.error("❌ Error posting project:", error);
      // Only show error if it's a real error, not undefined
      if (error) {
        toast.error(typeof error === "string" ? error : "Failed to post project");
      }
    }
  };

  const addTech = (tech) => {
    if (!techStack.includes(tech)) {
      setTechStack([...techStack, tech]);
      setErrors({ ...errors, tech: "" });
    }
  };

  const removeTech = (tech) =>
    setTechStack(techStack.filter((t) => t !== tech));

  const addCustomTech = () => {
    const tech = customTech.trim();
    if (!tech) return;
    if (!techStack.includes(tech)) {
      setTechStack([...techStack, tech]);
      setErrors({ ...errors, tech: "" });
    }
    setCustomTech("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center mb-4">
              <Sparkles className="text-white w-8 h-8" />
            </div>

            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Post a <span className="text-indigo-600 dark:text-indigo-400">New Project</span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Connect with talented freelancers
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-800
              rounded-xl p-6 space-y-6
            "
          >
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Project Title
              </label>

              <input
                className="
                  w-full h-12 px-4 rounded-lg border
                  bg-white dark:bg-gray-800
                  border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                "
                placeholder="E-commerce Website"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Description
              </label>

              <textarea
                rows={5}
                className="
                  w-full px-4 py-3 rounded-lg resize-none border
                  bg-white dark:bg-gray-800
                  border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                "
                placeholder="Describe your project..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />

              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Budget */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                <IndianRupee className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Budget
              </label>

              <input
                type="number"
                className="
                  w-full h-12 px-4 rounded-lg border
                  bg-white dark:bg-gray-800
                  border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white
                "
                placeholder="50000"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: e.target.value,
                  })
                }
              />

              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
              )}
            </div>

            {/* Tech Stack */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-900 dark:text-gray-200">
                <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Tech Stack
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="
                      px-3 py-1 rounded-full text-sm flex items-center gap-1
                      bg-indigo-100 dark:bg-indigo-900/40
                      text-indigo-700 dark:text-indigo-300
                    "
                  >
                    {tech}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTech(tech)}
                    />
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTED_TECHS.filter(
                  (t) => !techStack.includes(t)
                ).map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => addTech(tech)}
                    className="
                      px-3 py-1 text-sm rounded-full border
                      border-gray-300 dark:border-gray-700
                      text-gray-700 dark:text-gray-300
                      hover:bg-indigo-50 dark:hover:bg-gray-800
                    "
                  >
                    <Plus className="inline w-3 h-3 mr-1" />
                    {tech}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add custom technology..."
                  value={customTech}
                  onChange={(e) => setCustomTech(e.target.value)}
                  className="
                    flex-1 h-10 px-4 rounded-lg border text-sm
                    bg-white dark:bg-gray-800
                    border-gray-300 dark:border-gray-700
                    text-gray-900 dark:text-white
                  "
                />

                <button
                  type="button"
                  onClick={addCustomTech}
                  disabled={!customTech.trim()}
                  className="
                    h-10 w-10 flex items-center justify-center rounded-lg border
                    border-gray-300 dark:border-gray-700
                    hover:bg-indigo-50 dark:hover:bg-gray-800
                  "
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {errors.tech && (
                <p className="text-red-500 text-sm">{errors.tech}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="
                w-full h-12 rounded-lg
                bg-indigo-600 hover:bg-indigo-700
                text-white flex items-center justify-center gap-2
              "
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Posting...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  Posted
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Post Project
                </>
              )}
            </button>
          </motion.form>
        </div>
      </main>
    </div>
  );
}