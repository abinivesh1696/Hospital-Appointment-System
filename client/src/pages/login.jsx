import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

function Login() {
  return (
    <MainLayout>
      <div className="container mt-5" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>

        <form>
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
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </MainLayout>
  );
}

export default Login;