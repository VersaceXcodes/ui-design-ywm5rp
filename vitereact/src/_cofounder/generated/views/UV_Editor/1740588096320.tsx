import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/main";
import { io, Socket } from "socket.io-client";
import axios from "axios";

const UV_Editor: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();
  const auth = useSelector((state: RootState) => state.auth);
  const activeProject = useSelector((state: RootState) => state.project);
  const collaborators = useSelector((state: RootState) => state.collaborators);

  const [uiElements, setUiElements] = useState<{ element_id: string; type: string; properties: Record<string, any> }[]>([]);
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [aiLayoutSuggestions, setAiLayoutSuggestions] = useState<{ suggestion_id: string; layout: any }[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!auth || !project_id) return;

    // Fetch elements on load
    const fetchProjectElements = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/projects/${project_id}/pages/${currentPage}/elements`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setUiElements(response.data);
      } catch (error) {
        console.error("Failed to load project elements:", error);
      }
    };

    fetchProjectElements();

    // Set up WebSocket connection
    const newSocket = io("http://localhost:1337", { auth: { token: auth.token } });

    newSocket.on("project_update", (data) => {
      if (data.project_id === project_id) {
        setUiElements((prevElements) =>
          prevElements.map((el) => (el.element_id === data.change.element_id ? { ...el, ...data.change.new_state } : el))
        );
      }
    });

    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [auth, project_id, currentPage]);

  const addElement = async (elementType: string) => {
    if (!auth || !project_id) return;

    const newElement = {
      element_id: `el_${Date.now()}`,
      type: elementType,
      properties: { width: 100, height: 50, color: "gray" }
    };

    try {
      await axios.post(`http://localhost:1337/api/projects/${project_id}/pages/${currentPage}/elements`, newElement, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      setUiElements((prev) => [...prev, newElement]);
      socket?.emit("project_update", { project_id, change: { element_id: newElement.element_id, new_state: newElement } });
    } catch (error) {
      console.error("Failed to add element:", error);
    }
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/5 bg-gray-100 p-4">
          <h2 className="text-lg font-semibold mb-4">Components</h2>
          <button onClick={() => addElement("button")} className="w-full mb-2 p-2 bg-blue-500 text-white rounded">Button</button>
          <button onClick={() => addElement("input")} className="w-full mb-2 p-2 bg-gray-500 text-white rounded">Input</button>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-white relative">
          <h2 className="text-center text-xl font-semibold mt-4">Editing: {activeProject?.name || "Unknown Project"}</h2>
          <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-gray-300">
            {uiElements.map((el) => (
              <div key={el.element_id} className="absolute" style={{ width: el.properties.width, height: el.properties.height, backgroundColor: el.properties.color }}>
                {el.type}
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions Panel */}
        <div className="w-1/5 bg-gray-100 p-4">
          <h2 className="text-lg font-semibold mb-4">AI Layouts</h2>
          {aiLayoutSuggestions.map((suggestion) => (
            <button key={suggestion.suggestion_id} className="w-full mb-2 p-2 bg-green-500 text-white rounded">
              Apply Layout {suggestion.suggestion_id}
            </button>
          ))}
        </div>
      </div>

      {/* Active Collaborators */}
      <div className="absolute bottom-2 right-2 bg-black text-white p-3 rounded-lg">
        <h2 className="text-sm font-semibold">Active Users</h2>
        {collaborators.map((user) => (
          <div key={user.user_id} className="text-xs">{user.name}</div>
        ))}
      </div>
    </>
  );
};

export default UV_Editor;