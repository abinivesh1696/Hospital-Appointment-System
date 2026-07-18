import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
  FiGrid,
  FiCalendar,
  FiUser,
  FiSearch,
  FiClock,
  FiUsers,
  FiBriefcase,
  FiFolder,
} from "react-icons/fi";

function Sidebar() {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  if (!user) return null;

  const itemClass = (tab) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      activeTab === tab
        ? "bg-sky-600 text-white shadow-lg shadow-sky-500/20"
        : "text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400"
    }`;

  // Role based navigation menus
  const renderPatientMenu = () => (
    <>
      <Link to="/dashboard?tab=overview" className={itemClass("overview")}>
        <FiGrid className="w-5 h-5" />
        <span>Dashboard</span>
      </Link>
      <Link to="/dashboard?tab=doctors" className={itemClass("doctors")}>
        <FiSearch className="w-5 h-5" />
        <span>Find & Book Doctors</span>
      </Link>
      <Link to="/dashboard?tab=appointments" className={itemClass("appointments")}>
        <FiCalendar className="w-5 h-5" />
        <span>My Appointments</span>
      </Link>
      <Link to="/dashboard?tab=profile" className={itemClass("profile")}>
        <FiUser className="w-5 h-5" />
        <span>My Profile</span>
      </Link>
    </>
  );

  const renderDoctorMenu = () => (
    <>
      <Link to="/dashboard?tab=overview" className={itemClass("overview")}>
        <FiGrid className="w-5 h-5" />
        <span>Dashboard</span>
      </Link>
      <Link to="/dashboard?tab=appointments" className={itemClass("appointments")}>
        <FiCalendar className="w-5 h-5" />
        <span>All Appointments</span>
      </Link>
      <Link to="/dashboard?tab=slots" className={itemClass("slots")}>
        <FiClock className="w-5 h-5" />
        <span>Manage Slots</span>
      </Link>
      <Link to="/dashboard?tab=profile" className={itemClass("profile")}>
        <FiUser className="w-5 h-5" />
        <span>Edit Doctor Profile</span>
      </Link>
    </>
  );

  const renderAdminMenu = () => (
    <>
      <Link to="/dashboard?tab=overview" className={itemClass("overview")}>
        <FiGrid className="w-5 h-5" />
        <span>Dashboard</span>
      </Link>
      <Link to="/dashboard?tab=doctors" className={itemClass("doctors")}>
        <FiBriefcase className="w-5 h-5" />
        <span>Manage Doctors</span>
      </Link>
      <Link to="/dashboard?tab=patients" className={itemClass("patients")}>
        <FiUsers className="w-5 h-5" />
        <span>Manage Patients</span>
      </Link>
      <Link to="/dashboard?tab=appointments" className={itemClass("appointments")}>
        <FiCalendar className="w-5 h-5" />
        <span>All Appointments</span>
      </Link>
      <Link to="/dashboard?tab=departments" className={itemClass("departments")}>
        <FiFolder className="w-5 h-5" />
        <span>Departments</span>
      </Link>
    </>
  );

  return (
    <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between transition-colors duration-200">
      <div className="space-y-2">
        <div className="px-4 py-2 mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu ({user.role})
          </p>
        </div>
        
        {user.role === "patient" && renderPatientMenu()}
        {user.role === "doctor" && renderDoctorMenu()}
        {user.role === "admin" && renderAdminMenu()}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-850 pt-4 px-4 text-xs text-slate-450 dark:text-slate-500">
        Logged in as <span className="font-semibold text-sky-655 dark:text-sky-400 capitalize">{user.role}</span>
      </div>
    </div>
  );
}

export default Sidebar;
