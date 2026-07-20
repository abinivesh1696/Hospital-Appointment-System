import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      
      {/* Content wrapper */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Premium Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
              <span className="text-lg font-bold text-sky-600 dark:text-sky-400">🏥 SmartCare HMS</span>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Modern Hospital Care & Service Appointment with Doctor Consultation Portal.
              </p>
            </div>
            <div className="flex space-x-6 text-sm text-slate-500 dark:text-slate-400">
              <a href="/" className="hover:text-sky-500">Home</a>
              <a href="/about" className="hover:text-sky-500">About Us</a>
              <a href="/services" className="hover:text-sky-500">Services</a>
              <a href="/contact" className="hover:text-sky-500">Contact</a>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-150 dark:border-slate-850 pt-4 text-center text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} SmartCare HMS. All rights reserved. Made for patient-doctor healthcare convenience.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;