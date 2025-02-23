import React from "react";
import "../../src/index.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="text-center p-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Our Library
        </h1>
        <p className="text-gray-600 mt-2">
          Manage books, borrow, and explore new knowledge.
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex space-x-4">
        <Link
          to="/register"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-900 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
