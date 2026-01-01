import { motion } from "framer-motion";

export default function ProjectCardSkeleton({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="
        border rounded-xl p-6
        bg-white dark:bg-gray-900
        border-gray-200 dark:border-gray-800
        transition-colors duration-300
      "
    >
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div className="h-6 w-3/4 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
        <div className="h-6 w-16 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-4 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-2/3 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Tech stack */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-16 rounded-full animate-pulse bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="h-5 w-20 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-16 rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
      </div>
    </motion.div>
  );
}
