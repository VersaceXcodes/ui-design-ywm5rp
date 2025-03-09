import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/store/main";

const UV_Dashboard: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const activeProject = useSelector((state: RootState) => state.project);
  const navigate = useNavigate();
  
  const [recentProjects, setRecentProjects] = useState<{ project_id: string; name: string; updated_at: string }[]>([]);
  const [aiSuggestions, setAISuggestions] = useState<{ template_id: string; title: string; description: string }[]>([]);

  useEffect(() => {
    if (!auth) return;

    // Fetch recent projects
    axios.get("http://localhost:1337/api/projects", {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    .then((response) => {
      setRecentProjects(response.data);
    })
    .catch(console.error);

    // Fetch AI suggestions (Placeholder API - Modify when backend is ready)
    axios.get("http://localhost:1337/api/ai-suggestions", {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    .then((response) => {
      setAISuggestions(response.data);
    })
    .catch(console.error);

  }, [auth]);

  return (
    <>
      <div className="px-8 py-6">
        {/* Heading and Actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="space-x-4">
            <Link
              to="/projects/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              New Project
            </Link>
            <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
              Import Figma
            </button>
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <h2 className="text-lg font-medium mb-4">Recent Projects</h2>
          {recentProjects.length === 0 ? (
            <p className="text-gray-500">No recent projects available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProjects.map((project) => (
                <div
                  key={project.project_id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    activeProject?.project_id === project.project_id ? "border-blue-500" : "border-gray-300"
                  } hover:shadow-md transition flex justify-between items-center`}
                  onClick={() => navigate(`/projects/${project.project_id}`)}
                >
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="text-sm text-gray-500">{new Date(project.updated_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Suggestions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">AI-Suggested Templates</h2>
          {aiSuggestions.length === 0 ? (
            <p className="text-gray-500">No design suggestions available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiSuggestions.map((template) => (
                <div
                  key={template.template_id}
                  className="p-4 border border-gray-300 rounded-lg hover:shadow-md transition cursor-pointer"
                >
                  <h3 className="font-semibold">{template.title}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                  <button className="mt-2 text-blue-600 hover:underline">
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UV_Dashboard;