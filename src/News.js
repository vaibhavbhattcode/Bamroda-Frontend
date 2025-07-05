import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClockIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const News = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/blog-posts`
        );
        if (response.data && Array.isArray(response.data)) {
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-emerald-50 rounded-xl shadow-lg overflow-hidden border border-emerald-100"
            >
              <div className="h-48 bg-emerald-200" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-emerald-200 rounded w-3/4" />
                <div className="h-4 bg-emerald-200 rounded w-full" />
                <div className="h-4 bg-emerald-200 rounded w-5/6" />
                <div className="h-10 bg-amber-300 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-emerald-800 tracking-tight sm:text-5xl font-serif">
          Village News & Updates
        </h2>
        <p className="mt-4 text-xl text-emerald-600">
          Stay Connected with Community Happenings
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-emerald-600 text-lg">No articles available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out group overflow-hidden border border-emerald-100"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={
                    post.coverImage
                      ? `${process.env.REACT_APP_API_URL}/uploads/${post.coverImage}`
                      : "/village-default.jpg"
                  }
                  alt={post.title}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-emerald-900/20 to-transparent" />
                {Date.now() - new Date(post.createdAt).getTime() <
                  604800000 && (
                  <span className="absolute top-4 right-4 bg-amber-400 text-emerald-900 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                    New
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-emerald-600 mb-4">
                  <span className="flex items-center gap-1">
                    <UserCircleIcon className="w-5 h-5" />
                    {post.author || "Village Committee"}
                  </span>
                  <span className="text-emerald-300">•</span>
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-5 h-5" />
                    {calculateReadingTime(post.content)} min read
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-emerald-800 mb-3 font-serif">
                  {post.title}
                </h3>

                <p className="text-emerald-700 leading-relaxed line-clamp-3 mb-5">
                  {post.content.replace(/\n/g, " ").substring(0, 120)}...
                </p>

                <button
                  onClick={() => navigate(`/blog/${post._id}`)}
                  className="news-btn w-full py-3 px-6 border-2 border-emerald-600 text-emerald-700 hover:text-white font-semibold rounded-lg transition-all duration-500 flex items-center justify-center gap-2 shadow-sm relative overflow-hidden"
                >
                  <span className="relative z-10">Read Full Story</span>
                  <svg
                    className="w-4 h-4 relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Add this to your global CSS */}
      <style jsx global>{`
        .news-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background: #059669;
          transition: width 0.5s ease;
          z-index: 0;
        }
        .news-btn:hover::before {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default News;
