import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/main";
import axios from "axios";
import { io } from "socket.io-client";

const UV_TeamManagement: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const activeProject = useSelector((state: RootState) => state.project);
  const [teamMembers, setTeamMembers] = useState<{ user_id: string; name: string; role: string; email: string; status: string }[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeProject?.project_id) {
      fetchTeamMembers();
    }
    const socket = io("http://localhost:1337", { auth: { token: auth?.token } });
    socket.on("user_presence", () => fetchTeamMembers());
    return () => {
      socket.disconnect();
    };
  }, [activeProject]);

  const fetchTeamMembers = async () => {
    if (!activeProject?.project_id) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:1337/api/projects/${activeProject.project_id}/team`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members", error);
    }
    setIsLoading(false);
  };

  const inviteMember = async () => {
    if (!inviteEmail.trim()) {
      setInviteError("Email cannot be empty");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `http://localhost:1337/api/projects/${activeProject?.project_id}/team/invite`,
        { email: inviteEmail },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setInviteEmail("");
      setInviteError("");
      fetchTeamMembers();
    } catch (error) {
      setInviteError("Failed to invite member");
      console.error(error);
    }
    setIsLoading(false);
  };

  const updateMemberRole = async (userId: string, newRole: string) => {
    if (!activeProject?.project_id) return;
    try {
      await axios.patch(
        `http://localhost:1337/api/projects/${activeProject.project_id}/team/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to update role", error);
    }
  };

  const removeMember = async (userId: string) => {
    if (!activeProject?.project_id) return;
    try {
      await axios.delete(`http://localhost:1337/api/projects/${activeProject.project_id}/team/${userId}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      fetchTeamMembers();
    } catch (error) {
      console.error("Failed to remove member", error);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Manage Team</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Invite Member</h3>
          <div className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email"
              className="border p-2 flex-1 rounded"
            />
            <button onClick={inviteMember} className="bg-blue-600 text-white px-4 py-2 rounded">
              Invite
            </button>
          </div>
          {inviteError && <p className="text-red-600 mt-2">{inviteError}</p>}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Team Members</h3>
          {isLoading ? (
            <p>Loading team members...</p>
          ) : (
            <ul className="space-y-4">
              {teamMembers.map((member) => (
                <li key={member.user_id} className="flex justify-between items-center border p-3 rounded">
                  <div>
                    <p className="font-semibold">{member.name} ({member.email})</p>
                    <p className="text-sm text-gray-600">Status: {member.status}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <select
                      value={member.role}
                      onChange={(e) => updateMemberRole(member.user_id, e.target.value)}
                      className="border rounded p-1"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={() => removeMember(member.user_id)} className="bg-red-600 text-white px-3 py-1 rounded">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default UV_TeamManagement;