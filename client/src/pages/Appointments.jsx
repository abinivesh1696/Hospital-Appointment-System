import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Appointments() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard?tab=appointments", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
    </div>
  );
}

export default Appointments;
