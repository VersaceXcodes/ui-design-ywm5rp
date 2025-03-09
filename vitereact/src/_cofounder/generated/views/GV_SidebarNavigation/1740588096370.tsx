import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/store/main";

const GV_SidebarNavigation: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();
  const active_project = useSelector((state: RootState) => state.project);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [projectPages, setProjectPages] = useState<{ page_id: string; name: string }[]>([]);

  // Toggle sidebar collapse state
  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Fetch project pages
  const fetchProjectPages = async () => {
    if (!project_id) return;
    try {
      const response = await axios.get(`http://localhost:1337/api/projects/${project_id}/pages`, {
        headers: { Authorization: `Bearer ${useSelector((state: RootState) => state.auth?.token)}` },
      });
      setProjectPages(response.data);
    } catch (error) {
      console.error("Error fetching project pages:", error);
    }
  };

  // Add new page
  const addNewPage = async () => {
    if (!project_id) return;
    try {
      const response = await axios.post(
        `http://localhost:1337/api/projects/${project_id}/pages`,
        { name: `New Page ${projectPages.length + 1}` },
        {
          headers: { Authorization: `Bearer ${useSelector((state: RootState) => state.auth?.token)}` },
        }
      );
      setProjectPages([...projectPages, response.data]);
    } catch (error) {
      console.error("Error adding new page:", error);
    }
  };

  // Fetch pages when component mounts
  useEffect(() => {
    fetchProjectPages();
  }, [project_id]);

  return (
    <>
      <div className={`h-screen bg-gray-900 text-white transition-all ${isSidebarCollapsed ? "w-16" : "w-64"} flex flex-col`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isSidebarCollapsed && (
            <span className="text-lg font-semibold">{active_project?.name || "Project"}</span>
          )}
          <button onClick={toggleSidebar} className="p-2 rounded bg-gray-800 hover:bg-gray-700">
            {isSidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Sidebar Navigation Pages */}
        <div className="flex-1 overflow-y-auto">
          {projectPages.map((page) => (
            <Link
              key={page.page_id}
              to={`/projects/${project_id}/editor?page=${page.page_id}`}
              className="block p-3 hover:bg-gray-700"
            >
              {isSidebarCollapsed ? "📄" : page.name}
            </Link>
          ))}
        </div>

        {/* Add New Page Button */}
        <button
          onClick={addNewPage}
          className="m-4 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          {isSidebarCollapsed ? "+" : "Add New Page"}
        </button>
      </div>
    </>
  );
};

export default GV_SidebarNavigation;