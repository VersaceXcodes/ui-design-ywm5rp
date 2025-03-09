import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UV_PasswordReset: React.FC = () => {
  // State management
  const [form_state, setFormState] = useState({ email: "" });
  const [success_message, setSuccessMessage] = useState<string | null>(null);
  const [error_message, setErrorMessage] = useState<string | null>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...form_state, email: e.target.value });
    setSuccessMessage(null); // Reset messages on user input
    setErrorMessage(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form_state.email.trim()) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:1337/api/auth/reset-password", {
        email: form_state.email,
      });

      if (response.status === 200) {
        setSuccessMessage("A password reset email has been sent.");
        setErrorMessage(null);
      }
    } catch (error) {
      setErrorMessage("Failed to send reset email. Please try again.");
      setSuccessMessage(null);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Reset Your Password</h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your email below to receive a password reset link.
          </p>

          {/* Success Message */}
          {success_message && (
            <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded">
              {success_message}
            </div>
          )}

          {/* Error Message */}
          {error_message && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
              {error_message}
            </div>
          )}

          {/* Password Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form_state.email}
                onChange={handleChange}
                className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-lg transition hover:bg-blue-700 disabled:opacity-50"
              disabled={!form_state.email}
            >
              Send Reset Link
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-4">
            <Link to="/login" className="text-blue-600 hover:underline text-sm">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_PasswordReset;