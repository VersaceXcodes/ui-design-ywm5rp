import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, logout_user } from "@/store/main";
import axios from "axios";

const GV_TopNavigation: React.FC = () => {
  // Global state
  const authUser = useSelector((state: RootState) => state.auth);
  const notifications = useSelector((state: RootState) => state.notifications);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isNotificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!isUserMenuOpen);
    setNotificationsDropdownOpen(false);
  };

  // Toggle notifications dropdown
  const toggleNotificationsDropdown = () => {
    setNotificationsDropdownOpen(!isNotificationsDropdownOpen);
    setUserMenuOpen(false);
  };

  // Handle search
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:1337/api/projects?search=${searchQuery}`, {
        headers: { Authorization: `Bearer ${authUser?.token}` },
      });
      console.log("Search Results:", response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout_user());
    navigate("/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md px-6 py-3 flex items-center justify-between z-50">
        {/* Platform Branding */}
        <Link to="/dashboard" className="font-bold text-xl text-gray-900">
          AI SaaS UI Platform
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex-1 mx-6 max-w-xl">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-gray-500">
            🔍
          </button>
        </form>

        {/* Navigation Icons and User Profile */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <div className="relative">
            <button onClick={toggleNotificationsDropdown} className="relative text-gray-600 hover:text-gray-900">
              🔔
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {notifications.length}
                </span>
              )}
            </button>
            {isNotificationsDropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg p-3">
                <h3 className="text-gray-900 font-bold pb-2 border-b">Notifications</h3>
                {notifications.length > 0 ? (
                  <ul>
                    {notifications.map((notification, index) => (
                      <li key={index} className="py-2 text-sm text-gray-700 border-b last:border-b-0">
                        {notification.message}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No new notifications</p>
                )}
              </div>
            )}
          </div>

          {/* Create New Project */}
          <Link to="/projects/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            + New Project
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button onClick={toggleUserMenu} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <span>{authUser?.user_id}</span> ⚙️
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg p-3">
                <Link to="/profile" className="block py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md">
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-sm text-red-600 hover:bg-red-100 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from being covered */}
      <div className="h-16"></div>
    </>
  );
};

export default GV_TopNavigation;