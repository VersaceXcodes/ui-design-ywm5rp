import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RootState, set_active_project } from "@/store/main";

const UV_CreateProject: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("blank");
  const [colorTheme, setColorTheme] = useState<string>("default");
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProjectCreation = async () => {
    if (!projectName.trim()) {
      setError("Project name cannot be empty.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        "http://localhost:1337/api/projects",
        { name: projectName },
        { headers: { Authorization: `Bearer ${authUser?.token}` } }
      );

      const { project_id, name } = response.data;
      dispatch(set_active_project({ project_id, name }));
      
      navigate(`/projects/${project_id}/editor`);
    } catch (err) {
      setError("Failed to create project, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Create New Project</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <label className="block text-sm font-medium text-gray-700">Project Name</label>
        <input
          type="text"
          className="w-full mt-1 p-2 border border-gray-300 rounded"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          disabled={loading}
        />

        <label className="block text-sm font-medium text-gray-700 mt-4">Select Template</label>
        <select
          className="w-full mt-1 p-2 border border-gray-300 rounded"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          disabled={loading}
        >
          <option value="blank">Blank Canvas</option>
          <option value="dashboard">Dashboard Layout</option>
          <option value="landing-page">Landing Page</option>
        </select>

        <label className="block text-sm font-medium text-gray-700 mt-4">Color Theme</label>
        <select
          className="w-full mt-1 p-2 border border-gray-300 rounded"
          value={colorTheme}
          onChange={(e) => setColorTheme(e.target.value)}
          disabled={loading}
        >
          <option value="default">Default</option>
          <option value="dark">Dark Mode</option>
          <option value="light">Light Mode</option>
        </select>

        <div className="flex items-center mt-4">
          <input
            id="ai-suggestions"
            type="checkbox"
            checked={aiSuggestionsEnabled}
            onChange={() => setAiSuggestionsEnabled(!aiSuggestionsEnabled)}
            className="h-5 w-5 text-blue-600"
            disabled={loading}
          />
          <label htmlFor="ai-suggestions" className="ml-2 text-sm text-gray-700">
            Enable AI-Powered Suggestions
          </label>
        </div>

        <button
          className="w-full mt-6 bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          onClick={handleProjectCreation}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </div>
    </>
  );
};

export default UV_CreateProject;