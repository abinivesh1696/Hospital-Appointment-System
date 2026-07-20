import MainLayout from "../layouts/MainLayout";
import { FiHeart, FiUserCheck, FiTarget } from "react-icons/fi";

function About() {
  const values = [
    {
      title: "Patient Centricity",
      desc: "Every clinical decision and tool is built focusing entirely on safety, confidentiality, and convenience of patients.",
      icon: <FiHeart className="w-6 h-6 text-rose-500" />,
      color: "bg-rose-50 dark:bg-rose-950/20",
    },
    {
      title: "Qualified Practitioners",
      desc: "We host board-certified specialists with vetted credentials, ensuring highest standards of care and accuracy.",
      icon: <FiUserCheck className="w-6 h-6 text-emerald-500" />,
      color: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Mission Excellence",
      desc: "Connecting families to physicians instantly. Streamlining appointments to reduce wait times and administrative backlogs.",
      icon: <FiTarget className="w-6 h-6 text-sky-500" />,
      color: "bg-sky-50 dark:bg-sky-950/20",
    },
  ];

  return (
    <MainLayout>
      <div className="py-16 sm:py-24 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">About SmartCare HMS</h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              <h2 className="font-bold"> Hospital Management System  </h2> We bridge the gap between patients and specialized physicians, providing a high Healthcare digital environment for scheduling consultation checkup.
            </p>
          </div>

          {/* Details Column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Overview of SmartCare HMS
              </h2>
              <p className="text-slate-550 dark:text-slate-400 leading-relaxed mb-4">
                Founded in 2026, SmartCare HMS (Hospital Management System) operates as an all-in-one patient reservation platform, hosting clinical records, available day-slot scheduling, and instant prescription downloads.
              </p>
              <p className="text-slate-550 dark:text-slate-400 leading-relaxed">
                Whether you need general advice, cardiovascular inspections, skin consultations, or pediatric help, our system ensures you match with the right doctors and get approved slots in minutes.
              </p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 glass">
              <span className="text-sky-655 dark:text-sky-400 text-lg font-bold block mb-2">Our Vision</span>
              <p className="text-slate-600 dark:text-slate-350 italic">
                "To transform ourselves into a center of excellence in healthcare service, values clinical time, and automates records keeping."
              </p>
              <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-sky-100 dark:bg-sky-950 rounded-full flex items-center justify-center text-sky-600 font-bold">CS</div>
                <div>
                  <span className="font-semibold text-slate-850 dark:text-slate-200 block text-sm">Medical Board Panel</span>
                  <span className="text-xs text-slate-400">SmartCare HMS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Value Cards */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-16">
            <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-10">Our Core Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-750 p-6 rounded-2xl shadow-sm hover:shadow-md transition"
                >
                  <div className={`p-3 w-fit rounded-xl ${v.color} mb-4`}>
                    {v.icon}
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{v.title}</h4>
                  <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default About;
