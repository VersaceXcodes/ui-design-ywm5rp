import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { RootState, set_active_project } from "@/store/main";
import { io } from "socket.io-client";

const UV_ProjectDetails: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const auth = useSelector((state: RootState) => state.auth);
  const activeProject = useSelector((state: RootState) => state.project);

  const [projectData, setProjectData] = useState<{
    project_id: string;
    name: string;
    team_members: { user_id: string; role: string }[];
    activity_log: { id: string; message: string; timestamp: string }[];
  } | null>(null);

  const [selectedVersion, setSelectedVersion] = useState<string>("latest");

  useEffect(() => {
    if (!auth || !auth.token) {
      navigate("/login");
      return;
    }
    fetchProjectDetails();

    const socket = io("http://localhost:1337", { auth: { token: auth.token } });

    socket.on("project_update", (data) => {
      if (data.project_id === project_id) {
        setProjectData((prev) => (prev ? { ...prev, ...data } : prev));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [project_id, auth]);

  const fetchProjectDetails = async () => {
    if (!project_id) return;
    try {
      const res = await axios.get(`http://localhost:1337/api/projects/${project_id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setProjectData(res.data);
      dispatch(set_active_project({ project_id: res.data.project_id, name: res.data.name }));
    } catch (error) {
      console.error("Error fetching project details", error);
    }
  };

  const updateProjectName = async (newName: string) => {
    if (!project_id) return;
    try {
      await axios.patch(
        `http://localhost:1337/api/projects/${project_id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      setProjectData((prev) => (prev ? { ...prev, name: newName } : prev));
    } catch (error) {
      console.error("Error updating project name", error);
    }
  };

  const duplicateProject = async () => {
    if (!projectData) return;
    try {
      const res = await axios.post(
        "http://localhost:1337/api/projects",
        { name: `${projectData.name} (Copy)` },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      navigate(`/projects/${res.data.project_id}`);
    } catch (error) {
      console.error("Error duplicating project", error);
    }
  };

  const deleteProject = async () => {
    if (!project_id) return;
    try {
      await axios.delete(`http://localhost:1337/api/projects/${project_id}`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        {projectData ? (
          <>
            {/* Project Title & Actions */}
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                value={projectData.name}
                className="text-2xl font-bold border p-2 rounded"
                onChange={(e) => updateProjectName(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={duplicateProject} className="bg-blue-500 text-white px-4 py-2 rounded">Duplicate</button>
                <button onClick={deleteProject} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
              </div>
            </div>

            {/* Team Members */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Team Members</h3>
              <ul className="border rounded p-4">
                {projectData.team_members.map((member) => (
                  <li key={member.user_id} className="flex justify-between py-1">
                    <span>{member.user_id}</span>
                    <span className="text-sm text-gray-600">{member.role}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activity Log */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Activity Log</h3>
              <ul className="border rounded p-4">
                {projectData.activity_log.map((log) => (
                  <li key={log.id} className="py-1 text-sm text-gray-600">
                    {log.message} <span className="text-xs text-gray-400">({log.timestamp})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Version Control */}
            <div>
              <h3 className="text-lg font-semibold">Version History</h3>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="border p-2 rounded w-full mt-2"
              >
                <option value="latest">Latest</option>
                <option value="v1">Version 1</option>
                <option value="v2">Version 2</option>
              </select>
            </div>
          </>
        ) : (
          <p>Loading project details...</p>
        )}
      </div>
    </>
  );
};

export default UV_ProjectDetails;