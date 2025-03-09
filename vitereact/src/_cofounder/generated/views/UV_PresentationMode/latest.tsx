import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const UV_PresentationMode: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();
  const [presentationActive, setPresentationActive] = useState<boolean>(false);
  const [interactivitySettings, setInteractivitySettings] = useState({
    autoAdvance: false,
    navigationMode: "click",
  });
  const [presentationData, setPresentationData] = useState<any | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const fetchPresentationData = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:1337/api/projects/${project_id}`);
      setPresentationData(response.data);
    } catch (error) {
      console.error("Error loading presentation data", error);
    }
  }, [project_id]);

  useEffect(() => {
    fetchPresentationData();
  }, [fetchPresentationData]);

  const togglePresentation = () => {
    setPresentationActive((prev) => !prev);
  };

  const nextStep = () => {
    setCurrentStep((prev) => (prev < (presentationData?.pages.length || 0) - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (presentationActive && interactivitySettings.autoAdvance) {
      interval = setInterval(() => {
        nextStep();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [presentationActive, interactivitySettings.autoAdvance, currentStep, presentationData]);

  return (
    <>
      <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white ${presentationActive ? "fixed inset-0 z-50" : ""}`}>
        <div className="w-full max-w-screen-lg p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-bold">{presentationData?.name || "Presentation"}</h1>
            <button onClick={togglePresentation} className="px-4 py-2 bg-blue-500 text-white rounded">
              {presentationActive ? "Stop Presentation" : "Start Presentation"}
            </button>
          </div>

          {/* Presentation Content */}
          <div className="relative w-full h-[500px] bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
            {presentationData?.pages?.[currentStep] ? (
              <img src={`https://picsum.photos/seed/${presentationData.pages[currentStep].id}/800/500`} alt={`Slide ${currentStep + 1}`} className="w-full h-full object-cover" />
            ) : (
              <p className="text-gray-400">No content available</p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-4">
            <button onClick={prevStep} disabled={currentStep === 0} className={`px-4 py-2 rounded ${currentStep === 0 ? "bg-gray-700" : "bg-blue-500 text-white"}`}>
              Previous
            </button>
            <span>{currentStep + 1} / {presentationData?.pages?.length || 0}</span>
            <button onClick={nextStep} disabled={currentStep >= (presentationData?.pages.length || 0) - 1} className={`px-4 py-2 rounded ${currentStep >= (presentationData?.pages.length || 0) - 1 ? "bg-gray-700" : "bg-blue-500 text-white"}`}>
              Next
            </button>
          </div>

          {/* Settings */}
          <div className="flex mt-4 items-center gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={interactivitySettings.autoAdvance}
                onChange={() => setInteractivitySettings((prev) => ({ ...prev, autoAdvance: !prev.autoAdvance }))}
                className="mr-2"
              />
              <label>Auto Advance</label>
            </div>
            <div className="flex items-center">
              <label className="mr-2">Navigation Mode:</label>
              <select
                className="bg-gray-700 text-white px-2 py-1 rounded"
                value={interactivitySettings.navigationMode}
                onChange={(e) => setInteractivitySettings((prev) => ({ ...prev, navigationMode: e.target.value }))}
              >
                <option value="click">Click</option>
                <option value="keyboard">Keyboard</option>
                <option value="swipe">Swipe</option>
              </select>
            </div>
          </div>

          {/* Exit Button */}
          <div className="mt-6">
            <Link to={`/projects/${project_id}`} className="text-blue-400 underline">
              Back to Project
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_PresentationMode;