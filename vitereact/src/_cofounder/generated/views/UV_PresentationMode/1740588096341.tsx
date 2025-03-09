import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const UV_PresentationMode: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();

  // State Management
  const [presentationActive, setPresentationActive] = useState<boolean>(false);
  const [interactivitySettings, setInteractivitySettings] = useState({
    autoAdvance: false,
    navigationMode: "click",
  });
  const [slides, setSlides] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const socket = io("http://localhost:1337");

  // Fetch presentation data
  const fetchPresentationData = useCallback(async () => {
    if (!project_id) return;
    try {
      const response = await axios.get(`http://localhost:1337/api/projects/${project_id}`);
      setSlides(response.data.pages || []);
    } catch (error) {
      console.error("Error fetching presentation data", error);
    }
  }, [project_id]);

  useEffect(() => {
    fetchPresentationData();
    socket.on("project_update", (data) => {
      if (data.project_id === project_id) {
        fetchPresentationData(); // Re-fetch if updates occur
      }
    });
    return () => socket.disconnect();
  }, [project_id, fetchPresentationData]);

  // Toggle Presentation Mode
  const togglePresentation = () => {
    setPresentationActive(prev => !prev);
  };

  // Next Slide Function
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  // Previous Slide Function
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Auto-Advance handler
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (presentationActive && interactivitySettings.autoAdvance) {
      interval = setInterval(() => {
        nextSlide();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [presentationActive, interactivitySettings.autoAdvance, currentSlide, slides.length]);

  return (
    <>
      {/* Presentation Header */}
      <div className="fixed top-0 left-0 w-full bg-gray-900 text-white flex justify-between px-6 py-3 z-50">
        <h2 className="text-lg font-semibold">Presentation Mode</h2>
        <div className="flex gap-3">
          <button onClick={togglePresentation} className="bg-blue-600 px-4 py-2 rounded">
            {presentationActive ? "Stop" : "Start"} Presentation
          </button>
          <button onClick={() => setInteractivitySettings(prev => ({ ...prev, autoAdvance: !prev.autoAdvance }))}
            className="bg-gray-700 px-4 py-2 rounded">
            Auto Advance: {interactivitySettings.autoAdvance ? "On" : "Off"}
          </button>
        </div>
      </div>

      {/* Presentation Content */}
      <div className="relative w-full h-screen flex items-center justify-center bg-black text-white">
        {slides.length > 0 ? (
          <>
            <img src={`https://picsum.photos/seed/${slides[currentSlide]}/900/500`} alt="Slide"
              className="max-w-4xl max-h-[80%] rounded shadow-lg transition-transform duration-500" />
            <div className="absolute bottom-6 flex gap-4">
              <button onClick={prevSlide} disabled={currentSlide === 0} className="bg-gray-700 px-5 py-2 rounded">
                Previous
              </button>
              <button onClick={nextSlide} disabled={currentSlide === slides.length - 1} className="bg-gray-700 px-5 py-2 rounded">
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-400">No slides available</p>
        )}
      </div>
    </>
  );
};

export default UV_PresentationMode;