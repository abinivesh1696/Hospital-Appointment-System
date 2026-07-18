import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const initialEmail = localStorage.getItem("resetEmail") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: initialEmail,
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", {
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      });

      toast.success("Password reset successfully! Redirecting to login...");
      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password failed:", err);
      toast.error(err.response?.data?.message || "Reset failed. Verify details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <ToastContainer />
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-md glass">
          <div className="text-center">
            <span className="text-4xl">🔐</span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Input the verification code and set your new account password.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                  errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                6-Digit Reset Code
              </label>
              <input
                type="text"
                placeholder="e.g. 123456"
                maxLength="6"
                className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-center tracking-widest font-mono text-lg ${
                  errors.code ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                }`}
                {...register("code", {
                  required: "Reset code is required",
                  minLength: { value: 6, message: "Code must be 6 digits" },
                })}
              />
              {errors.code && (
                <p className="text-xs text-red-500 mt-1 font-medium text-center">{errors.code.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                New Password
              </label>
              <input
                type="password"
                placeholder="Create new password"
                className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                  errors.newPassword ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                }`}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
              />
              {errors.newPassword && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.newPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {submitting ? "Resetting Password..." : "Update Password"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/login" className="font-semibold text-sky-600 dark:text-sky-400 hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default ResetPassword;
