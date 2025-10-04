// src/pages/ErrorPage.jsx
import { Link } from "react-router-dom";

const ErrorPage = () => (
  <div className="text-center py-20">
    <h1 className="text-5xl font-bold text-red-600 mb-6">404</h1>
    <p className="text-lg mb-6">Oops! Page not found.</p>
    <Link to="/" className="bg-primary text-white px-6 py-3 rounded-md">
      Back to Home
    </Link>
  </div>
);

export default ErrorPage;
