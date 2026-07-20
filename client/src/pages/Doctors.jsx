import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";
import { FiSearch, FiMapPin, FiClock, FiDollarSign } from "react-icons/fi";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and Filter local state, initialized from URL search params
  const [searchVal, setSearchVal] = useState(searchParams.get("search") || "");
  const [specVal, setSpecVal] = useState(searchParams.get("specialization") || "");

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

  // Fetch doctors whenever search params change
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const search = searchParams.get("search");
        const spec = searchParams.get("specialization");

        if (search) queryParams.append("search", search);
        if (spec) queryParams.append("specialization", spec);
        
        // Only approved doctors for public view
        queryParams.append("approved", "true");

        const { data } = await api.get(`/doctors?${queryParams.toString()}`);
        setDoctors(data);
        setError(null);
      } catch (err) {
        console.error("Fetch doctors failed:", err);
        setError("Failed to fetch doctors list. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchVal) {
      newParams.set("search", searchVal);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleSpecChange = (e) => {
    const spec = e.target.value;
    setSpecVal(spec);
    const newParams = new URLSearchParams(searchParams);
    if (spec) {
      newParams.set("specialization", spec);
    } else {
      newParams.delete("specialization");
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchVal("");
    setSpecVal("");
    setSearchParams({});
  };

  return (
    <MainLayout>
      <div className="py-12 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Certified Specialists</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Browse qualified physicians, select filters, and book consultation timings.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-center shadow-sm">
            <form onSubmit={handleSearchSubmit} className="relative flex-grow w-full">
              <input
                type="text"
                placeholder="Search doctors by name..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <FiSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
            </form>

            <div className="w-full sm:w-60">
              <select
                value={specVal}
                onChange={handleSpecChange}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="">All Departments</option>
                {specializations.map((spec, i) => (
                  <option key={i} value={spec}>
                    {spec
                  }</option>
                ))}
              </select>
            </div>

            {(searchVal || specVal) && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline px-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Error and Loading indicators */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-slate-550">Searching clinicians...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-2xl">
              <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/10 border border-dashed border-slate-300 rounded-2xl">
              <p className="text-slate-500 text-sm">No doctors match your filters or search query.</p>
              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-semibold rounded-lg transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Doctor Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="p-6">
                    {/* Header info */}
                    <div className="flex items-center space-x-4 mb-4">
                      {doc.userId?.profileImage ? (
                        <img
                          src={`http://localhost:5000${doc.userId.profileImage}`}
                          alt={doc.userId.name}
                          className="w-16 h-16 rounded-full object-cover border border-sky-100"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600 font-bold text-lg border border-sky-100">
                          {doc.userId?.name ? doc.userId.name.split(" ").map(n=>n[0]).join("") : "DR"}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                          {doc.userId?.name || "Dr. Staff"}
                        </h3>
                        <span className="inline-block mt-1 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-0.5 rounded-full">
                          {doc.specialization}
                        </span>
                      </div>
                    </div>

                    {/* Quick description info */}
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 truncate">
                      {doc.qualification}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                      {doc.about || "No biography provided. Click to view booking detail slots."}
                    </p>

                    {/* Metadata specs */}
                    <div className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="text-slate-400 shrink-0" />
                        <span className="truncate">{doc.hospital}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiClock className="text-slate-400 shrink-0" />
                        <span>{doc.availableTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FiDollarSign className="text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          ${doc.consultationFee} consultation fee
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700">
                    <Link
                      to={`/doctors/${doc._id}`}
                      className="block text-center w-full py-2 bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition"
                    >
                      View Profile & Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Doctors;
