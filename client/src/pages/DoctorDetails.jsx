import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthContext from "../context/AuthContext";
import api from "../services/api";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { FiArrowLeft, FiMapPin, FiClock, FiCalendar, FiDollarSign, FiAward, FiBookOpen } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

function DoctorDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/doctors/${id}`);
        setDoctor(data);
        setError(null);
      } catch (err) {
        console.error("Fetch doctor details failed:", err);
        setError("Failed to load doctor profile. The doctor may not exist or is not approved.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  const onSubmit = async (formData) => {
    try {
      // Body matches Appointment Schema requirements:
      // doctor, appointmentDate, appointmentTime, symptoms
      await api.post("/appointments", {
        doctor: doctor.userId._id,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        symptoms: formData.symptoms,
      });

      toast.success("Appointment booked successfully! Redirecting to dashboard...", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/dashboard?tab=appointments");
      }, 2000);
    } catch (err) {
      console.error("Booking failed:", err);
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  return (
    <MainLayout>
      <ToastContainer />
      <div className="py-12 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/doctors"
            className="inline-flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-sky-600 mb-8 text-sm font-semibold transition"
          >
            <FiArrowLeft />
            <span>Back to Doctors</span>
          </Link>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-slate-500">Loading doctor profile...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-2xl">
              <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>
            </div>
          ) : !doctor ? (
            <div className="text-center py-10">
              <p className="text-slate-500">Doctor not found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Profile Card details */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                  {doctor.userId?.profileImage ? (
                    <img
                      src={`http://localhost:5000${doctor.userId.profileImage}`}
                      alt={doctor.userId.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-sky-100 dark:border-slate-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600 font-bold text-2xl border border-sky-100">
                      {doctor.userId?.name ? doctor.userId.name.split(" ").map(n=>n[0]).join("") : "DR"}
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {doctor.userId?.name}
                    </h1>
                    <span className="inline-block mt-2 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-3 py-1 rounded-full">
                      {doctor.specialization}
                    </span>
                    <p className="mt-2.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {doctor.qualification}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <FiAward className="text-sky-500" />
                      <span>About Dr. {doctor.userId?.name.split(" ").pop()}</span>
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {doctor.about || "No biography provided. Click to view booking detail slots."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                    <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
                      <FiMapPin className="text-sky-500 shrink-0 w-5 h-5" />
                      <div>
                        <span className="text-xs text-slate-400 block">Hospital location</span>
                        <span className="font-semibold">{doctor.hospital}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
                      <FiClock className="text-sky-500 shrink-0 w-5 h-5" />
                      <div>
                        <span className="text-xs text-slate-400 block">Clinic Hours</span>
                        <span className="font-semibold">{doctor.availableTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
                      <FiCalendar className="text-sky-500 shrink-0 w-5 h-5" />
                      <div>
                        <span className="text-xs text-slate-400 block">Availability</span>
                        <span className="font-semibold">{doctor.availableDays.join(", ")}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
                      <FiDollarSign className="text-sky-500 shrink-0 w-5 h-5" />
                      <div>
                        <span className="text-xs text-slate-400 block">Consultation Fee</span>
                        <span className="font-bold text-slate-800 dark:text-white">${doctor.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking panel */}
              <div className="lg:col-span-5">
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm glass">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center space-x-2">
                    <FiBookOpen className="text-sky-500" />
                    <span>Book Appointment</span>
                  </h2>

                  {/* Auth gate check */}
                  {!user ? (
                    <div className="text-center py-6">
                      <p className="text-sm text-slate-500 mb-4">
                        Please sign in or register to secure consultation timings.
                      </p>
                      <Link
                        to="/login"
                        className="inline-block w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg text-sm text-center shadow"
                      >
                        Login to Book
                      </Link>
                    </div>
                  ) : user.role !== "patient" ? (
                    <div className="text-center py-6 text-slate-500 text-sm">
                      Only patients are allowed to book appointments.
                    </div>
                  ) : (
                    /* Booking Form */
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                          Appointment Date
                        </label>
                        <input
                          type="date"
                          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                            errors.appointmentDate ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                          }`}
                          {...register("appointmentDate", { required: "Appointment Date is required" })}
                        />
                        {errors.appointmentDate && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{errors.appointmentDate.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                          Preferred Time Slot
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 10:30 AM"
                          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                            errors.appointmentTime ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                          }`}
                          {...register("appointmentTime", { required: "Time slot is required" })}
                        />
                        {errors.appointmentTime && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{errors.appointmentTime.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                          Describe Symptoms
                        </label>
                        <textarea
                          rows="3"
                          placeholder="Enter details (e.g. sore throat, chest pain since last night...)"
                          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                            errors.symptoms ? "border-red-500" : "border-slate-200 dark:border-slate-700"
                          }`}
                          {...register("symptoms", { required: "Symptoms description is required" })}
                        ></textarea>
                        {errors.symptoms && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{errors.symptoms.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-lg shadow-sm transition"
                      >
                        Confirm Appointment
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default DoctorDetails;
