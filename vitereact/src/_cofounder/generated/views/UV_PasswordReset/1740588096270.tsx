import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UV_PasswordReset: React.FC = () => {
  const [form_state, setFormState] = useState({ email: "" });
  const [success_message, setSuccessMessage] = useState<string | null>(null);
  const [error_message, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!form_state.email.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:1337/api/auth/reset-password", {
        email: form_state.email
      });

      if (response.status === 200) {
        setSuccessMessage("Password reset link has been sent to your email.");
        setFormState({ email: "" });
      }
    } catch (error) {
      setErrorMessage("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Reset Password</h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Enter your email and we’ll send you a password reset link.
          </p>
          
          {success_message && <p className="text-green-600 text-sm mb-4">{success_message}</p>}
          {error_message && <p className="text-red-600 text-sm mb-4">{error_message}</p>}

          <form onSubmit={requestPasswordReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form_state.email}
                onChange={(e) => setFormState({ email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-blue-600 text-white py-2 rounded-lg transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-4 text-center">
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