export default function StatusBadge({ status }) {
  return (
    <span
      className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full font-medium whitespace-nowrap ${
        status === "OPEN"
          ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}
