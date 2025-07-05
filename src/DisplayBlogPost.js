import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ClockIcon, UserCircleIcon } from "@heroicons/react/24/outline";

const DisplayBlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/blog-posts/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse max-w-4xl mx-auto p-4 md:p-6 lg:p-8 my-4 md:my-8">
        <div className="h-48 md:h-64 lg:h-96 bg-gray-200 rounded-2xl mb-6" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center p-6 max-w-2xl bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            404
          </h1>
          <p className="text-lg md:text-xl text-gray-600">Post not found</p>
        </div>
      </div>
    );
  }

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Cover Image Section */}
      <div className="mb-8 md:mb-12 relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent rounded-2xl md:rounded-3xl" />
        <img
          src={
            post.coverImage
              ? `${process.env.REACT_APP_API_URL}/uploads/${post.coverImage}`
              : `${process.env.REACT_APP_API_URL}/default-image.jpg`
          }
          alt={post.title}
          className="w-full h-48 md:h-64 lg:h-96 object-cover rounded-2xl md:rounded-3xl shadow-lg"
          loading="lazy"
        />
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 text-white">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 text-xs md:text-sm font-medium">
            <span className="flex items-center gap-1 md:gap-2">
              <UserCircleIcon className="w-4 h-4 md:w-5 md:h-5" />
              {post.author || "Anonymous"}
            </span>
            <span className="flex items-center gap-1 md:gap-2">
              <ClockIcon className="w-4 h-4 md:w-5 md:h-5" />
              {calculateReadingTime(post.content)} min read
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight md:leading-normal">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="prose prose-base md:prose-lg max-w-none">
        <div className="text-gray-600 md:leading-relaxed whitespace-pre-line">
          {post.content.split("\n").map((paragraph, index) => (
            <p
              key={index}
              className="mb-4 md:mb-6 text-sm md:text-base lg:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Inline Images Grid */}
        {post.images?.length > 0 && (
          <div className="my-8 md:my-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-xl md:rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                >
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${image}`}
                    alt={`Post content ${index + 1}`}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-center text-xs md:text-sm text-white font-medium">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Meta Section */}
      <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
          <span className="flex items-center gap-1 md:gap-2">
            <UserCircleIcon className="w-4 h-4 md:w-5 md:h-5" />
            {post.author || "Anonymous"}
          </span>
          <span className="hidden md:inline">•</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </article>
  );
};

export default DisplayBlogPost;
