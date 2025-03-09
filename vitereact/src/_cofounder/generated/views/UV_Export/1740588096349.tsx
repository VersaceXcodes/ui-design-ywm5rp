import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const UV_Export: React.FC = () => {
  const { project_id } = useParams<{ project_id: string }>();

  const [exportFormat, setExportFormat] = useState<string>("PNG");
  const [exportOptions, setExportOptions] = useState({
    includeAnnotations: true,
    optimizeSize: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExportData = async () => {
      if (!project_id) return;
      try {
        setLoading(true);
        await axios.get(`http://localhost:1337/api/projects/${project_id}`);
        setLoading(false);
      } catch (err) {
        setError("Failed to load project data.");
        setLoading(false);
      }
    };
    fetchExportData();
  }, [project_id]);

  const executeExport = async () => {
    if (!project_id) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:1337/api/projects/${project_id}/export?format=${exportFormat}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${project_id}.${exportFormat.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setLoading(false);
    } catch (err) {
      setError("Failed to export project.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Export Project Assets</h1>
        <p className="text-sm text-gray-600">
          Export your UI design as images, PDFs, or code snippets.
        </p>

        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Export Format</span>
            <select
              className="w-full mt-1 p-2 border border-gray-300 rounded"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="PNG">PNG</option>
              <option value="SVG">SVG</option>
              <option value="PDF">PDF</option>
              <option value="HTML">HTML</option>
              <option value="Tailwind">Tailwind CSS</option>
              <option value="Bootstrap">Bootstrap</option>
            </select>
          </label>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={exportOptions.includeAnnotations}
                onChange={() =>
                  setExportOptions((prev) => ({
                    ...prev,
                    includeAnnotations: !prev.includeAnnotations,
                  }))
                }
              />
              Include Annotations
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={exportOptions.optimizeSize}
                onChange={() =>
                  setExportOptions((prev) => ({
                    ...prev,
                    optimizeSize: !prev.optimizeSize,
                  }))
                }
              />
              Optimize File Size
            </label>
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={executeExport}
            disabled={loading}
          >
            {loading ? "Exporting..." : "Download"}
          </button>
        </div>

        <div className="mt-6">
          <Link to={`/projects/${project_id}/editor`} className="text-blue-500 hover:underline">
            ← Back to Editor
          </Link>
        </div>
      </div>
    </>
  );
};

export default UV_Export;