import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await api.post("/auth/forgot-password", { email: data.email });
      toast.success(response.data.message || "Simulated reset code generated!");
      
      // Save email to localStorage/state to pass to the reset screen automatically
      localStorage.setItem("resetEmail", data.email);

      setTimeout(() => {
        navigate("/reset-password");
      }, 3000);
    } catch (err) {
      console.error("Forgot pass error:", err);
      toast.error(err.response?.data?.message || "Failed to submit request.");
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
            <span className="text-4xl">🔑</span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Enter your email address and we will generate a simulated 6-digit reset code (logged to the server console).
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
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {submitting ? "Submitting Request..." : "Request Reset Code"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            Remembered your password?{" "}
            <Link to="/login" className="font-semibold text-sky-600 dark:text-sky-400 hover:underline">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default ForgotPassword;
