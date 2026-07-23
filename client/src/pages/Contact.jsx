import MainLayout from "../layouts/MainLayout";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Contact Enquiry Submitted:", data);
    toast.success("Thank you! Your inquiry has been received. Our support team will write back shortly.", {
      position: "top-right",
      autoClose: 5000,
    });
    reset();
  };

  return (
    <MainLayout>
      <ToastContainer />
      <div className="py-16 sm:py-24 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Get in Touch</h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Have questions about appointment booking, hospital registrations, or administrative approval?
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-sky-100 dark:bg-sky-950/40 rounded-xl text-sky-655">
                  <FiMail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block">Email Support</span>
                  <a href="mailto:support@smartcarehms.com" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-sky-600">
                    support@smartcarehms.com
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl text-emerald-650">
                  <FiPhone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block">Helpline Phone</span>
                  <a href="tel:+18005550190" className="text-sm font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-600">
                    +91 8248633996
                  </a>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-950/40 rounded-xl text-amber-600">
                  <FiMapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block">HQ Clinic Address</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    123 Health Avenue, Chennai, Tamil Nadu, India
                  </span>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-800/40 border border-slate-250 dark:border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-md glass">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Send an Inquiry</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                      errors.name ? "border-red-500" : "border-slate-250 dark:border-slate-700"
                    }`}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                      errors.email ? "border-red-500" : "border-slate-250 dark:border-slate-700"
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Type details of your enquiry..."
                    className={`w-full px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                      errors.message ? "border-red-500" : "border-slate-250 dark:border-slate-700"
                    }`}
                    {...register("message", { required: "Message is required" })}
                  ></textarea>
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-sky-655 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-lg shadow transition"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Contact;
