import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const Gallery = () => {
  const [images, setImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/gallery`)
      .then((response) => {
        const filteredData = Object.keys(response.data).reduce(
          (acc, category) => {
            if (category !== "slider") acc[category] = response.data[category];
            return acc;
          },
          {}
        );
        setImages(filteredData);
        setActiveCategory(Object.keys(filteredData)[0] || "");
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  const categories = Object.keys(images);

  return (
    <div className="min-h-screen bg-emerald-50 py-8 px-4 md:px-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-emerald-800 mb-4">
          Village Gallery
        </h1>
      </div>

      {/* Category Tabs */}
      {categories.length > 0 && (
        <div className="mb-8 overflow-x-auto">
          <div className="flex justify-center space-x-2 md:space-x-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-lg font-medium rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {activeCategory && images[activeCategory] && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images[activeCategory].map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
              onClick={() =>
                setSelectedImage(
                  `${process.env.REACT_APP_API_URL}/uploads/${img.filename}`
                )
              }
            >
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${img.filename}`}
                alt={activeCategory}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/village-placeholder.jpg";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-amber-300 font-medium text-lg drop-shadow-md">
                  View Full Image
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-emerald-900/95 z-50 p-4">
          <button
            className="absolute top-6 right-6 text-amber-400 hover:text-amber-500 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg border-4 border-amber-50 shadow-2xl"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-800/80 text-amber-100 px-4 py-2 rounded-full text-sm">
              {activeCategory}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
