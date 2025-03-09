import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/main";
import axios from "axios";
import { authenticate_user } from "@/store/main";
import { Link } from "react-router-dom";

const UV_ProfileSettings: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState({
    user_id: "",
    full_name: "",
    email: "",
    avatar_url: "",
    bio: "",
    password_change_requested: false,
    linked_accounts: { google: false, github: false },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errorMessages, setErrorMessages] = useState<{ field: string; message: string }[]>([]);

  useEffect(() => {
    if (auth) {
      fetchUserProfile();
    }
  }, [auth]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("http://localhost:1337/api/user/profile", {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      setProfileData(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);

    try {
      const response = await axios.post("http://localhost:1337/api/user/avatar", formData, {
        headers: { Authorization: `Bearer ${auth?.token}`, "Content-Type": "multipart/form-data" }
      });
      setProfileData({ ...profileData, avatar_url: response.data.avatar_url });
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.patch("http://localhost:1337/api/user/profile", profileData, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      setIsEditing(false);
      dispatch(authenticate_user({ user_id: profileData.user_id, token: auth?.token }));
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.post("http://localhost:1337/api/user/change-password", {}, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      setProfileData({ ...profileData, password_change_requested: true });
    } catch (error) {
      console.error("Password change request failed:", error);
    }
  };

  const handleUnlinkAccount = async (provider: "google" | "github") => {
    try {
      await axios.delete(`http://localhost:1337/api/user/oauth?provider=${provider}`, {
        headers: { Authorization: `Bearer ${auth?.token}` }
      });
      setProfileData({ ...profileData, linked_accounts: { ...profileData.linked_accounts, [provider]: false } });
    } catch (error) {
      console.error("Failed to unlink account:", error);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">Profile Settings</h1>

        <div className="flex items-center space-x-4 mb-6">
          <img src={profileData.avatar_url || "https://picsum.photos/100"} alt="Avatar" className="w-20 h-20 rounded-full" />
          {isEditing && (
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
              Upload New
              <input type="file" className="hidden" onChange={handleAvatarUpload} />
            </label>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={profileData.full_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded mt-1 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              disabled
              className="w-full border p-2 rounded mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded mt-1 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-4 flex space-x-4">
          {isEditing ? (
            <>
              <button onClick={handleSaveChanges} className="bg-green-500 text-white px-4 py-2 rounded">Save Changes</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
          )}
        </div>

        <h2 className="text-xl font-semibold mt-6">Account Security</h2>
        <button onClick={handleChangePassword} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
          Change Password
        </button>

        <h2 className="text-xl font-semibold mt-6">Linked Accounts</h2>
        <button onClick={() => handleUnlinkAccount("google")} className="bg-gray-500 text-white px-4 py-2 rounded mt-2">
          Unlink Google
        </button>
        <button onClick={() => handleUnlinkAccount("github")} className="bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2">
          Unlink GitHub
        </button>
      </div>
    </>
  );
};

export default UV_ProfileSettings;