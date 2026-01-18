// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
// import toast from "react-hot-toast";
// import api from "../config/api";
// import Navbar from "../components/Navbar";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [error, setError] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email.trim()) {
//       setError("Email is required");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const res = await api.post("/auth/forgot-password", { email });
      
//       if (res.data.success) {
//         setIsSubmitted(true);
//         toast.success("Password reset link sent to your email!");
//       } else {
//         setError(res.data.message || "Failed to send reset email");
//         toast.error("Failed to send reset email");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.detail || "Failed to send reset email";
//       setError(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       <Navbar />

//       <main className="pt-20 pb-12">
//         <div className="max-w-md mx-auto px-4">
//           {/* Back Link */}
//           <Link
//             to="/login"
//             className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mb-6"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Login
//           </Link>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8"
//           >
//             {!isSubmitted ? (
//               <>
//                 <div className="text-center mb-8">
//                   <div className="flex justify-center mb-4">
//                     <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
//                       <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
//                     </div>
//                   </div>
//                   <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
//                   <p className="text-gray-600 dark:text-gray-400">
//                     Enter your email and we'll send you a link to reset your password
//                   </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Email Address
//                     </label>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => {
//                         setEmail(e.target.value);
//                         setError("");
//                       }}
//                       className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition ${
//                         error
//                           ? "border-red-500"
//                           : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
//                       }`}
//                       placeholder="your.email@example.com"
//                       disabled={isLoading}
//                     />
//                     {error && (
//                       <p className="text-red-500 text-sm mt-1">{error}</p>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition"
//                   >
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Sending...
//                       </>
//                     ) : (
//                       <>
//                         <Mail className="w-4 h-4" />
//                         Send Reset Link
//                       </>
//                     )}
//                   </button>
//                 </form>

//                 <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
//                   Remember your password?{" "}
//                   <Link
//                     to="/login"
//                     className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
//                   >
//                     Login here
//                   </Link>
//                 </p>
//               </>
//             ) : (
//               <>
//                 <div className="text-center">
//                   <div className="flex justify-center mb-4">
//                     <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
//                       <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
//                     </div>
//                   </div>
//                   <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
//                   <p className="text-gray-600 dark:text-gray-400 mb-4">
//                     We've sent a password reset link to <strong>{email}</strong>
//                   </p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
//                     The link will expire in 24 hours. If you don't see it, check your spam folder.
//                   </p>

//                   <Link
//                     to="/login"
//                     className="inline-block px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
//                   >
//                     Back to Login
//                   </Link>
//                 </div>
//               </>
//             )}
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   );
// }
