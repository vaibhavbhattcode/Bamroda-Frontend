import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const BlogPostSlider = () => {
  const [posts, setPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [sliderReady, setSliderReady] = useState(false);
  const navigate = useNavigate();
  const autoSlideInterval = useRef(null);
  const sliderRef = useRef(null);
  const isMounted = useRef(true);

  const fetchPosts = useCallback(async () => {
    try {
      const cachedPosts = sessionStorage.getItem("cachedSliderPosts");
      if (cachedPosts) {
        const parsedPosts = JSON.parse(cachedPosts);
        if (isMounted.current) {
          setPosts(parsedPosts);
          setSliderReady(true);
        }
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog-posts`, {
        timeout: 5000,
      });

      if (response.data?.length && isMounted.current) {
        const limitedPosts = response.data.slice(0, 5);
        setPosts(limitedPosts);
        setSliderReady(true);
        sessionStorage.setItem(
          "cachedSliderPosts",
          JSON.stringify(limitedPosts)
        );
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    fetchPosts();

    return () => {
      isMounted.current = false;
      clearInterval(autoSlideInterval.current);
    };
  }, [fetchPosts]);

  const extendedPosts = React.useMemo(() => {
    return posts.length > 0
      ? [posts[posts.length - 1], ...posts, posts[0]]
      : [];
  }, [posts]);

  const slideTo = useCallback(
    (newIndex) => {
      if (!sliderReady || !sliderRef.current) return;

      sliderRef.current.style.transition =
        "transform 700ms cubic-bezier(0.25,0.1,0.25,1)";
      setCurrentSlide(newIndex);

      const resetSlide = (index) => {
        if (sliderRef.current) {
          sliderRef.current.style.transition = "none";
          setCurrentSlide(index);
        }
      };

      if (newIndex === 0) {
        setTimeout(() => resetSlide(extendedPosts.length - 2), 700);
      } else if (newIndex === extendedPosts.length - 1) {
        setTimeout(() => resetSlide(1), 700);
      }
    },
    [sliderReady, extendedPosts.length]
  );

  useEffect(() => {
    if (extendedPosts.length > 1) {
      autoSlideInterval.current = setInterval(() => {
        slideTo(currentSlide + 1);
      }, 5000);
    }
    return () => clearInterval(autoSlideInterval.current);
  }, [currentSlide, extendedPosts.length, slideTo]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => slideTo(currentSlide + 1),
    onSwipedRight: () => slideTo(currentSlide - 1),
    trackMouse: true,
    delta: 50,
  });

  if (!sliderReady) {
    return (
      <div className="relative bg-green-50 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-green-200 rounded-lg w-48 mx-auto mb-6" />
            <div className="h-5 bg-green-200 rounded-lg w-64 mx-auto mb-12" />
            <div className="rounded-xl bg-green-200 h-96" />
            <div className="flex justify-center mt-8 space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-2 w-6 bg-green-300 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!posts.length) return null;

  return (
    <div className="relative bg-green-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-green-800 mb-3 font-serif">
            Village News & Updates
          </h2>
          <p className="text-green-600 text-lg">
            Stay Connected with Community Happenings
          </p>
        </div>

        <div {...swipeHandlers} className="relative group">
          <div className="relative overflow-hidden rounded-xl shadow-lg bg-white border-2 border-green-100">
            <div
              ref={sliderRef}
              className="flex"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {extendedPosts.map((post, index) => (
                <LazySlide
                  key={`${post._id}-${index}`}
                  post={post}
                  navigate={navigate}
                  isActive={currentSlide === index}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 space-x-3">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => slideTo(index + 1)}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentSlide - 1 === index
                  ? "w-8 bg-green-600"
                  : "w-4 bg-green-200 hover:bg-green-300"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const LazySlide = React.memo(({ post, navigate, isActive }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    if (isActive && imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [isActive]);

  return (
    <div className="min-w-full flex flex-col lg:flex-row p-6 gap-6">
      <div className="lg:w-1/2 relative overflow-hidden rounded-lg group/image shadow-md">
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent z-10" />
        {!loaded && (
          <div className="absolute inset-0 bg-green-100 animate-pulse z-0" />
        )}
        <img
          ref={imgRef}
          src={
            post.coverImage
              ? `${process.env.REACT_APP_API_URL}/uploads/${post.coverImage}`
              : "/village-default.jpg"
          }
          alt={post.title}
          className={`w-full h-80 lg:h-96 object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <span className="inline-block px-4 py-1 bg-amber-500 text-green-900 rounded-lg text-sm font-medium shadow-sm">
            Latest Update
          </span>
        </div>
      </div>

      <div className="lg:w-1/2 flex flex-col justify-center p-4 space-y-4 bg-white rounded-lg border border-green-100">
        <h3 className="text-2xl font-bold text-green-800 font-serif">
          {post.title}
        </h3>
        <p className="text-green-700 line-clamp-4 leading-relaxed">
          {post.content}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={() => navigate(`/blog/${post._id}`)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 hover:gap-3 shadow-sm"
          >
            <span>Read Full Story</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
          <button
            onClick={() => navigate("/news-articles")}
            className="px-5 py-2.5 border border-green-600 text-green-600 hover:bg-green-600/10 rounded-lg transition-colors duration-300"
          >
            All Community News
          </button>
        </div>
        <div className="mt-4 flex items-center text-sm text-green-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Posted by Village Committee</span>
        </div>
      </div>
    </div>
  );
});

export default BlogPostSlider;
