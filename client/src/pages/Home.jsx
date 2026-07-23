import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { FiArrowRight, FiUsers, FiAward, FiShield, FiCalendar, FiUserPlus } from "react-icons/fi";

function Home() {
  const departments = [
    { name: "Cardiology", desc: "Heart & Vascular Care", icon: "❤️" },
    { name: "Neurology", desc: "Brain & Nervous System", icon: "🧠" },
    { name: "Orthopedics", desc: "Bone & Joint Health", icon: "🦴" },
    { name: "Pediatrics", desc: "Child Healthcare Specialists", icon: "👶" },
    { name: "Dermatology", desc: "Skin Care & Treatments", icon: "🧴" },
    { name: "ENT", desc: "Ear, Nose & Throat Clinics", icon: "👂" },
    { name: "Gynecology", desc: "Women's Health & Maternity", icon: "🤰" },
    { name: "General Physician", desc: "General Medical Consultations", icon: "🩺" },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 py-16 sm:py-24 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:flex-col lg:justify-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 w-fit mb-4">
                Now accepting online bookings
              </span>
              <h1 className="text-4xl tracking-tight font-extrabold text-[#1e2a5f] dark:text-white sm:text-5xl md:text-6xl leading-tight">
                Your Health is Our{" "}
                <span className="relative inline-block text-[#2563eb] dark:text-sky-400 pb-3">
                  First Priority
                  <svg
                    className="absolute left-0 bottom-0 w-full h-4 text-red-500 dark:text-red-400"
                    viewBox="0 0 200 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,10 H25 Q29,6 33,10 H37 L40,13 L44,0 L49,20 L52,10 H57 Q62,6 67,10 H105 Q109,6 113,10 H117 L120,13 L124,0 L129,20 L132,10 H137 Q142,6 147,10 H200" />
                  </svg>
                </span>
              </h1>
              <p className="mt-4 text-base text-slate-500 dark:text-slate-450 sm:mt-5 sm:text-xl lg:text-lg">
                Connect with highly qualified doctors across departments. Book appointments instantly, check consultation fees, and access all prescriptions in one place.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start">
                  <Link
                    to="/doctors"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 shadow-md hover:shadow-lg transition-all"
                  >
                    Find a Doctor
                    <FiArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/doctors"
                    className="inline-flex items-center justify-center px-6 py-3 border border-sky-200 dark:border-sky-800 text-base font-medium rounded-lg text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-950/50 transition-all"
                  >
                    Book Appointment
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-700 text-base font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    Join as Patient
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Visual Right side */}
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-2xl filter blur-2xl opacity-15 dark:opacity-10 transform scale-95"></div>
                <div className="relative bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xl overflow-hidden p-6 glass">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">🏥 Core Clinic Hours</span>
                    <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">Open Daily</span>
                  </div>
                  <div className="space-y-3 mt-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Monday - Friday</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">09:00 AM - 07:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Saturday</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">09:00 AM - 05:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Sunday</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Emergency Care Only</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Need Immediate Advice?</p>
                    <p className="text-lg font-bold text-sky-600 dark:text-sky-400 mt-1">+91 9514063456</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-100 dark:bg-slate-900/50 py-12 border-y border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white dark:bg-slate-800 px-6 py-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-sky-100 dark:bg-sky-950 rounded-xl text-sky-600 dark:text-sky-400">
                <FiUsers className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">1k+</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Happy Patients Serviced</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 px-6 py-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-teal-100 dark:bg-teal-950 rounded-xl text-teal-600 dark:text-teal-400">
                <FiAward className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">10+</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Specialist Physicians</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 px-6 py-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950 rounded-xl text-indigo-600 dark:text-indigo-400">
                <FiShield className="w-8 h-8" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">100%</p>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Verified Certifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="py-16 sm:py-24 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Quick Booking and Doctor Setup</h2>
            <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
              Use the booking path to schedule an appointment, or open the admin panel to add and manage doctor profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                  <FiCalendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Book a Doctor</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Select a specialist and reserve a consultation slot.</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start space-x-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Search by department or doctor name from the doctors page.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="mt-1 w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Open a doctor profile to enter date, time, and symptoms.</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/doctors"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition"
                >
                  Browse Doctors
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Open Booking Flow
                </Link>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <FiUserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add a Doctor</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Admin users can create a new doctor profile in the dashboard.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-emerald-200 dark:border-emerald-900 bg-white/70 dark:bg-slate-900/40 p-4 text-sm text-slate-600 dark:text-slate-300">
                <p className="font-semibold text-slate-900 dark:text-white mb-2">Sample doctor entry</p>
                <p>Name: Dr. Meera Sharma</p>
                <p>Specialization: Cardiology</p>
                <p>Fee: $50 | Hospital: SmartCare Central</p>
                <p className="mt-2 text-xs text-slate-400">This mirrors the form in Dashboard &gt; Manage Doctors.</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/dashboard?tab=doctors"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
                >
                  Open Add Doctor Panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Section */}
      <div className="py-16 sm:py-24 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Our Departments</h2>
            <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
              Select a specialized field to browse certified doctors, view consultation schedules, and quick book direct appointments.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <Link
                key={index}
                to={`/doctors?specialization=${encodeURIComponent(dept.name)}`}
                className="group flex flex-col p-6 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/60 rounded-2xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 hover:border-sky-300 dark:hover:border-sky-800 transition-all duration-200"
              >
                <span className="text-3xl mb-4 group-hover:scale-110 transition duration-200">{dept.icon}</span>
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400">
                  {dept.name}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {dept.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;