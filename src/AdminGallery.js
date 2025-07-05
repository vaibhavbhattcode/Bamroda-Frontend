import React, { useEffect, useState } from "react";
import axios from "axios";
import { X, Loader2, Trash2, ZoomIn } from "lucide-react";
import Masonry from "react-masonry-css";

const AdminGallery = () => {
  const [images, setImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const breakpointColumns = {
    default: 4,
    1280: 3,
    1024: 2,
    768: 2,
    500: 1,
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/gallery`);
      setImages(response.data);
    } catch (err) {
      setError("Failed to load gallery images");
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      setDeletingId(imageId);
      await axios.delete(`http://localhost:5000/api/delete-image/${imageId}`);
      setImages((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((category) => {
          updated[category] = updated[category].filter(
            (img) => img._id !== imageId
          );
        });
        return updated;
      });
    } catch (err) {
      console.error("Error deleting image:", err);
      alert("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCategories = Object.keys(images).filter(
    (category) => category.toLowerCase() !== "slider"
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Gallery Management
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Loading gallery content...</p>
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No images available in the gallery</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <section key={category} className="mb-12">
              <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800">
                  {category}
                </h3>
                <span className="text-gray-500 text-sm">
                  {images[category].length} images
                </span>
              </div>

              <Masonry
                breakpointCols={breakpointColumns}
                className="flex gap-6"
                columnClassName="masonry-column"
              >
                {images[category].map((img) => (
                  <div
                    key={img._id}
                    className="relative group mb-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() =>
                    setSelectedImage(
                      `${process.env.REACT_APP_API_URL}/uploads/${img.filename}`
                    )
                  }
                >
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/uploads/${img.filename}`}
                        alt="Gallery"
                        className="w-full h-72 object-cover transform transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="text-white w-8 h-8" />
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(img._id);
                      }}
                      disabled={deletingId === img._id}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-600 p-2 rounded-full shadow-md transition-colors"
                    >
                      {deletingId === img._id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                ))}
              </Masonry>
            </section>
          ))
        )}

        {selectedImage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4">
            <div className="relative max-w-full max-h-[90vh]">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-200 transition-colors z-50 p-2"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={selectedImage}
                alt="Enlarged View"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-xl bg-black"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
