import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { authenticate_user } from "@/store/main";

const UV_SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for form and error messages
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    email: null as string | null,
    password: null as string | null,
    confirmPassword: null as string | null,
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  // Validate form before submission
  const validateForm = () => {
    let isValid = true;
    let errors = { email: null, password: null, confirmPassword: null };

    if (!formState.email.includes("@")) {
      errors.email = "Invalid email format.";
      isValid = false;
    }

    if (formState.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    if (formState.password !== formState.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrorMessages(errors);
    return isValid;
  };

  // Handle Signup Submission
  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:1337/api/auth/signup", {
        name: formState.name,
        email: formState.email,
        password: formState.password,
      });

      dispatch(authenticate_user({ user_id: response.data.user_id, token: response.data.token }));
      navigate("/dashboard");
    } catch (error) {
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-center text-2xl font-semibold text-gray-700">Create an Account</h2>

          <form onSubmit={submitSignup} className="mt-4">
            <div className="mb-4">
              <label className="block text-gray-600 text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md"
              />
              {errorMessages.email && <p className="text-red-500 text-xs mt-1">{errorMessages.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md"
              />
              {errorMessages.password && <p className="text-red-500 text-xs mt-1">{errorMessages.password}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-600 text-sm">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formState.confirmPassword}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md"
              />
              {errorMessages.confirmPassword && <p className="text-red-500 text-xs mt-1">{errorMessages.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
          </p>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 p-2 border rounded-md flex items-center justify-center gap-2">
              <img src="https://picsum.photos/20/20?random=1" alt="Google" className="w-5 h-5" />
              Google
            </button>

            <button className="flex-1 p-2 border rounded-md flex items-center justify-center gap-2">
              <img src="https://picsum.photos/20/20?random=2" alt="GitHub" className="w-5 h-5" />
              GitHub
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_SignUp;