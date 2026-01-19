import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Briefcase } from "lucide-react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { fetchProjects } from "../features/projects/projectSlice";
import ProjectCard from "../components/ProjectCard";


export default function Projects() {
  const dispatch = useDispatch();

  const { projects, status } = useSelector(
    (state) => ({
      projects: state.projects?.projects || [],
      status: state.projects?.status || "idle",
    }),
    shallowEqual
  );

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTechs, setSelectedTechs] = useState([]);

  useEffect(() => {
    // Fetch projects on mount (works for both authenticated and unauthenticated users)
    dispatch(fetchProjects());
  }, [dispatch, isAuthenticated]); // Re-fetch when auth status changes

  const allTechStacks = useMemo(() => {
    return Array.from(
      new Set(
        projects.flatMap((p) =>
          Array.isArray(p?.tech_stack) ? p.tech_stack : []
        )
      )
    ).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (!project) return false;

      const title = project.title?.toLowerCase() || "";
      const desc = project.description?.toLowerCase() || "";

      const matchesSearch =
        title.includes(searchQuery.toLowerCase()) ||
        desc.includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || project.status === statusFilter;

      const matchesTech =
        selectedTechs.length === 0 ||
        selectedTechs.some((tech) =>
          (project.tech_stack || []).includes(tech)
        );

      return matchesSearch && matchesStatus && matchesTech;
    });
  }, [projects, searchQuery, statusFilter, selectedTechs]);

  const toggleTech = (tech) => {
    setSelectedTechs((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : [...prev, tech]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setSelectedTechs([]);
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "ALL" || selectedTechs.length > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
              Browse <span className="text-indigo-600">Projects</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover {filteredProjects.length} opportunities
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border rounded-xl p-4 sm:p-6 mb-8
                       bg-white dark:bg-gray-800
                       border-gray-200 dark:border-gray-700
                       transition-colors duration-300"
          >
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-lg border
                           bg-white dark:bg-gray-900
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           transition-colors duration-300"
              />
            </div>

            {/* Status */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Status:
              </span>

              {["ALL", "OPEN", "COMPLETED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full text-xs border transition
                    ${
                      statusFilter === status
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                    }`}
                >
                  {status === "ALL" ? "All" : status}
                </button>
              ))}
            </div>

            {/* Tech */}
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 block mb-2">
                Tech Stack:
              </span>
              <div className="flex flex-wrap gap-2">
                {allTechStacks.slice(0, 10).map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTech(tech)}
                    className={`px-3 py-1 rounded-full text-xs border transition
                      ${
                        selectedTechs.includes(tech)
                          ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-indigo-400"
                          : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                      }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Grid */}
          {status === "loading" ? (
            <p className="text-center py-20 text-gray-500">Loading projects...</p>
          ) : filteredProjects.length > 0 ? (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id || project._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <ProjectCard project={project} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 border rounded-lg
                           border-gray-300 dark:border-gray-600"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}