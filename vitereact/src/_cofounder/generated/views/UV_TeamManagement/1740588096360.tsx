import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/store/main";

const UV_TeamManagement: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();
  const auth = useSelector((state: RootState) => state.auth);
  const [teamMembers, setTeamMembers] = useState<
    { user_id: string; name: string; role: string; email: string; status: string }[]
  >([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [inviteError, setInviteError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    if (!project_id) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:1337/api/projects/${project_id}/team`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch team", error);
    }
    setIsLoading(false);
  };

  const inviteMember = async () => {
    if (!inviteEmail.trim() || !project_id) {
      setInviteError("Please enter a valid email.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        `http://localhost:1337/api/projects/${project_id}/team/invite`,
        { email: inviteEmail, role: inviteRole },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setInviteEmail("");
      setInviteError("");
      fetchTeamMembers();
    } catch (error) {
      setInviteError("Failed to send invite.");
      console.error("Invite error:", error);
    }
    setIsLoading(false);
  };

  const updateMemberRole = async (user_id: string, newRole: string) => {
    if (!project_id) return;

    setIsLoading(true);
    try {
      await axios.patch(
        `http://localhost:1337/api/projects/${project_id}/team/${user_id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
    setIsLoading(false);
  };

  const removeMember = async (user_id: string) => {
    if (!project_id) return;

    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:1337/api/projects/${project_id}/team/${user_id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to remove user:", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-xl font-bold mb-4">Team Management</h1>

        <div className="bg-white shadow p-4 rounded-md mb-6">
          <h2 className="text-lg font-semibold mb-2">Invite New Member</h2>
          <div className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email"
              className="border p-2 rounded flex-1"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={inviteMember} className="bg-blue-600 text-white px-4 py-2 rounded">
              Invite
            </button>
          </div>
          {inviteError && <p className="text-red-600 mt-2">{inviteError}</p>}
        </div>

        <div className="bg-white shadow p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Team Members</h2>
          {isLoading ? (
            <p>Loading team members...</p>
          ) : (
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Role</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.user_id} className="text-center">
                    <td className="border p-2">{member.name}</td>
                    <td className="border p-2">{member.email}</td>
                    <td className="border p-2">
                      <select
                        value={member.role}
                        onChange={(e) => updateMemberRole(member.user_id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => removeMember(member.user_id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default UV_TeamManagement;