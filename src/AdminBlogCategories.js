import { useEffect, useState } from "react";
import axios from "axios";
import { FiTrash, FiPlus, FiLoader } from "react-icons/fi";

const AdminBlogCategories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/blog-categories`
      );
      setCategories(response.data);
      setError("");
    } catch (error) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    try {
      setProcessing("adding");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/blog-categories`,
        { name: categoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([...categories, response.data]);
      setCategoryName("");
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add category");
    } finally {
      setProcessing(null);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      setProcessing(id);
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/blog-categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete category");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Blog Categories Management
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter category name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setError("");
              }}
            />
            <button
              type="submit"
              disabled={processing === "adding"}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {processing === "adding" ? (
                <FiLoader className="animate-spin" />
              ) : (
                <FiPlus />
              )}
              Add Category
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center p-8">
            <FiLoader className="w-8 h-8 mx-auto animate-spin text-blue-600" />
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No categories found. Start by adding a new category.
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 divide-y">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{cat.name}</span>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    disabled={processing === cat._id}
                    className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
                  >
                    {processing === cat._id ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <FiTrash />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogCategories;
