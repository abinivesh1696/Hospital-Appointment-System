import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center text-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 rounded-3xl max-w-md w-full shadow-lg glass">
          <span className="text-6xl block mb-6 animate-bounce">🔍</span>
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-2">404</h1>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Page Not Found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="inline-block w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-sm text-sm transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

export default NotFound;
