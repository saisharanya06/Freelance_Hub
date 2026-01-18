// import { useState, useEffect } from "react";
// import { useSearchParams, Link, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import api from "../config/api";
// import Navbar from "../components/Navbar";

// export default function ResetPassword() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
  
//   const token = searchParams.get("token");
//   const [isValidating, setIsValidating] = useState(true);
//   const [tokenValid, setTokenValid] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
  
//   const [formData, setFormData] = useState({
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});

//   // Validate token on mount
//   useEffect(() => {
//     const validateToken = async () => {
//       if (!token) {
//         setIsValidating(false);
//         toast.error("No reset token provided");
//         return;
//       }

//       try {
//         const res = await api.post("/auth/verify-reset-token", { token });
        
//         if (res.data.valid) {
//           setTokenValid(true);
//         } else {
//           setTokenValid(false);
//           toast.error("Invalid or expired reset token");
//         }
//       } catch (err) {
//         setTokenValid(false);
//         toast.error("Failed to validate reset token");
//       } finally {
//         setIsValidating(false);
//       }
//     };

//     validateToken();
//   }, [token]);

//   const validate = () => {
//     const err = {};
    
//     if (!formData.password.trim()) {
//       err.password = "Password required";
//     } else if (formData.password.length < 6) {
//       err.password = "Password must be at least 6 characters";
//     }
    
//     if (!formData.confirmPassword.trim()) {
//       err.confirmPassword = "Please confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       err.confirmPassword = "Passwords don't match";
//     }

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validate()) return;

//     setIsLoading(true);

//     try {
//       const res = await api.post("/auth/reset-password", {
//         token,
//         new_password: formData.password,
//       });

//       if (res.data.success) {
//         setIsSuccess(true);
//         toast.success("Password reset successfully!");
//         setTimeout(() => navigate("/login"), 3000);
//       } else {
//         toast.error(res.data.message || "Failed to reset password");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.detail || "Failed to reset password";
//       toast.error(errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isValidating) {
//     return (
//       <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//         <Navbar />
//         <main className="pt-24 text-center">
//           <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
//           <p className="text-gray-600 dark:text-gray-400 mt-4">Validating reset link...</p>
//         </main>
//       </div>
//     );
//   }

//   if (!tokenValid) {
//     return (
//       <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//         <Navbar />
//         <main className="pt-20 pb-12">
//           <div className="max-w-md mx-auto px-4">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center"
//             >
//               <div className="flex justify-center mb-4">
//                 <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
//                   <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
//                 </div>
//               </div>
//               <h2 className="text-2xl font-bold mb-2">Invalid Reset Link</h2>
//               <p className="text-gray-600 dark:text-gray-400 mb-6">
//                 This password reset link is invalid or has expired. Please request a new one.
//               </p>
//               <Link
//                 to="/forgot-password"
//                 className="inline-block px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
//               >
//                 Request New Link
//               </Link>
//             </motion.div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       <Navbar />

//       <main className="pt-20 pb-12">
//         <div className="max-w-md mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8"
//           >
//             {!isSuccess ? (
//               <>
//                 <div className="text-center mb-8">
//                   <div className="flex justify-center mb-4">
//                     <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
//                       <Lock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
//                     </div>
//                   </div>
//                   <h1 className="text-2xl font-bold mb-2">Create New Password</h1>
//                   <p className="text-gray-600 dark:text-gray-400">
//                     Enter your new password below
//                   </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   {/* New Password */}
//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       New Password
//                     </label>
//                     <input
//                       type="password"
//                       value={formData.password}
//                       onChange={(e) => {
//                         setFormData({ ...formData, password: e.target.value });
//                         setErrors({ ...errors, password: "" });
//                       }}
//                       className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition ${
//                         errors.password
//                           ? "border-red-500"
//                           : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
//                       }`}
//                       placeholder="••••••••"
//                       disabled={isLoading}
//                     />
//                     {errors.password && (
//                       <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//                     )}
//                   </div>

//                   {/* Confirm Password */}
//                   <div>
//                     <label className="block text-sm font-semibold mb-2">
//                       Confirm Password
//                     </label>
//                     <input
//                       type="password"
//                       value={formData.confirmPassword}
//                       onChange={(e) => {
//                         setFormData({ ...formData, confirmPassword: e.target.value });
//                         setErrors({ ...errors, confirmPassword: "" });
//                       }}
//                       className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition ${
//                         errors.confirmPassword
//                           ? "border-red-500"
//                           : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
//                       }`}
//                       placeholder="••••••••"
//                       disabled={isLoading}
//                     />
//                     {errors.confirmPassword && (
//                       <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
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
//                         Resetting Password...
//                       </>
//                     ) : (
//                       <>
//                         <Lock className="w-4 h-4" />
//                         Reset Password
//                       </>
//                     )}
//                   </button>
//                 </form>

//                 <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
//                   <Link
//                     to="/login"
//                     className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
//                   >
//                     Back to Login
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
//                   <h2 className="text-2xl font-bold mb-2">Password Reset Successfully!</h2>
//                   <p className="text-gray-600 dark:text-gray-400 mb-6">
//                     Your password has been reset. You'll be redirected to login in a moment...
//                   </p>
//                   <Link
//                     to="/login"
//                     className="inline-block px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
//                   >
//                     Go to Login
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
