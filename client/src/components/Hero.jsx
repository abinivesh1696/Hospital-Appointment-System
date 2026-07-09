import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="container text-center mt-5">
      <h1>Book Your Hospital Appointment</h1>

      <p className="mt-3">
        Find doctors, schedule appointments, and manage your health online.
      </p>

      <Link to="/login" className="btn btn-primary mt-3">
        Book Appointment
      </Link>
    </div>
  );
}

export default Hero;