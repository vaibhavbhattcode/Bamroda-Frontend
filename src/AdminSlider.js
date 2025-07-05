import React, { useState, useEffect } from "react";
import { Loader2, Trash2, UploadCloud } from "lucide-react";

const AdminSlider = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSliderImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/gallery`);
      const data = await res.json();
      setSliderImages(data.slider || []);
    } catch (error) {
      console.error("Error fetching slider images:", error);
      setMessage("Failed to load slider images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliderImages();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) {
      setMessage("Please select files to upload");
      return;
    }

    const formData = new FormData();
    formData.append("category", "slider");
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      setMessage("");
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/upload-images`,
        {
          method: "POST",
          body: formData,
        }
      );
      const result = await res.json();
      setMessage(result.message || "Images uploaded successfully");
      setSelectedFiles([]);
      await fetchSliderImages();
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/delete-image/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      setMessage(result.message || "Image deleted successfully");
      setSliderImages((prev) => prev.filter((img) => img._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Slider Image Management
      </h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("success") ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <p
            className={`${
              message.includes("success") ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </p>
        </div>
      )}

      <form
        onSubmit={handleUpload}
        className="mb-8 bg-white p-6 rounded-lg shadow-sm"
      >
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700 mb-2">
            Select Images
          </span>
          <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors hover:border-blue-500">
            <div className="text-center">
              <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                Drag and drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Recommended size: 1920x1080px (16:9 aspect ratio)
              </p>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>
        </label>

        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Selected files: {selectedFiles.length}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || selectedFiles.length === 0}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 
            disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              Upload Images
            </>
          )}
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Current Slider Images ({sliderImages.length})
        </h3>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Loading slider images...</p>
          </div>
        ) : sliderImages.length === 0 ? (
          <p className="text-gray-500 text-center">No slider images found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sliderImages.map((img) => (
              <div
                key={img._id}
                className="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${img.filename}`}
                  alt="Slider"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDelete(img._id)}
                    disabled={deletingId === img._id}
                    className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-md"
                  >
                    {deletingId === img._id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSlider;
