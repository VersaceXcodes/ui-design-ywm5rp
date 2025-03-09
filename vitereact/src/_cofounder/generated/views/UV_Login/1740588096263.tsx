import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authenticate_user } from "@/store/main";
import { RootState } from "@/store/main";

const UV_Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth);

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect if already authenticated
  if (authUser) {
    navigate("/dashboard");
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formState.email || !formState.password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:1337/api/auth/login", {
        email: formState.email,
        password: formState.password,
      });

      dispatch(authenticate_user(response.data));
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Login failed. Try again.");
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
          
          {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formState.rememberMe}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Remember Me</label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>

          {/* OAuth Login Button (Placeholder) */}
          <div className="text-center mt-4">
            <button className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400">
              Sign in with Google
            </button>
          </div>

          {/* Extra Links */}
          <div className="flex justify-between mt-4 text-sm">
            <Link to="/password-reset" className="text-blue-600 hover:underline">Forgot Password?</Link>
            <Link to="/signup" className="text-blue-600 hover:underline">Create an Account</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_Login;