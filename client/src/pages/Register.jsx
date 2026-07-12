import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Register() {
  return (
      <MainLayout>
      <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Register</h2>

        <form>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
      </MainLayout>
  );
}

export default Register;