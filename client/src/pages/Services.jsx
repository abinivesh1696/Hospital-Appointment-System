import MainLayout from "../layouts/MainLayout";
import { FiClock, FiActivity, FiLayers, FiFileText } from "react-icons/fi";

function Services() {
  const list = [
    {
      title: "Online Appointment Booking",
      desc: "Search, filter by specialization, and select preferred days to schedule sessions in real time.",
      icon: <FiClock className="w-6 h-6 text-sky-500" />,
    },
    {
      title: "Vetted Specialist Diagnostics",
      desc: "Consult with approved doctors in Cardiology, Neurology, Pediatrics, Orthopedics, and Gynecology.",
      icon: <FiActivity className="w-6 h-6 text-teal-500" />,
    },
    {
      title: "Multi-Role Dashboard Panels",
      desc: "Specific, responsive sidebars for Patients (history), Doctors (timing/prescription), and Admins (stats/approvals).",
      icon: <FiLayers className="w-6 h-6 text-purple-500" />,
    },
    {
      title: "Prescription & Notes Management",
      desc: "Access medication dosage guides and health charts directly on your profile immediately after appointment completion.",
      icon: <FiFileText className="w-6 h-6 text-indigo-500" />,
    },
  ];

  return (
    <MainLayout>
      <div className="py-16 sm:py-24 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Our Healthcare Services</h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Modern digital infrastructure connecting patients and clinical professionals seamlessly.
            </p>
          </div>

          {/* Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {list.map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-50 dark:bg-slate-800/10 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex items-start space-x-5 hover:bg-white dark:hover:bg-slate-800/30 hover:shadow-lg transition-all duration-200"
              >
                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  {s.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dummy FAQ Section */}
          <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 rounded-2xl p-8 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Looking for Corporate Solutions?</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 max-w-2xl mx-auto">
              Get customized hospital administration setups, dedicated clinic lines, and premium patient dashboard controls for your healthcare facility.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-sm font-semibold rounded-lg shadow-sm transition"
            >
              Contact Administrative Operations
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Services;
