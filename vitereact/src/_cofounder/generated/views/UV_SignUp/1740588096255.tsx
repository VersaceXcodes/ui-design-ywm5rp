import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { authenticate_user } from "@/store/main";

const UV_SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for form handling
  const [form_state, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error_messages, setErrorMessages] = useState({
    email: null,
    password: null,
    confirmPassword: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...form_state, [e.target.name]: e.target.value });
  };

  // Validate form
  const validateForm = () => {
    let errors = { email: null, password: null, confirmPassword: null };
    let valid = true;

    // Email validation
    if (!/\S+@\S+\.\S+/.test(form_state.email)) {
      errors.email = "Invalid email format";
      valid = false;
    }

    // Password should meet conditions (at least 6 characters here)
    if (form_state.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      valid = false;
    }

    // Confirm password
    if (form_state.password !== form_state.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrorMessages(errors);
    return valid;
  };

  // Handle form submission
  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:1337/api/auth/signup", {
        name: form_state.name,
        email: form_state.email,
        password: form_state.password,
      });

      // Successful signup
      dispatch(authenticate_user({ user_id: response.data.user_id, token: response.data.token }));
      navigate("/dashboard");
    } catch (error) {
      // Handle error response
      setErrorMessages({
        email: error.response?.data?.error || "Signup failed",
        password: null,
        confirmPassword: null,
      });
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

          <form onSubmit={submitSignup} className="space-y-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={form_state.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={form_state.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              {error_messages.email && (
                <p className="text-red-500 text-sm">{error_messages.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={form_state.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              {error_messages.password && (
                <p className="text-red-500 text-sm">{error_messages.password}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form_state.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              {error_messages.confirmPassword && (
                <p className="text-red-500 text-sm">{error_messages.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default UV_SignUp;