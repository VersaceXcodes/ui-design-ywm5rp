import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { RootState } from "@/store/main";

const GV_SidebarNavigation: React.FC = () => {
  const { project_id } = useParams();
  const auth = useSelector((state: RootState) => state.auth);
  const activeProject = useSelector((state: RootState) => state.project);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [projectPages, setProjectPages] = useState<{ page_id: string; name: string }[]>([]);

  useEffect(() => {
    if (project_id && auth?.token) {
      fetchProjectPages();
    }
  }, [project_id, auth]);

  const fetchProjectPages = async () => {
    try {
      const response = await axios.get(`/api/projects/${project_id}/pages`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      setProjectPages(response.data || []);
    } catch (error) {
      console.error("Error fetching project pages:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const addNewPage = async () => {
    if (!project_id || !auth?.token) return;
    try {
      const newPageName = `New Page ${projectPages.length + 1}`;
      const response = await axios.post(
        `/api/projects/${project_id}/pages`,
        { name: newPageName },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setProjectPages([...projectPages, response.data]);
    } catch (error) {
      console.error("Failed to add new page:", error);
    }
  };

  return (
    <>
      <div className={`h-screen bg-gray-900 text-white flex flex-col transition-all ${isSidebarCollapsed ? "w-16" : "w-64"} duration-300`}>
        <button onClick={toggleSidebar} className="p-3 text-gray-400 hover:text-white focus:outline-none">
          {isSidebarCollapsed ? "►" : "◄"}
        </button>

        {!isSidebarCollapsed && activeProject && (
          <div className="px-4 py-2 border-b border-gray-700">
            <h2 className="text-lg font-semibold">{activeProject.name}</h2>
            <span className="text-xs text-gray-400">{activeProject.project_id}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {!isSidebarCollapsed && (
            <ul className="mt-2">
              {projectPages.map((page) => (
                <li key={page.page_id} className="px-4 py-2 hover:bg-gray-800">
                  <Link to={`/projects/${project_id}/editor?page=${page.page_id}`} className="block">
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-gray-700">
            <button onClick={addNewPage} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm">
              + Add New Page
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GV_SidebarNavigation;