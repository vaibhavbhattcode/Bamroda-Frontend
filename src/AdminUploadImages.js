import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Plus, Trash2, UploadCloud, Image } from "lucide-react";

const AdminUploadImages = () => {
  const [files, setFiles] = useState([]);
  const [category, setCategory] = useState("");
  const [previews, setPreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/categories?cb=${Date.now()}`
      );
      setCategories(response.data);
    } catch (error) {
      setError("Failed to fetch categories");
      console.error("Category fetch error:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError("Please enter a valid category name");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/categories`, {
        category: newCategory,
      });
      setNewCategory("");
      await fetchCategories();
      setError("");
    } catch (error) {
      setError("Failed to add category");
      console.error("Category add error:", error);
    }
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    if (
      !window.confirm(`Are you sure you want to delete "${categoryToDelete}"?`)
    )
      return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/categories/${categoryToDelete}`
      );
      await fetchCategories();
      if (category === categoryToDelete) setCategory("");
    } catch (error) {
      setError("Failed to delete category");
      console.error("Category delete error:", error);
    }
  };

  const handleUpload = async () => {
    if (!category) {
      setError("Please select a category");
      return;
    }
    if (files.length === 0) {
      setError("Please select at least one image");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("category", category);

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/upload-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFiles([]);
      setPreviews([]);
      setError("");
    } catch (error) {
      setError("Image upload failed");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Image className="text-blue-600" size={24} />
        Image Upload Management
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <X size={16} />
          {error}
        </div>
      )}

      {/* File Upload Section */}
      <div className="mb-8 p-6 border-2 border-dashed border-gray-200 rounded-xl">
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <UploadCloud className="w-12 h-12 text-gray-400 mb-2" />
          <span className="text-gray-600">
            Click to select images or drag and drop
          </span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </label>

        {/* Image Previews */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {previews.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={src}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg shadow-sm transition-transform group-hover:scale-105"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Category Management Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Add New Category
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Category List */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Existing Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-700">{cat}</span>
                <button
                  onClick={() => handleDeleteCategory(cat)}
                  className="text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 
          disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <UploadCloud size={18} />
            Upload Images
          </>
        )}
      </button>
    </div>
  );
};

export default AdminUploadImages;
