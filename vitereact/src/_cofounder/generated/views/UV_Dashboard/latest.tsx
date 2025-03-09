import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/store/main";

const UV_Dashboard: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const activeProject = useSelector((state: RootState) => state.project);
  
  const [recentProjects, setRecentProjects] = useState<{ project_id: string, name: string, updated_at: string }[]>([]);
  const [aiSuggestions, setAISuggestions] = useState<{ template_id: string, title: string, description: string }[]>([]);
  
  // Fetch recent projects
  useEffect(() => {
    if (!auth) return;
    
    axios.get("http://localhost:1337/api/projects", {
      headers: { Authorization: `Bearer ${auth.token}` }
    }).then(response => {
      setRecentProjects(response.data);
    }).catch(error => {
      console.error("Error fetching projects:", error);
    });
  }, [auth]);
  
  // Fetch AI-driven suggestions
  useEffect(() => {
    if (!auth) return;
    
    axios.get("http://localhost:1337/api/projects/ai-suggestions", {
      headers: { Authorization: `Bearer ${auth.token}` }
    }).then(response => {
      setAISuggestions(response.data);
    }).catch(error => {
      console.error("Error fetching AI suggestions:", error);
    });
  }, [auth]);

  return (
    <>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        
        <div className="mt-6 flex gap-4">
          <Link to="/projects/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            + New Project
          </Link>
          <button className="bg-gray-200 px-4 py-2 rounded-md">Import Figma</button>
        </div>

        {/* Recent Projects */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          {recentProjects.length === 0 ? (
            <p className="text-gray-500 mt-2">No projects found. Start a new project now!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {recentProjects.map(project => (
                <Link 
                  key={project.project_id} 
                  to={`/projects/${project.project_id}`} 
                  className="block p-4 border rounded-lg shadow hover:shadow-lg bg-white"
                >
                  <h3 className="text-lg font-bold">{project.name}</h3>
                  <p className="text-sm text-gray-500">Last updated: {new Date(project.updated_at).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* AI-Generated Suggestions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">AI-Powered Suggestions</h2>
          {aiSuggestions.length === 0 ? (
            <p className="text-gray-500 mt-2">No AI suggestions available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {aiSuggestions.map(suggestion => (
                <div key={suggestion.template_id} className="p-4 border rounded-lg shadow bg-white">
                  <h3 className="text-lg font-bold">{suggestion.title}</h3>
                  <p className="text-sm text-gray-500">{suggestion.description}</p>
                  <button className="mt-2 text-blue-600 hover:underline">Use this template</button>
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