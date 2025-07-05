import React from "react";
import { useNavigate } from "react-router-dom";
import { Trees } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl w-full">
        {/* Tree and 404 Container */}
        <div className="relative mb-8 mx-auto w-fit">
          <Trees className="w-32 h-32 text-emerald-600" />

          {/* 404 Badge */}
          <div className="absolute -top-2 -right-2 bg-amber-100 rounded-full p-4 shadow-lg">
            <span className="text-4xl font-bold text-amber-600">404</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-emerald-800 mb-4">
          Path Not Found
        </h1>
        <p className="text-base md:text-lg text-emerald-600 mb-8 max-w-md mx-auto">
          The trail you're following has disappeared into the forest. Let's
          guide you back to the village square.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-medium 
          shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center 
          gap-2 mx-auto text-sm md:text-base"
        >
          <span>Return to Village</span>
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
