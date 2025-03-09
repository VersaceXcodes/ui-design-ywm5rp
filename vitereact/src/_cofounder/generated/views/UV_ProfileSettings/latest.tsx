import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { RootState } from "@/store/main";
import { authenticate_user } from "@/store/main";
import { Link } from "react-router-dom";

const UV_ProfileSettings: React.FC = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  // Fetch user profile on component mount
  useEffect(() => {
    if (authUser) {
      axios
        .get("http://localhost:1337/api/user/profile", {
          headers: { Authorization: `Bearer ${authUser.token}` }
        })
        .then((response) => setProfileData(response.data))
        .catch(() => setErrorMessages({ general: "Failed to load profile." }));
    }
  }, [authUser]);

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // Save profile changes
  const handleProfileUpdate = () => {
    if (!profileData.full_name || !profileData.bio) {
      setErrorMessages({ general: "Name and bio cannot be empty." });
      return;
    }
    axios
      .patch("http://localhost:1337/api/user/profile", profileData, {
        headers: { Authorization: `Bearer ${authUser.token}` }
      })
      .then(() => {
        dispatch(authenticate_user(profileData));
        setIsEditing(false);
      })
      .catch(() => setErrorMessages({ general: "Failed to update profile." }));
  };

  // Upload new avatar
  const handleAvatarUpload = () => {
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    axios
      .post("http://localhost:1337/api/user/avatar", formData, {
        headers: { Authorization: `Bearer ${authUser.token}` }
      })
      .then((response) => setProfileData({ ...profileData, avatar_url: response.data.avatar_url }))
      .catch(() => setErrorMessages({ general: "Failed to upload avatar." }));
  };

  // Handle password update
  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      setErrorMessages({ password: "New passwords do not match." });
      return;
    }

    axios
      .post("http://localhost:1337/api/user/change-password", passwords, {
        headers: { Authorization: `Bearer ${authUser.token}` }
      })
      .then(() => setPasswords({ current: "", new: "", confirm: "" }))
      .catch(() => setErrorMessages({ password: "Failed to change password." }));
  };

  // Unlink OAuth account
  const handleUnlinkAccount = (provider: "google" | "github") => {
    axios
      .delete(`http://localhost:1337/api/user/oauth`, {
        headers: { Authorization: `Bearer ${authUser.token}` },
        data: { provider }
      })
      .then(() => setProfileData({ ...profileData, linked_accounts: { ...profileData.linked_accounts, [provider]: false } }))
      .catch(() => setErrorMessages({ general: `Failed to unlink ${provider}.` }));
  };

  if (!profileData) return <p className="text-center p-4 text-gray-500">Loading...</p>;

  return (
    <>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

        {/* Profile Section */}
        <div className="flex items-center mb-4">
          <img src={profileData.avatar_url || "https://picsum.photos/100"} alt="Avatar" className="w-24 h-24 rounded-full mr-4" />
          <div>
            <input type="file" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="border rounded p-2" />
            <button onClick={handleAvatarUpload} className="ml-3 px-4 py-2 bg-blue-500 text-white rounded">Upload</button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Full Name:</label>
          <input type="text" name="full_name" value={profileData.full_name} onChange={handleInputChange} disabled={!isEditing} className="w-full border p-2 rounded" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Email:</label>
          <input type="email" name="email" value={profileData.email} disabled className="w-full border p-2 rounded bg-gray-100" />
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Bio:</label>
          <textarea name="bio" value={profileData.bio} onChange={handleInputChange} disabled={!isEditing} className="w-full border p-2 rounded"></textarea>
        </div>

        {errorMessages.general && <p className="text-red-500">{errorMessages.general}</p>}

        {isEditing ? (
          <button onClick={handleProfileUpdate} className="px-4 py-2 bg-green-500 text-white rounded">Save Changes</button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-gray-500 text-white rounded">Edit Profile</button>
        )}

        {/* Password Section */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Change Password</h3>
          <input type="password" placeholder="Current Password" className="border p-2 w-full mb-2" onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
          <input type="password" placeholder="New Password" className="border p-2 w-full mb-2" onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
          <input type="password" placeholder="Confirm New Password" className="border p-2 w-full mb-2" onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
          {errorMessages.password && <p className="text-red-500">{errorMessages.password}</p>}
          <button onClick={handlePasswordChange} className="px-4 py-2 bg-red-500 text-white rounded">Update Password</button>
        </div>
      </div>
    </>
  );
};

export default UV_ProfileSettings;