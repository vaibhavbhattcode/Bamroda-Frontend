import { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit, FiTrash, FiPlus, FiX, FiEye, FiLoader } from "react-icons/fi";
import AdminBlogPostForm from "./AdminBlogPostForm";

const BlogPostView = ({ post, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          {post.coverImage && (
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${post.coverImage}`}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          {post.images?.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.images.map((img) => (
                <img
                  key={img}
                  src={`${process.env.REACT_APP_API_URL}/uploads/${img}`}
                  alt={`Content ${img}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [viewPost, setViewPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog-posts`);
      setPosts(data.reverse());
      setError("");
    } catch (err) {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      setDeletingId(id);
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/blog-posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      setError("Failed to delete post. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Posts</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <FiPlus /> New Post
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3">
          <FiX className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isCreating ? (
        <AdminBlogPostForm
          postId={editPostId}
          onClose={() => {
            setIsCreating(false);
            setEditPostId(null);
          }}
          onSuccess={fetchPosts}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <FiLoader className="w-8 h-8 mx-auto animate-spin text-blue-600" />
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No blog posts found. Create your first post!
            </div>
          ) : (
            <div className="hidden sm:block">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{post.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {post.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setViewPost(post)}
                            className="text-green-600 hover:text-green-700 p-2 rounded-full hover:bg-green-50"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setEditPostId(post._id);
                              setIsCreating(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(post._id)}
                            disabled={deletingId === post._id}
                            className="text-red-600 hover:text-red-700 p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === post._id ? (
                              <FiLoader className="animate-spin" />
                            ) : (
                              <FiTrash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile View */}
          {!loading && posts.length > 0 && (
            <div className="sm:hidden space-y-4 p-4">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {post.category?.name || "Uncategorized"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewPost(post)}
                        className="text-green-600 p-2 hover:bg-green-50 rounded-full"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setEditPostId(post._id);
                          setIsCreating(true);
                        }}
                        className="text-blue-600 p-2 hover:bg-blue-50 rounded-full"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deletingId === post._id}
                        className="text-red-600 p-2 hover:bg-red-50 rounded-full disabled:opacity-50"
                      >
                        {deletingId === post._id ? (
                          <FiLoader className="animate-spin" />
                        ) : (
                          <FiTrash size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {viewPost && (
        <BlogPostView post={viewPost} onClose={() => setViewPost(null)} />
      )}
    </div>
  );
};

export default AdminBlogPosts;
