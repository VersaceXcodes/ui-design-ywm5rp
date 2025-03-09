import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { RootState } from "@/store/main";

const UV_Export: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();
  const auth = useSelector((state: RootState) => state.auth);
  
  const [exportFormat, setExportFormat] = useState<string>("PNG");
  const [exportOptions, setExportOptions] = useState({
    includeAnnotations: true,
    optimizeSize: false,
  });
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch initial export data when the component loads
  useEffect(() => {
    if (auth && project_id) {
      fetchExportData();
    }
  }, [auth, project_id]);

  const fetchExportData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1337/api/projects/${project_id}/export`,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      console.log("Export data fetched:", response.data);
    } catch (error) {
      console.error("Error fetching export data", error);
    }
  };

  const executeExport = async () => {
    if (!project_id || !auth) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:1337/api/projects/${project_id}/export?format=${exportFormat}`,
        {
          headers: { Authorization: `Bearer ${auth?.token}` },
        }
      );
      setDownloadUrl(response.data.downloadUrl);
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Export Project Assets</h1>
        <p className="text-gray-600 mb-6">
          Choose how you want to export your project files.
        </p>

        <label className="block mb-4">
          <span className="text-gray-700">Select Export Format:</span>
          <select
            className="mt-1 block w-full p-2 border rounded-lg shadow"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="PNG">PNG</option>
            <option value="SVG">SVG</option>
            <option value="PDF">PDF</option>
            <option value="HTML">HTML</option>
            <option value="Tailwind">Tailwind</option>
            <option value="Bootstrap">Bootstrap</option>
          </select>
        </label>

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600"
            checked={exportOptions.includeAnnotations}
            onChange={() =>
              setExportOptions((prev) => ({
                ...prev,
                includeAnnotations: !prev.includeAnnotations,
              }))
            }
          />
          <span className="ml-2 text-gray-700">Include Annotations</span>
        </label>

        <label className="flex items-center mb-6">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600"
            checked={exportOptions.optimizeSize}
            onChange={() =>
              setExportOptions((prev) => ({
                ...prev,
                optimizeSize: !prev.optimizeSize,
              }))
            }
          />
          <span className="ml-2 text-gray-700">Optimize Size</span>
        </label>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          onClick={executeExport}
          disabled={loading}
        >
          {loading ? "Processing..." : "Download Export"}
        </button>

        {downloadUrl && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
            <p>Export is ready! Click below to download:</p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download File
            </a>
          </div>
        )}

        <div className="mt-6">
          <Link
            to={`/projects/${project_id}/editor`}
            className="text-blue-600 underline"
          >
            Back to Editor
          </Link>
        </div>
      </div>
    </>
  );
};

export default UV_Export;