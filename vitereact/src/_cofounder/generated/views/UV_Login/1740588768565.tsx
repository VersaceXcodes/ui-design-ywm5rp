import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { authenticate_user } from "@/store/main";

const UV_Login: React.FC = () => {
  const [form_state, setFormState] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error_message, setErrorMessage] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await axios.post("http://localhost:1337/api/auth/login", {
        email: form_state.email,
        password: form_state.password,
      });

      dispatch(authenticate_user({
        user_id: response.data.user_id,
        token: response.data.token,
      }));

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
        <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

          {error_message && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {error_message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form_state.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form_state.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form_state.rememberMe}
                  onChange={handleChange}
                  className="mr-2"
                />
                Remember Me
              </label>
              <Link to="/password-reset" className="text-sm text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition"
            >
              Login
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_Login;