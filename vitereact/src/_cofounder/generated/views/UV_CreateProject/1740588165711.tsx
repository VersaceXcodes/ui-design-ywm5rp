import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { RootState, set_active_project } from "@/store/main";

const UV_CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth);

  const [projectName, setProjectName] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("blank");
  const [colorTheme, setColorTheme] = useState<string>("default");
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleProjectCreation = async () => {
    if (!projectName.trim()) return;
    if (!authUser) {
      setErrorMessage("User authentication is required.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:1337/api/projects",
        { name: projectName },
        {
          headers: { Authorization: `Bearer ${authUser.token}` }
        }
      );

      if (response.status === 201) {
        const newProject = response.data;
        dispatch(set_active_project(newProject));
        navigate(`/projects/${newProject.project_id}/editor`);
      }
    } catch (error) {
      setErrorMessage("Failed to create project. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-semibold mb-4">Create New Project</h1>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <label className="block mb-2 text-gray-700">Project Name:</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />

        <label className="block mt-4 mb-2 text-gray-700">Select Template:</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          <option value="blank">Blank Project</option>
          <option value="dashboard">Dashboard Template</option>
          <option value="landingpage">Landing Page Template</option>
        </select>

        <label className="block mt-4 mb-2 text-gray-700">Select Color Theme:</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          value={colorTheme}
          onChange={(e) => setColorTheme(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="dark">Dark Mode</option>
          <option value="light">Light Mode</option>
        </select>

        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="ai_suggestions"
            checked={aiSuggestionsEnabled}
            onChange={() => setAiSuggestionsEnabled(!aiSuggestionsEnabled)}
            className="mr-2"
          />
          <label htmlFor="ai_suggestions" className="text-gray-700">
            Enable AI Layout Suggestions
          </label>
        </div>

        <button
          className={`mt-6 w-full px-4 py-2 text-white font-semibold rounded-md ${
            projectName.trim()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleProjectCreation}
          disabled={!projectName.trim() || loading}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </div>
    </>
  );
};

export default UV_CreateProject;