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
    <div
      className="
    min-h-screen
    bg-white
    dark:bg-gradient-to-br
    dark:from-slate-950
    dark:via-slate-900
    dark:to-slate-800
    text-gray-900 dark:text-gray-100
    transition-colors duration-300
  "
    >
    
      {/* HERO */}
      <section
        className="
    relative min-h-screen flex flex-col items-center justify-center overflow-hidden
    bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500
    dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-700
    transition-colors duration-300
  "
      >
        {/* animated blobs */}
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

        {/* HERO CONTENT */}
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Find Your Next <br />
              <span
                className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-yellow-200 to-pink-200
            dark:bg-gradient-to-r dark:from-indigo-300 dark:to-purple-300
          "
              >
                Dream Project
              </span>
            </h1>

            <p className="text-xl text-white/90 dark:text-gray-300 max-w-2xl mx-auto mb-10">
              Connect with top clients, showcase your skills, and build your freelance career on India’s fastest-growing project marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/projects"
                className="
            px-8 py-4 rounded-xl font-semibold shadow-xl
            bg-white text-indigo-600
            dark:bg-slate-800 dark:text-indigo-300
            hover:scale-105 transition
          "
              >
                Browse Projects
              </Link>

              <Link
                to="/post"
                className="
            px-8 py-4 rounded-xl font-semibold shadow-xl
            bg-gradient-to-r from-pink-500 to-orange-500 text-white
            dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600
            hover:scale-105 transition
          "
              >
                Post a Project
              </Link>
            </div>
          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-20 px-4"
          >
            {[
              { label: "Active Projects", value: projects.length },
              { label: "Success Rate", value: "98%" },
              { label: "Happy Clients", value: "500+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="
            rounded-2xl p-6 text-center
            bg-white/10 border border-white/20 backdrop-blur-lg shadow-xl
            dark:bg-gray-900/80 dark:border-gray-800 dark:shadow-black/40
            transition-all duration-300
          "
              >
                <div className="text-4xl font-bold text-white dark:text-gray-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
              Featured Projects
            </h2>

            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              Recent opportunities waiting for you
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="
              rounded-2xl
              bg-white dark:bg-gray-900
              border border-gray-200 dark:border-gray-800
              shadow-lg dark:shadow-black/40
              transition
            "
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/projects"
                className="
            inline-block px-8 py-3 rounded-xl font-semibold
            bg-indigo-600 text-white
            hover:bg-indigo-700
            dark:bg-indigo-700 dark:hover:bg-indigo-600
            transition
          "
              >
                View All Projects →
              </Link>
            </div>
          </div>
        </section>
      )}


      {/* FEATURES */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose FreelanceHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality Projects",
                desc: "Verified and curated opportunities",
                icon: "✨",
              },
              {
                title: "Fast Payments",
                desc: "Secure & reliable payments",
                icon: "💰",
              },
              {
                title: "Easy Management",
                desc: "Track everything in one place",
                icon: "🚀",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="rounded-2xl p-8 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition"
              >
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="
        relative rounded-3xl p-16 text-center shadow-2xl overflow-hidden
        bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
        dark:bg-gradient-to-r dark:from-slate-800 dark:via-slate-700 dark:to-slate-600
      ">
            <div className="absolute inset-0 bg-white/5 dark:bg-black/40 pointer-events-none" />
            <div className="relative z-10">
              <div
                className="
            w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center
            bg-white/90
            dark:bg-slate-900
            shadow-lg">
                <Globe className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h2 className="text-4xl font-bold text-white dark:text-gray-100 mb-4">
                Ready to Start?
              </h2>
              <p className="text-white/90 dark:text-gray-300 max-w-xl mx-auto mb-8">
                Join thousands of freelancers today.
              </p>
              <Link
                to="/post"
                className="
            inline-flex items-center gap-2 px-10 py-4 rounded-xl
            bg-white text-indigo-600
            dark:bg-slate-800 dark:text-indigo-300
            font-semibold text-lg
            shadow-xl
            hover:scale-105 hover:shadow-2xl
            dark:hover:bg-slate-700
            transition-all duration-300">
                Post Your First Project
                <TrendingUp className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">FreelanceHub</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 FreelanceHub
          </p>
        </div>
      </footer>
    </div>
  );
}
