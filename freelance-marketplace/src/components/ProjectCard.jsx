import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, IndianRupee, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ProjectCard({ project, index = 0 }) {
  const formatBudget = (budget) => {
    if (!budget) return "—";
    if (budget >= 100000) return `${(budget / 100000).toFixed(1)}L`;
    return `${Math.round(budget / 1000)}K`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="
        border rounded-xl p-6
        bg-white dark:bg-gray-800
        border-gray-200 dark:border-gray-700
        hover:shadow-xl
        transition-all duration-300
        flex flex-col h-full
      "
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-gray-100">
          {project.title}
        </h3>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${
            project.status === "OPEN"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(project.tech_stack || []).slice(0, 4).map((tech, i) => (
          <span
            key={tech + i}
            className="
              px-3 py-1 rounded-full text-xs
              bg-gray-100 dark:bg-gray-700
              text-gray-700 dark:text-gray-200
            "
          >
            {tech}
          </span>
        ))}

        {project.tech_stack?.length > 4 && (
          <span className="px-3 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
            +{project.tech_stack.length - 4}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
            <IndianRupee className="w-4 h-4" />
            {formatBudget(project.budget)}
          </div>

          {/* {project.created_at && (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(project.created_at), {
                addSuffix: true,
              })}
            </div>
          )} */}
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-1 hover:underline"
        >
          View <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}
