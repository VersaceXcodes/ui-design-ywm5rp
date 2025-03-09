import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import {
  set_active_project,
  RootState,
} from "@/store/main";

const UV_ProjectDetails: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const [projectData, setProjectData] = useState<{
    project_id: string;
    name: string;
    team_members: { user_id: string; role: string }[];
    activity_log: { id: string; message: string; timestamp: string }[];
  } | null>(null);
  const [selectedVersion, setSelectedVersion] = useState("latest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth || !auth.token) {
      navigate("/login");
      return;
    }

    const fetchProjectDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:1337/api/projects/${project_id}`,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
        setProjectData(response.data);
        dispatch(set_active_project({ project_id: response.data.project_id, name: response.data.name }));
      } catch (err) {
        setError("Failed to load project details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [project_id, auth, dispatch, navigate]);

  useEffect(() => {
    const socket = io("http://localhost:1337", { auth: { token: auth?.token } });
    socket.on("project_update", (update) => {
      if (update.project_id === project_id) {
        setProjectData((prev) => (prev ? { ...prev, ...update.change } : prev));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [project_id, auth]);

  const handleRename = async (newName: string) => {
    try {
      await axios.patch(
        `http://localhost:1337/api/projects/${project_id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setProjectData((prev) => (prev ? { ...prev, name: newName } : prev));
    } catch {
      alert("Failed to rename project.");
    }
  };

  const handleDuplicate = async () => {
    try {
      const response = await axios.post(
        `http://localhost:1337/api/projects`,
        { name: `${projectData?.name} (Copy)` },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      navigate(`/projects/${response.data.project_id}`);
    } catch {
      alert("Failed to duplicate project.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`http://localhost:1337/api/projects/${project_id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      navigate("/dashboard");
    } catch {
      alert("Failed to delete project.");
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                className="text-2xl font-bold border-none bg-transparent focus:ring-0"
                value={projectData?.name || ""}
                onChange={(e) => handleRename(e.target.value)}
              />
              <div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                  onClick={handleDuplicate}
                >
                  Duplicate
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>

            <h2 className="text-lg font-semibold">Team Members</h2>
            <ul className="bg-white shadow rounded p-4 mb-6">
              {projectData?.team_members.map((member) => (
                <li key={member.user_id} className="border-b p-2 flex justify-between">
                  <span>{member.user_id}</span>
                  <span className="text-gray-500">{member.role}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-semibold">Activity Log</h2>
            <ul className="bg-white shadow rounded p-4 mb-6">
              {projectData?.activity_log.map((log) => (
                <li key={log.id} className="border-b p-2">
                  <span className="font-semibold">{log.message}</span>
                  <span className="text-gray-500 block">{new Date(log.timestamp).toLocaleString()}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-semibold">Version History</h2>
            <select
              className="border p-2 rounded w-full"
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="v1">Version 1</option>
              <option value="v2">Version 2</option>
            </select>

            <div className="mt-4">
              <Link className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" to={`/projects/${project_id}/editor`}>
                Open Editor
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UV_ProjectDetails;