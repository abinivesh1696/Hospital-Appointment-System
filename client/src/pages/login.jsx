import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthContext from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const { login } = useContext(AuthContext);
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
      await login(data.email, data.password);
      toast.success("Successfully logged in!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err || "Invalid credentials, please try again.");
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
              Sign In
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Access patient, doctor, or administrator dashboards.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
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

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                  errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                }`}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {submitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-sky-600 dark:text-sky-400 hover:underline">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default Login;