import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trees, Loader2 } from "lucide-react";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        navigate("/", {
          state: { message: "લોગિન સફળ! હોમ પેજમાં સ્વાગત છે." },
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        formData
      );
      localStorage.setItem("token", response.data.token);
      setMessage(response.data.message);
      setShowSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || "કશુંક ભૂલ થયું.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="relative min-h-screen bg-emerald-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Clouds */}
        <div className="absolute top-20 left-[-10%] w-48 h-16 bg-white/30 rounded-full filter blur-xl animate-float-1"></div>
        <div className="absolute top-40 right-[-15%] w-64 h-20 bg-white/40 rounded-full filter blur-xl animate-float-2"></div>

        {/* Animated Trees */}
        <div className="absolute bottom-0 left-20 w-24 h-48 animate-sway-3">
          <Trees className="w-full h-full text-emerald-700" />
        </div>
        <div className="absolute bottom-0 right-32 w-20 h-40 animate-sway-4">
          <Trees className="w-full h-full text-emerald-600" />
        </div>

        {/* Floating Leaves */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-emerald-500/20 rounded-full animate-leaf-1"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-amber-400/20 rounded-full animate-leaf-2"></div>

        {/* Flying Bird */}
        <div className="absolute top-1/4 left-1/4 w-12 h-12 opacity-40 animate-fly">
          <svg viewBox="0 0 24 24" className="w-full h-full text-emerald-600">
            <path
              fill="currentColor"
              d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578a9.3 9.3 0 0 1-2.958 1.13a4.66 4.66 0 0 0-7.938 4.25a13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568a4.692 4.692 0 0 1-2.104.08a4.661 4.661 0 0 0 4.352 3.234a9.348 9.348 0 0 1-5.786 1.995a9.5 9.5 0 0 1-1.112-.065a13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254c0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41l.002-.003z"
            />
          </svg>
        </div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${8 + i * 2}s infinite linear`,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex items-center justify-center p-4 min-h-screen">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border-2 border-emerald-200/50">
          {/* Success Overlay */}
          {showSuccess && (
            <div className="absolute inset-0 bg-emerald-50/95 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
              <div className="animate-checkmark flex flex-col items-center justify-center space-y-4">
                <div className="relative w-32 h-32">
                  <svg
                    viewBox="0 0 52 52"
                    className="w-full h-full text-emerald-600 animate-checkmark-svg"
                  >
                    <circle
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="origin-center"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                      className="origin-center"
                    />
                  </svg>
                </div>
                <p className="text-emerald-700 font-medium text-xl animate-fade-in delay-300">
                  લોગિન સફળ!
                </p>
              </div>
            </div>
          )}

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-emerald-800">
              લોગિન કરો
            </h2>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center text-sm font-medium ${
                message.toLowerCase().includes("સફળ")
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-emerald-800 text-sm font-medium mb-2"
              >
                ઈમેઇલ
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="તમારું ઈમેઇલ દાખલ કરો"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-emerald-800 text-sm font-medium mb-2"
              >
                પાસવર્ડ
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="તમારો પાસવર્ડ દાખલ કરો"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all relative disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mx-auto animate-spin" />
              ) : (
                "લોગિન કરો"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-emerald-700">
            તમારું એકાઉન્ટ નથી?{" "}
            <button
              onClick={redirectToRegister}
              className="text-amber-600 hover:text-amber-700 font-medium underline underline-offset-4"
            >
              રજીસ્ટર કરો
            </button>
          </p>
        </div>
      </div>

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(3deg);
          }
        }
        @keyframes sway {
          0%,
          100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }
        @keyframes leaf {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes fly {
          0% {
            transform: translate(-50px, 50px) scale(0.8);
            opacity: 0;
          }
          50% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          100% {
            transform: translate(50px, -50px) scale(0.8);
            opacity: 0;
          }
        }
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 50;
            opacity: 0;
            transform: scale(0);
          }
          80% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            stroke-dashoffset: 0;
            transform: scale(1);
          }
        }
        .animate-float-1 {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float 10s ease-in-out infinite 2s;
        }
        .animate-sway-3 {
          animation: sway 6s ease-in-out infinite;
        }
        .animate-sway-4 {
          animation: sway 7s ease-in-out infinite 1s;
        }
        .animate-leaf-1 {
          animation: leaf 15s linear infinite;
        }
        .animate-leaf-2 {
          animation: leaf 18s linear infinite 3s;
        }
        .animate-fly {
          animation: fly 6s linear infinite;
        }
        .animate-checkmark circle {
          animation: checkmark 1s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
        }
        .animate-checkmark path {
          animation: checkmark 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.3s forwards;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
        }
      `}</style>
    </div>
  );
}

export default Login;
