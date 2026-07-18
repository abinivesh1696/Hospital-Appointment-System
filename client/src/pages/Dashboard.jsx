import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../services/api";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  FiCalendar,
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiUserPlus,
  FiTrash2,
  FiEdit,
  FiCheck,
  FiX,
  FiPlus,
  FiBookOpen,
  FiUpload,
  FiEye,
} from "react-icons/fi";

function Dashboard() {
  const { user, updateProfile } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "overview";

  // Data state
  const [appointments, setAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Modals state
  const [prescriptionModalAppt, setPrescriptionModalAppt] = useState(null);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  
  // Custom prescription inputs
  const [prescriptionInput, setPrescriptionInput] = useState("");
  const [notesInput, setNotesInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  // Load backend data based on user role and active tab
  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
      setLoadingData(true);
      try {
        if (user.role === "admin") {
          // Admin needs all data
          const [apptsRes, docsRes, patientsRes] = await Promise.all([
            api.get("/appointments"),
            api.get("/doctors?approved=all"),
            api.get("/patients"),
          ]);
          setAppointments(apptsRes.data);
          setDoctorsList(docsRes.data);
          setPatientsList(patientsRes.data);
        } else if (user.role === "doctor") {
          // Doctor needs appointments list
          const { data } = await api.get("/appointments");
          setAppointments(data);
        } else if (user.role === "patient") {
          // Patient needs appointments list and approved doctors list if browsing doctors
          const [apptsRes, docsRes] = await Promise.all([
            api.get("/appointments"),
            api.get("/doctors?approved=true"),
          ]);
          setAppointments(apptsRes.data);
          setDoctorsList(docsRes.data);
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user, activeTab]);

  if (!user) return null;

  // ----------------------------------------------------
  // PATIENT HANDLERS
  // ----------------------------------------------------
  const handleCancelAppointment = async (apptId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.put(`/appointments/${apptId}`, { status: "Cancelled" });
      toast.success("Appointment cancelled successfully.");
      // Refresh list
      const { data } = await api.get("/appointments");
      setAppointments(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel appointment.");
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await updateProfile(formData, true);
      toast.success("Profile photo updated successfully!");
    } catch (err) {
      toast.error(err || "Image upload failed. Ensure it is less than 2MB.");
    }
  };

  // Profile Form submit (Patient details or Doctor general details)
  const onProfileSubmit = async (data) => {
    try {
      await updateProfile(data, false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err || "Profile update failed.");
    }
  };

  // ----------------------------------------------------
  // DOCTOR HANDLERS
  // ----------------------------------------------------
  const handleUpdateStatus = async (apptId, status) => {
    try {
      await api.put(`/appointments/${apptId}`, { status });
      toast.success(`Appointment status updated to ${status}`);
      // Refresh lists
      const { data } = await api.get("/appointments");
      setAppointments(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.");
    }
  };

  const openPrescriptionModal = (appt) => {
    setPrescriptionModalAppt(appt);
    setPrescriptionInput(appt.prescription || "");
    setNotesInput(appt.notes || "");
  };

  const handleSavePrescription = async () => {
    if (!prescriptionModalAppt) return;
    try {
      await api.put(`/appointments/${prescriptionModalAppt._id}`, {
        status: "Completed",
        prescription: prescriptionInput,
        notes: notesInput,
      });
      toast.success("Prescription submitted. Appointment completed!");
      setPrescriptionModalAppt(null);
      // Refresh lists
      const { data } = await api.get("/appointments");
      setAppointments(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit prescription.");
    }
  };

  // ----------------------------------------------------
  // ADMIN HANDLERS
  // ----------------------------------------------------
  const handleApproveDoctor = async (docId, approveStatus) => {
    try {
      await api.put(`/doctors/${docId}`, { approved: approveStatus });
      toast.success(approveStatus ? "Doctor account approved!" : "Doctor approval revoked.");
      // Refresh doctors
      const { data } = await api.get("/doctors?approved=all");
      setDoctorsList(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change doctor approval.");
    }
  };

  const handleDeleteDoctor = async (docId) => {
    if (!window.confirm("Are you sure you want to permanently delete this doctor's account?")) return;
    try {
      await api.delete(`/doctors/${docId}`);
      toast.success("Doctor deleted successfully.");
      // Refresh doctors
      const { data } = await api.get("/doctors?approved=all");
      setDoctorsList(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete doctor.");
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient's account?")) return;
    try {
      await api.delete(`/patients/${patientId}`);
      toast.success("Patient deleted successfully.");
      // Refresh patients
      const { data } = await api.get("/patients");
      setPatientsList(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete patient.");
    }
  };

  const handleOpenAddDoctorModal = () => {
    setEditingDoctor(null);
    reset(); // Clear form validation
    setDoctorModalOpen(true);
  };

  const handleOpenEditDoctorModal = (doc) => {
    setEditingDoctor(doc);
    setDoctorModalOpen(true);
    // Populate form fields
    setValue("name", doc.userId?.name || "");
    setValue("email", doc.userId?.email || "");
    setValue("phone", doc.userId?.phone || "");
    setValue("gender", doc.userId?.gender || "");
    setValue("age", doc.userId?.age || "");
    setValue("specialization", doc.specialization || "");
    setValue("qualification", doc.qualification || "");
    setValue("experience", doc.experience || "");
    setValue("consultationFee", doc.consultationFee || "");
    setValue("hospital", doc.hospital || "");
    setValue("about", doc.about || "");
    setValue("availableTime", doc.availableTime || "");
  };

  const handleDoctorFormSubmit = async (data) => {
    try {
      if (editingDoctor) {
        // Edit doctor mode
        await api.put(`/doctors/${editingDoctor._id}`, {
          name: data.name,
          phone: data.phone,
          gender: data.gender,
          age: data.age,
          specialization: data.specialization,
          qualification: data.qualification,
          experience: data.experience,
          consultationFee: data.consultationFee,
          hospital: data.hospital,
          about: data.about,
          availableTime: data.availableTime,
        });
        toast.success("Doctor details updated successfully!");
      } else {
        // Add new doctor mode
        await api.post("/doctors", {
          name: data.name,
          email: data.email,
          password: data.password || "Doctor123!", // Default temp password
          phone: data.phone,
          gender: data.gender,
          age: data.age,
          specialization: data.specialization,
          qualification: data.qualification,
          experience: data.experience,
          consultationFee: data.consultationFee,
          hospital: data.hospital,
          about: data.about,
          availableTime: data.availableTime,
        });
        toast.success("New doctor created successfully!");
      }
      setDoctorModalOpen(false);
      // Refresh lists
      const res = await api.get("/doctors?approved=all");
      setDoctorsList(res.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Doctor operation failed.");
    }
  };

  // ----------------------------------------------------
  // DUMMY REVENUE & STATISTICS COMPILATIONS
  // ----------------------------------------------------
  const getStats = () => {
    if (user.role === "admin") {
      const pending = appointments.filter((a) => a.status === "Pending").length;
      const completed = appointments.filter((a) => a.status === "Completed").length;
      // Calculate dummy revenue from completed appointments (sum of consultation fees)
      const revenue = appointments
        .filter((a) => a.status === "Completed")
        .reduce((sum, a) => sum + (Number(a.doctor?.consultationFee) || 0), 0);

      return {
        totalDoctors: doctorsList.length,
        totalPatients: patientsList.length,
        totalAppointments: appointments.length,
        pendingAppointments: pending,
        completedAppointments: completed,
        revenue,
      };
    } else if (user.role === "doctor") {
      const today = new Date().toDateString();
      const todayAppts = appointments.filter(
        (a) => new Date(a.appointmentDate).toDateString() === today && a.status !== "Cancelled"
      ).length;
      const pending = appointments.filter((a) => a.status === "Pending").length;
      const completed = appointments.filter((a) => a.status === "Completed").length;

      return { todayAppts, pending, completed };
    } else if (user.role === "patient") {
      const total = appointments.length;
      const upcoming = appointments.filter((a) => ["Pending", "Accepted"].includes(a.status)).length;
      const completed = appointments.filter((a) => a.status === "Completed").length;

      return { total, upcoming, completed };
    }
    return {};
  };

  const stats = getStats();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-6 rounded-3xl shadow-sm glass">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize">
              Hello, {user.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Welcome back to your healthcare management hub.
            </p>
          </div>
          <span className="mt-3 sm:mt-0 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-100 dark:bg-sky-950 text-sky-750 dark:text-sky-400">
            {user.role} PANEL
          </span>
        </div>

        {/* -------------------------------------------------------------------------------- */}
        {/* OVERVIEW TAB */}
        {/* -------------------------------------------------------------------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {user.role === "admin" && (
                <>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Doctors</span>
                      <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">{stats.totalDoctors}</p>
                    </div>
                    <span className="text-3xl">🩺</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Patients</span>
                      <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">{stats.totalPatients}</p>
                    </div>
                    <span className="text-3xl">👥</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointments</span>
                      <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">{stats.totalAppointments}</p>
                      <span className="text-xs text-slate-400">({stats.pendingAppointments} pending, {stats.completedAppointments} completed)</span>
                    </div>
                    <span className="text-3xl">📅</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/20 dark:to-indigo-950/20">
                    <div>
                      <span className="text-xs font-bold text-sky-655 dark:text-sky-400 uppercase tracking-wider block">Dummy Revenue (Consultation Fee Sum)</span>
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 inline-block">${stats.revenue}</span>
                    </div>
                    <span className="text-4xl text-sky-600">💰</span>
                  </div>
                </>
              )}

              {user.role === "doctor" && (
                <>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Appointments</span>
                      <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">{stats.todayAppts}</p>
                    </div>
                    <span className="text-3xl text-sky-600">⚡</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Booking Requests</span>
                      <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">{stats.pending}</p>
                    </div>
                    <span className="text-3xl text-amber-500">⏳</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Completed checkups</span>
                      <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">{stats.completed}</p>
                    </div>
                    <span className="text-3xl text-emerald-500">✅</span>
                  </div>
                </>
              )}

              {user.role === "patient" && (
                <>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Bookings</span>
                      <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">{stats.total}</p>
                    </div>
                    <span className="text-3xl">📋</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Visits</span>
                      <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">{stats.upcoming}</p>
                    </div>
                    <span className="text-3xl text-sky-500">🗓️</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Sessions</span>
                      <p className="text-2xl font-extrabold text-slate-950 dark:text-white mt-1">{stats.completed}</p>
                    </div>
                    <span className="text-3xl text-emerald-500">❤️</span>
                  </div>
                </>
              )}
            </div>

            {/* Admin visual charts */}
            {user.role === "admin" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Weekly Appointments Load</h3>
                <div className="flex justify-between items-end h-40 max-w-xl mx-auto pt-6 border-b border-slate-200 dark:border-slate-800">
                  {[
                    { day: "Mon", count: 4, height: "h-16", color: "bg-sky-500" },
                    { day: "Tue", count: 7, height: "h-28", color: "bg-indigo-500" },
                    { day: "Wed", count: 9, height: "h-36", color: "bg-sky-600" },
                    { day: "Thu", count: 5, height: "h-20", color: "bg-teal-500" },
                    { day: "Fri", count: 8, height: "h-32", color: "bg-indigo-600" },
                    { day: "Sat", count: 2, height: "h-8", color: "bg-amber-500" },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2 flex-grow">
                      <div className="text-xs text-slate-400 font-semibold">{bar.count}</div>
                      <div className={`w-8 ${bar.height} ${bar.color} rounded-t-lg transition hover:brightness-110`} title={`${bar.count} appointments booked`}></div>
                      <div className="text-xs font-medium text-slate-500 pt-2">{bar.day}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Appointments table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Appointments</h2>
                <button
                  onClick={() => setSearchParams({ tab: "appointments" })}
                  className="text-xs text-sky-605 dark:text-sky-400 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              {loadingData ? (
                <p className="text-center py-6 text-sm text-slate-500">Loading appointments...</p>
              ) : appointments.length === 0 ? (
                <div className="text-center py-10 bg-slate-55 dark:bg-slate-850/20 border border-dashed border-slate-200 rounded-2xl">
                  <p className="text-slate-455 text-sm">No appointments scheduled.</p>
                  {user.role === "patient" && (
                    <button
                      onClick={() => setSearchParams({ tab: "doctors" })}
                      className="mt-3 px-4 py-1.5 bg-sky-655 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                      Book Your First Consultation
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 dark:text-slate-500 font-semibold">
                        <th className="pb-3 pr-4">Date & Time</th>
                        {user.role !== "patient" && <th className="pb-3 pr-4">Patient</th>}
                        {user.role !== "doctor" && <th className="pb-3 pr-4">Doctor</th>}
                        <th className="pb-3 pr-4">Symptoms</th>
                        <th className="pb-3 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {appointments.slice(0, 5).map((appt) => (
                        <tr key={appt._id} className="text-slate-700 dark:text-slate-300">
                          <td className="py-4 pr-4">
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {new Date(appt.appointmentDate).toLocaleDateString()}
                            </span>
                            <span className="block text-xs text-slate-450 mt-0.5">{appt.appointmentTime}</span>
                          </td>
                          {user.role !== "patient" && (
                            <td className="py-4 pr-4">
                              <span className="font-medium text-slate-850 dark:text-slate-205">
                                {appt.patient?.name || "Deleted User"}
                              </span>
                            </td>
                          )}
                          {user.role !== "doctor" && (
                            <td className="py-4 pr-4">
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {appt.doctor?.name || "Deleted Doctor"}
                                </span>
                                <span className="block text-xs text-sky-600 mt-0.5">
                                  {appt.doctor?.specialization}
                                </span>
                              </div>
                            </td>
                          )}
                          <td className="py-4 pr-4 max-w-[200px] truncate" title={appt.symptoms}>
                            {appt.symptoms}
                          </td>
                          <td className="py-4 pr-4">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                                appt.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                                  : appt.status === "Accepted"
                                  ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400"
                                  : appt.status === "Pending"
                                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                  : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                              }`}
                            >
                              {appt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* FIND DOCTORS TAB (PATIENT) */}
        {/* -------------------------------------------------------------------------------- */}
        {activeTab === "doctors" && user.role === "patient" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Find Specialists</h2>
            <p className="text-sm text-slate-500">
              Browse available approved doctors and schedule visits.
            </p>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 p-6 rounded-2xl">
              <button
                onClick={() => navigate("/doctors")}
                className="w-full py-3 bg-sky-655 hover:bg-sky-600 text-white font-bold rounded-lg shadow transition text-center"
              >
                Go to Dedicated Doctors Search Page
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* APPOINTMENTS TAB (ALL ROLES) */}
        {/* -------------------------------------------------------------------------------- */}
        {activeTab === "appointments" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Appointments History</h2>

            {loadingData ? (
              <p className="text-center py-6 text-sm text-slate-500 animate-pulse">Loading list details...</p>
            ) : appointments.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-10">No appointments scheduled.</p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="p-5 border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 hover:shadow-md transition flex flex-col md:flex-row justify-between space-y-4 md:space-y-0"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            appt.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : appt.status === "Accepted"
                              ? "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400"
                              : appt.status === "Pending"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                              : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                          }`}
                        >
                          {appt.status}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center">
                          <FiClock className="mr-1" /> {appt.appointmentTime}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center">
                          <FiCalendar className="mr-1" /> {new Date(appt.appointmentDate).toLocaleDateString()}
                        </span>
                      </div>

                      {user.role !== "patient" && (
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Patient: <span className="font-semibold text-slate-700 dark:text-slate-350">{appt.patient?.name || "Deleted User"}</span>
                          {appt.patient?.phone && <span className="text-xs text-slate-400 ml-2">({appt.patient.phone})</span>}
                        </p>
                      )}

                      {user.role !== "doctor" && (
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Doctor: <span className="font-semibold text-slate-700 dark:text-slate-350">{appt.doctor?.name || "Deleted Doctor"}</span>
                          <span className="text-xs text-sky-655 dark:text-sky-400 ml-2 font-medium">({appt.doctor?.specialization})</span>
                        </p>
                      )}

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                        <strong className="block text-slate-600 dark:text-slate-300 mb-1">Symptoms:</strong>
                        {appt.symptoms}
                      </p>

                      {appt.status === "Completed" && appt.prescription && (
                        <div className="text-xs text-emerald-800 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-950 leading-relaxed">
                          <strong className="block text-emerald-700 dark:text-emerald-350 flex items-center mb-1">
                            <FiCheckCircle className="mr-1" /> Medication Prescription:
                          </strong>
                          {appt.prescription}
                          {appt.notes && <p className="mt-1.5"><strong className="font-semibold">Doctor Notes:</strong> {appt.notes}</p>}
                        </div>
                      )}
                    </div>

                    {/* Dynamic Action Buttons */}
                    <div className="flex flex-row md:flex-col md:justify-center md:items-end space-x-2 md:space-x-0 md:space-y-2 shrink-0">
                      {user.role === "patient" && appt.status === "Pending" && (
                        <button
                          onClick={() => handleCancelAppointment(appt._id)}
                          className="px-3.5 py-1.5 border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-655 dark:text-red-400 text-xs font-semibold rounded-lg transition"
                        >
                          Cancel Appointment
                        </button>
                      )}

                      {user.role === "doctor" && appt.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(appt._id, "Accepted")}
                            className="px-3.5 py-1.5 bg-sky-655 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                          >
                            Accept Appointment
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(appt._id, "Rejected")}
                            className="px-3.5 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg transition"
                          >
                            Reject Appointment
                          </button>
                        </>
                      )}

                      {user.role === "doctor" && appt.status === "Accepted" && (
                        <button
                          onClick={() => openPrescriptionModal(appt)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                        >
                          Complete & Add Prescription
                        </button>
                      )}

                      {user.role === "admin" && (
                        <button
                          onClick={async () => {
                            if (window.confirm("Delete this appointment permanently?")) {
                              await api.delete(`/appointments/${appt._id}`);
                              toast.success("Deleted successfully.");
                              const { data } = await api.get("/appointments");
                              setAppointments(data);
                            }
                          }}
                          className="p-2 border border-red-200 text-red-600 hover:bg-red-55 rounded-lg transition"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* MANAGE SLOTS (DOCTOR ONLY) */}
        {/* -------------------------------------------------------------------------------- */}
        {activeTab === "slots" && user.role === "doctor" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Manage Slot Availabilities</h2>
            
            <form onSubmit={onProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                  Consultation Fee ($ USD)
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  defaultValue={user.profileDetails?.consultationFee}
                  required
                  onChange={(e) => updateProfile({ consultationFee: e.target.value })}
                  className="w-full sm:w-60 px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                  Consultation Time Slot Range
                </label>
                <input
                  type="text"
                  name="availableTime"
                  defaultValue={user.profileDetails?.availableTime || "09:00 AM - 05:00 PM"}
                  required
                  onChange={(e) => updateProfile({ availableTime: e.target.value })}
                  className="w-full sm:w-80 px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-sky-655 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-sm transition"
              >
                Save Availability Slots
              </button>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* EDIT PROFILE TAB (PATIENT/DOCTOR) */}
        {/* -------------------------------------------------------------------------------- */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h2>

            {/* Profile Pic Upload Section */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
              {user.profileImage ? (
                <img
                  src={`http://localhost:5000${user.profileImage}`}
                  alt="avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-100"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-150 flex items-center justify-center text-sky-655 font-bold text-xl">
                  {user.name.split(" ").map(n=>n[0]).join("")}
                </div>
              )}
              <div className="flex flex-col space-y-2 items-center sm:items-start">
                <label className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-bold rounded-lg cursor-pointer transition">
                  <FiUpload />
                  <span>Upload Profile Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[10px] text-slate-400">JPEG, PNG, or WEBP up to 2MB</span>
              </div>
            </div>

            {/* Main Form Fields */}
            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                    {...register("name", { required: "Name is required" })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Email (Read Only)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-lg text-sm cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    defaultValue={user.phone}
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                    {...register("phone")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Age</label>
                  <input
                    type="number"
                    defaultValue={user.age}
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                    {...register("age")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Gender</label>
                  <select
                    defaultValue={user.gender}
                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                    {...register("gender")}
                  >
                    <option value="">Choose gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Patient Role Specifics */}
                {user.role === "patient" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Blood Group</label>
                      <input
                        type="text"
                        placeholder="e.g. A+"
                        defaultValue={user.profileDetails?.bloodGroup}
                        className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                        {...register("bloodGroup")}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Allergies</label>
                      <input
                        type="text"
                        placeholder="e.g. Penicillin, Peanuts"
                        defaultValue={user.profileDetails?.allergies}
                        className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                        {...register("allergies")}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Address</label>
                      <input
                        type="text"
                        placeholder="Residential address"
                        defaultValue={user.profileDetails?.address}
                        className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                        {...register("address")}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Emergency Contact</label>
                      <input
                        type="text"
                        placeholder="Emergency Contact details"
                        defaultValue={user.profileDetails?.emergencyContact}
                        className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                        {...register("emergencyContact")}
                      />
                    </div>
                  </>
                )}

                {/* Doctor Role Specifics */}
                {user.role === "doctor" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Years of Experience</label>
                      <input
                        type="number"
                        defaultValue={user.profileDetails?.experience}
                        className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                        {...register("experience")}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Clinic Consultation Fee</label>
                      <input
                        type="number"
                        defaultValue={user.profileDetails?.consultationFee}
                        className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                        {...register("consultationFee")}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Hospital Clinic Clinic</label>
                      <input
                        type="text"
                        defaultValue={user.profileDetails?.hospital}
                        className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                        {...register("hospital")}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">About Bio</label>
                      <textarea
                        rows="3"
                        defaultValue={user.profileDetails?.about}
                        className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm"
                        {...register("about")}
                      ></textarea>
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-sky-655 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-sm transition"
              >
                Save Profile
              </button>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* MANAGE DOCTORS TAB (ADMIN ONLY) */}
        {/* -------------------------------------------------------------------------------- */}
        {activeTab === "doctors" && user.role === "admin" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Clinicians</h2>
              <button
                onClick={handleOpenAddDoctorModal}
                className="flex items-center space-x-1 px-4 py-2 bg-sky-655 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                <FiPlus />
                <span>Add Doctor</span>
              </button>
            </div>

            {loadingData ? (
              <p className="text-center py-6 text-sm text-slate-500">Loading doctor profiles...</p>
            ) : doctorsList.length === 0 ? (
              <p className="text-center text-sm text-slate-400">No doctors registered.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 font-semibold">
                      <th className="pb-3 pr-4">Doctor</th>
                      <th className="pb-3 pr-4">Specialization</th>
                      <th className="pb-3 pr-4">Hospital Location</th>
                      <th className="pb-3 pr-4">Consultation Fee</th>
                      <th className="pb-3 pr-4">Approval</th>
                      <th className="pb-3 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {doctorsList.map((doc) => (
                      <tr key={doc._id} className="text-slate-700 dark:text-slate-300">
                        <td className="py-4 pr-4">
                          <span className="font-semibold text-slate-900 dark:text-white">{doc.userId?.name}</span>
                          <span className="block text-xs text-slate-400 mt-0.5">{doc.userId?.email}</span>
                        </td>
                        <td className="py-4 pr-4 font-medium">{doc.specialization}</td>
                        <td className="py-4 pr-4 max-w-[150px] truncate" title={doc.hospital}>
                          {doc.hospital}
                        </td>
                        <td className="py-4 pr-4 font-bold text-slate-905 dark:text-white">${doc.consultationFee}</td>
                        <td className="py-4 pr-4">
                          <button
                            onClick={() => handleApproveDoctor(doc._id, !doc.approved)}
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                              doc.approved
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/45 dark:text-emerald-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-955/45 dark:text-amber-400"
                            }`}
                          >
                            {doc.approved ? "Approved" : "Pending"}
                          </button>
                        </td>
                        <td className="py-4 pr-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleOpenEditDoctorModal(doc)}
                              className="p-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                              title="Edit Details"
                            >
                              <FiEdit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(doc._id)}
                              className="p-1.5 border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition"
                              title="Delete Account"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* MANAGE PATIENTS TAB (ADMIN ONLY) */}
        {/* -------------------------------------------------------------------------------- */}
        {activeTab === "patients" && user.role === "admin" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Manage Patients</h2>

            {loadingData ? (
              <p className="text-center py-6 text-sm text-slate-500">Loading patients registry...</p>
            ) : patientsList.length === 0 ? (
              <p className="text-center text-sm text-slate-400">No patients registered.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-450 font-semibold">
                      <th className="pb-3 pr-4">Patient</th>
                      <th className="pb-3 pr-4">Blood Group</th>
                      <th className="pb-3 pr-4">Address</th>
                      <th className="pb-3 pr-4">Emergency Contact</th>
                      <th className="pb-3 pr-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {patientsList.map((pt) => (
                      <tr key={pt._id} className="text-slate-700 dark:text-slate-300">
                        <td className="py-4 pr-4">
                          <span className="font-semibold text-slate-900 dark:text-white">{pt.userId?.name}</span>
                          <span className="block text-xs text-slate-400 mt-0.5">{pt.userId?.email}</span>
                        </td>
                        <td className="py-4 pr-4 font-bold">{pt.bloodGroup || "—"}</td>
                        <td className="py-4 pr-4 max-w-[200px] truncate" title={pt.address}>
                          {pt.address || "—"}
                        </td>
                        <td className="py-4 pr-4">{pt.emergencyContact || "—"}</td>
                        <td className="py-4 pr-4 text-right">
                          <button
                            onClick={() => handleDeletePatient(pt._id)}
                            className="p-1.5 border border-red-200 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------------------- */}
        {/* MANAGE DEPARTMENTS TAB (ADMIN ONLY) */}
        {/* -------------------------------------------------------------------------------- */}
        {activeTab === "departments" && user.role === "admin" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Clinic Departments</h2>
            <p className="text-slate-500 text-sm mb-6">
              Listing core healthcare sections active within the hospital consultation portals.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Cardiology",
                "Neurology",
                "Orthopedics",
                "Pediatrics",
                "Dermatology",
                "ENT",
                "Gynecology",
                "General Physician",
              ].map((dept, i) => (
                <div key={i} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 font-bold text-slate-800 dark:text-slate-200 text-center">
                  {dept}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ====================================================================================== */}
      {/* MODALS */}
      {/* ====================================================================================== */}
      
      {/* Complete/Prescription Modal */}
      {prescriptionModalAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-scale-up">
            <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2 flex items-center space-x-2">
              <FiCheckCircle className="text-emerald-500" />
              <span>Complete Appointment & Write Prescription</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 border-b pb-3">
              Patient: {prescriptionModalAppt.patient?.name} | Symptoms: {prescriptionModalAppt.symptoms}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                  Medications & Dosages
                </label>
                <textarea
                  rows="4"
                  placeholder="e.g. Paracetamol 500mg twice daily for 3 days."
                  value={prescriptionInput}
                  onChange={(e) => setPrescriptionInput(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                  Clinical Advice / Practitioner Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Avoid dairy, rest for 2 days."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full px-4 py-2 text-sm border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 border-t pt-4">
                <button
                  onClick={() => setPrescriptionModalAppt(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-xs font-bold transition hover:bg-slate-55"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePrescription}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition"
                >
                  Complete Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Doctor Modal (Admin) */}
      {doctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-6">
              {editingDoctor ? "Edit Doctor Profile" : "Add New Doctor"}
            </h3>

            <form onSubmit={handleSubmit(handleDoctorFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Doctor Name</label>
                  <input
                    type="text"
                    placeholder="Dr. Full Name"
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("name", { required: true })}
                  />
                </div>

                {!editingDoctor && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Email</label>
                      <input
                        type="email"
                        placeholder="email@hospital.com"
                        className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                        {...register("email", { required: true })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Password</label>
                      <input
                        type="password"
                        placeholder="Create Password"
                        className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                        {...register("password", { required: true })}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Phone</label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("phone")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Age</label>
                  <input
                    type="number"
                    placeholder="Age"
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("age")}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Gender</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("gender")}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Specialization</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("specialization", { required: true })}
                  >
                    <option value="">Select Department</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="ENT">ENT</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="General Physician">General Physician</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Qualification</label>
                  <input
                    type="text"
                    placeholder="e.g. MBBS, MD"
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("qualification", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Experience (years)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5"
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("experience", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Consultation Fee</label>
                  <input
                    type="number"
                    placeholder="Fee ($ USD)"
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("consultationFee", { required: true })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Clinical Hours Slot Range</label>
                  <input
                    type="text"
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("availableTime")}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Hospital Clinic Location</label>
                  <input
                    type="text"
                    placeholder="Hospital clinic name"
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("hospital", { required: true })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Clinical About Bio</label>
                  <textarea
                    rows="2"
                    placeholder="Practitioner details, specializations, background..."
                    className="w-full px-4 py-2 border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-sm"
                    {...register("about")}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-2 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setDoctorModalOpen(false)}
                  className="px-4 py-2 border border-slate-205 rounded-lg text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-655 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow transition"
                >
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default Dashboard;