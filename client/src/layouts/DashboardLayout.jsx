import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FiMenu, FiX } from "react-icons/fi";

function DashboardLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-grow relative">
        {/* Desktop Sidebar (Hidden on Mobile) */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Slider Drawer */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            ></div>

            {/* Content drawer */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-slate-900 shadow-xl animate-slide-in">
              <div className="absolute top-0 right-0 -mr-12 pt-4">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white bg-slate-850"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <FiX className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="h-full overflow-y-auto" onClick={() => setMobileSidebarOpen(false)}>
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile subheader with menu button */}
          <div className="md:hidden flex items-center bg-white dark:bg-slate-905 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <span className="ml-3 text-sm font-semibold text-slate-600 dark:text-slate-400">
              Dashboard Navigation
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
