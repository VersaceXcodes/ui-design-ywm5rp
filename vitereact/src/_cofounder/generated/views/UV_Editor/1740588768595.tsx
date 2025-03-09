import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/main";
import axios from "axios";
import { io, Socket } from "socket.io-client";

const UV_Editor: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();
  const auth = useSelector((state: RootState) => state.auth);
  const collaborative_users = useSelector((state: RootState) => state.collaborators);
  
  const [uiElements, setUiElements] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [aiLayoutSuggestions, setAiLayoutSuggestions] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!auth || !project_id) return;

    // Connect WebSocket
    const newSocket = io("http://localhost:1337", { auth: { token: auth.token } });
    setSocket(newSocket);

    newSocket.on("project_update", (data) => {
      if (data.project_id === project_id) {
        setUiElements((prevElements) => 
          prevElements.map(el => el.element_id === data.change.element_id ? {...el, ...data.change.new_state} : el)
        );
      }
    });

    newSocket.on("user_presence", (data) => {
      console.log("Active collaborators updated", data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [auth, project_id]);

  useEffect(() => {
    if (!auth || !project_id) return;
    
    const fetchProjectElements = async () => {
      try {
        const res = await axios.get(`http://localhost:1337/api/projects/${project_id}/pages/${currentPage}/elements`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setUiElements(res.data);
      } catch (error) {
        console.error("Error fetching project elements", error);
      }
    };
    
    fetchProjectElements();
  }, [auth, project_id, currentPage]);

  const addElement = async (elementType: string) => {
    if (!auth || !project_id) return;

    const newElement = {
      element_id: `element-${Date.now()}`,
      type: elementType,
      properties: {},
    };

    setUiElements([...uiElements, newElement]);

    try {
      await axios.post(
        `http://localhost:1337/api/projects/${project_id}/pages/${currentPage}/elements`,
        { element_data: newElement },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      
      socket?.emit("project_update", {
        event: "project_update",
        project_id,
        change: { element_id: newElement.element_id, new_state: newElement }
      });
    } catch (error) {
      console.error("Error adding element", error);
    }
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar for UI components */}
        <div className="w-60 bg-gray-100 p-4 border-r">
          <h3 className="text-lg font-semibold mb-4">Components</h3>
          <button onClick={() => addElement("button")} className="block w-full p-2 mb-2 bg-blue-500 text-white rounded">Button</button>
          <button onClick={() => addElement("input")} className="block w-full p-2 mb-2 bg-green-500 text-white rounded">Input</button>
          <button onClick={() => addElement("card")} className="block w-full p-2 mb-2 bg-purple-500 text-white rounded">Card</button>
        </div>
        
        {/* Main canvas */}
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4 flex justify-between">
            {/* Page Controls */}
            <div>
              <button onClick={() => setCurrentPage("home")} className={`mr-2 ${currentPage === "home" ? "font-bold" : ""}`}>Home</button>
              <button onClick={() => setCurrentPage("dashboard")} className={`${currentPage === "dashboard" ? "font-bold" : ""}`}>Dashboard</button>
            </div>
            
            {/* Export Button */}
            <Link to={`/projects/${project_id}/export`} className="bg-gray-800 text-white px-4 py-2 rounded">Export</Link>
          </div>

          {/* UI Elements Canvas */}
          <div className="flex-1 p-4 bg-gray-50">
            {uiElements.map((element) => (
              <div key={element.element_id} className="border p-2 mb-2 bg-white rounded shadow">
                {element.type.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Collaborators Panel */}
        <div className="w-40 bg-gray-100 p-4 border-l">
          <h3 className="text-lg font-semibold mb-4">Live Users</h3>
          {collaborative_users.map((user) => (
            <div key={user.user_id} className="p-2 mb-1 bg-blue-100 rounded">{user.name}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UV_Editor;