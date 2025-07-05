import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiLoader,
  FiX,
  FiTrash2,
  FiUploadCloud,
  FiArrowLeft,
} from "react-icons/fi";

const AdminBlogPostForm = ({ postId, onClose, fetchPosts }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    coverImage: null,
    coverImagePreview: null,
    existingCover: "",
    contentImages: [],
    contentImagePreviews: [],
    existingImages: [],
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, postRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/blog-categories`),
          postId
            ? axios.get(`${process.env.REACT_APP_API_URL}/api/blog-posts/${postId}`)
            : null,
        ]);

        setCategories(catRes.data);

        if (postId && postRes) {
          const post = postRes.data;
          setFormData({
            title: post.title || "",
            category: post.category?._id || "",
            content: post.content || "",
            coverImage: null,
            coverImagePreview: null,
            existingCover: post.coverImage || "",
            contentImages: [],
            contentImagePreviews: [],
            existingImages: Array.isArray(post.images) ? post.images : [],
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load form data");
        if (err.response?.status === 401) window.location = "/admin/login";
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const validateForm = () => {
    const errors = [];
    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.category) errors.push("Category is required");
    if (!formData.content.trim()) errors.push("Content is required");
    if (!postId && !formData.coverImage) errors.push("Cover image is required");

    if (errors.length > 0) {
      setError(errors.join(", "));
      return false;
    }
    return true;
  };

  const handleImageChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      setError("Only image files are allowed");
      return;
    }

    if (type === "cover") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file),
      }));
    } else {
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        contentImages: [...prev.contentImages, ...validFiles],
        contentImagePreviews: [...prev.contentImagePreviews, ...newPreviews],
      }));
    }
  };

  const removeImage = (index, type) => {
    setFormData((prev) => {
      const newState = { ...prev };
      switch (type) {
        case "newContent":
          newState.contentImages.splice(index, 1);
          newState.contentImagePreviews.splice(index, 1);
          break;
        case "existingContent":
          newState.existingImages.splice(index, 1);
          break;
        case "cover":
          newState.coverImage = null;
          newState.coverImagePreview = null;
          break;
        default:
          // no action needed for unknown type
          break;
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("content", formData.content);

    if (formData.coverImage)
      formDataToSend.append("coverImage", formData.coverImage);
    formData.contentImages.forEach((img) =>
      formDataToSend.append("contentImages", img)
    );
    if (formData.existingImages.length > 0) {
      formDataToSend.append("images", JSON.stringify(formData.existingImages));
    }

    try {
      setIsSubmitting(true);
      const method = postId ? "put" : "post";
      const url = postId
        ? `${process.env.REACT_APP_API_URL}/api/blog-posts/${postId}`
        : `${process.env.REACT_APP_API_URL}/api/blog-posts`;

      await axios[method](url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Post saved successfully!");
      fetchPosts();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save post");
      if (err.response?.status === 401) window.location = "/admin/login";
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {postId ? "Edit Post" : "Create New Post"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
          title="Close"
          aria-label="Close form"
        >
          <FiX className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
        </button>
      </div>

      {(error || success) && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          <span>{error || success}</span>
          <button
            onClick={() => {
              setError("");
              setSuccess("");
            }}
            className="ml-4 p-1 hover:opacity-70 transition-opacity"
            aria-label="Dismiss message"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.title}
            onChange={(e) =>
              setFormData((p) => ({ ...p, title: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.category}
            onChange={(e) =>
              setFormData((p) => ({ ...p, category: e.target.value }))
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-48 transition-all"
            value={formData.content}
            onChange={(e) =>
              setFormData((p) => ({ ...p, content: e.target.value }))
            }
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image {!postId && <span className="text-red-600">*</span>}
            </label>
            <div className="flex items-center gap-4">
              <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-gray-600 text-sm">Upload Cover</span>
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, "cover")}
                  accept="image/*"
                  className="hidden"
                />
              </label>
              {(formData.coverImagePreview || formData.existingCover) && (
                <div className="relative w-48 h-48 rounded-lg overflow-hidden border group">
                  <img
                    src={
                      formData.coverImagePreview ||
                      `${process.env.REACT_APP_API_URL}/uploads/${formData.existingCover}`
                    }
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(null, "cover")}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-red-50 text-red-600 backdrop-blur-sm transition-all"
                    aria-label="Remove cover image"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Images
            </label>
            <label className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-600 text-sm">
                Upload Content Images
              </span>
              <input
                type="file"
                multiple
                onChange={(e) => handleImageChange(e, "content")}
                accept="image/*"
                className="hidden"
              />
            </label>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.contentImagePreviews.map((src, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border group"
                >
                  <img
                    src={src}
                    alt={`Content ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, "newContent")}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-red-50 text-red-600 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {formData.existingImages.map((img, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative aspect-square rounded-lg overflow-hidden border group"
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${img}`}
                    alt={`Existing content ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index, "existingContent")}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm hover:bg-red-50 text-red-600 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 flex items-center gap-2 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isSubmitting && <FiLoader className="animate-spin" />}
            {postId ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminBlogPostForm;
