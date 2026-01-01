import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "../features/projects/projectSlice";
import { Briefcase, Globe, TrendingUp } from "lucide-react";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* ================= HERO ================= */}
      <section
        className="
          relative min-h-screen
          flex flex-col items-center justify-center
          pt-28 px-4
          overflow-hidden
          bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500
          dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-700
          transition-colors duration-300
        "
      >
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl bg-white/10 dark:bg-indigo-500/10"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl bg-white/10 dark:bg-purple-500/10"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white mb-6">
              Find Your Next <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
                Dream Project
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10">
              Connect with top clients, showcase your skills, and build your freelance career on India’s fastest-growing project marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/projects"
                className="px-8 py-4 rounded-xl font-semibold shadow-xl
                  bg-white text-indigo-600
                  hover:scale-105 transition"
              >
                Browse Projects
              </Link>

              <Link
                to="/post"
                className="px-8 py-4 rounded-xl font-semibold shadow-xl
                  bg-gradient-to-r from-pink-500 to-orange-500 text-white
                  hover:scale-105 transition"
              >
                Post a Project
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-14"
          >
            {[
              { label: "Active Projects", value: projects.length },
              { label: "Success Rate", value: "98%" },
              { label: "Happy Clients", value: "500+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl p-6 text-center
                  bg-white/10 border border-white/20 backdrop-blur-lg shadow-xl"
              >
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4">
              Featured Projects
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              Recent opportunities waiting for you
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id || project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/projects"
                className="inline-block px-8 py-3 rounded-xl font-semibold
                  bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                View All Projects →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="py-8 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">FreelanceHub</span>
          </div>
          <p className="text-sm text-gray-500">© 2025 FreelanceHub</p>
        </div>
      </footer>
    </div>
  );
}
