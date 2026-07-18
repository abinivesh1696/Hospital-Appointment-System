import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthContext from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const { register: registerAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const specializations = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "ENT",
    "Gynecology",
    "General Physician",
  ];

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Build registration payload
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        gender: data.gender,
        age: data.age,
        role: role,
      };

      if (role === "doctor") {
        payload.specialization = data.specialization;
        payload.qualification = data.qualification;
        payload.experience = data.experience;
        payload.consultationFee = data.consultationFee;
        payload.hospital = data.hospital;
        payload.about = data.about;
      }

      await registerAuth(payload);
      
      if (role === "doctor") {
        toast.success("Registration success! Doctors must wait for Administrator approval before logging in.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        toast.success("Registration success! Welcome to CareSync.");
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err || "Registration failed. Email might be already in use.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <ToastContainer />
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-md glass">
          <div className="text-center mb-8">
            <span className="text-4xl">📝</span>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Join CareSync to schedule consultations and view clinical prescriptions.
            </p>

            {/* Toggle Role Selector */}
            <div className="flex justify-center space-x-2 mt-6 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl w-60 mx-auto">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  role === "patient"
                    ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  role === "doctor"
                    ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Doctor
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
              General Account Info
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors.name ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  }`}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.name.message}</p>
                )}
              </div>

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

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create password"
                  className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                    errors.password ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
<<<<<<< HEAD
                  placeholder="e.g. +91 9876543210"
=======
                  placeholder="e.g. +1 555-0100"
>>>>>>> 710c66010cb11e5015cf1550799fabbbd3c5ecf2
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  {...register("phone")}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                  Gender
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  {...register("gender")}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="Enter age"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  {...register("age")}
                />
              </div>
            </div>

            {/* Doctor Specific Section */}
            {role === "doctor" && (
              <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
                  Doctor Specialized Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                      Specialization Department
                    </label>
                    <select
                      className={`w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        errors.specialization ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      }`}
                      {...register("specialization", { required: "Specialization is required" })}
                    >
                      <option value="">Choose department</option>
                      {specializations.map((spec, idx) => (
                        <option key={idx} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    {errors.specialization && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.specialization.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                      Qualification (degrees)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MBBS, MD Cardiology"
                      className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        errors.qualification ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      }`}
                      {...register("qualification", { required: "Qualification degrees are required" })}
                    />
                    {errors.qualification && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.qualification.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 8"
                      className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        errors.experience ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      }`}
                      {...register("experience", { required: "Years of experience is required" })}
                    />
                    {errors.experience && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.experience.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
<<<<<<< HEAD
                      Consultation Fee (🫱🏻‍🫲🏻Rupees)
=======
                      Consultation Fee ($ USD)
>>>>>>> 710c66010cb11e5015cf1550799fabbbd3c5ecf2
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 150"
                      className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        errors.consultationFee ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      }`}
                      {...register("consultationFee", { required: "Consultation fee is required" })}
                    />
                    {errors.consultationFee && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.consultationFee.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                      Primary Hospital Clinic
                    </label>
                    <input
                      type="text"
                      placeholder="Hospital Name, building, city"
                      className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                        errors.hospital ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                      }`}
                      {...register("hospital", { required: "Hospital clinic location is required" })}
                    />
                    {errors.hospital && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.hospital.message}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                      About Me (Clinical Bio)
                    </label>
                    <textarea
                      rows="3"
                      placeholder="Write details of background, board-certifications..."
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      {...register("about")}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50 mt-4"
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-sky-600 dark:text-sky-400 hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default Register;