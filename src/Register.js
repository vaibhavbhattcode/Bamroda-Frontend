import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, Trees, Mountain, Mail, ShieldCheck } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const sendCode = async () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "ઇમેઇલ જરૂરી છે." }));
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/send-verification`, {
        email: formData.email,
      });
      setCodeSent(true);
      setMessage({
        text: "વેરિફિકેશન કોડ મોકલવામાં આવ્યો છે.",
        type: "success",
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage({
        text: "કોઈક ભૂલ છે, કોડ મોકલવામાં ત્રુટિ.",
        type: "error",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "યુઝર નામ જરૂરી છે.";
    if (!formData.email) newErrors.email = "ઇમેઇલ જરૂરી છે.";
    if (!formData.password) {
      newErrors.password = "પાસવર્ડ જરૂરી છે.";
    } else if (formData.password.length < 6) {
      newErrors.password = "પાસવર્ડમાં ઓછામાં ઓછા 6 અક્ષરો હોવા જોઈએ.";
    }
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "પાસવર્ડ મેલ ખાય છે.";
    if (codeSent && !formData.code) newErrors.code = "પ્રમાણપત્ર કોડ જરૂરી છે.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, formData);
      setMessage({
        text: "રજીસ્ટ્રેશન થઇ ગયું છે, કૃપા કરી લોગિન કરો.",
        type: "success",
      });
      setTimeout(() => navigate("/login"), 2000);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setMessage({
        text: err.response?.data?.message || "રજીસ્ટ્રેશનમાં ત્રુટિ.",
        type: "error",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-emerald-50 overflow-hidden flex items-center justify-center p-4">
      {/* Village Background Elements */}
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
      </div>

      {/* Registration Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border-2 border-emerald-200/50">
        <div className="text-center mb-8">
          <Mountain className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-3xl font-serif font-bold text-emerald-800 mb-2">
            એકાઉન્ટ બનાવો
          </h2>
          <p className="text-emerald-600">
            ગ્રામ સમુદાયમાં જોડાવા માટે નોંધણી કરો
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.type === "success"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {/* ... [keep existing icon paths] ... */}
            </svg>
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-emerald-800 mb-2">
              યુઝર નામ
            </label>
            <div className="relative">
              <input
                name="username"
                placeholder="તમારું નામ દાખલ કરો"
                className="w-full px-4 py-3 pl-11 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                onChange={handleChange}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
            </div>
            {errors.username && (
              <p className="text-sm text-amber-600 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email + Verification Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  ઇમેઇલ સરનામું
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    placeholder="તમારું ઇમેઇલ દાખલ કરો"
                    className="w-full px-4 py-3 pl-11 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    onChange={handleChange}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <Mail className="w-5 h-5" />
                  </span>
                </div>
              </div>

              <div className="self-end">
                <button
                  type="button"
                  className="w-full h-[42px] bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg 
                    transition-colors flex items-center justify-center gap-2 disabled:opacity-80"
                  onClick={sendCode}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span>કોડ મેળવો</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            {errors.email && (
              <p className="text-sm text-amber-600 mt-1">{errors.email}</p>
            )}

            {/* Verification Code Input */}
            {codeSent && (
              <div className="space-y-2 transition-all duration-300">
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  ચકાસણી કોડ
                </label>
                <div className="relative">
                  <input
                    name="code"
                    placeholder="તમારો 6-અંકનો કોડ દાખલ કરો"
                    className="w-full px-4 py-3 pl-11 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    onChange={handleChange}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                </div>
                {errors.code && (
                  <p className="text-sm text-amber-600 mt-1">{errors.code}</p>
                )}
              </div>
            )}
          </div>

          {/* Password Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  પાસવર્ડ
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type="password"
                    placeholder="ઓછામાં ઓછા 6 અક્ષરો"
                    className="w-full px-4 py-3 pl-11 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    onChange={handleChange}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                </div>
                {errors.password && (
                  <p className="text-sm text-amber-600 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-emerald-800 mb-2">
                  પાસવર્ડ ફરી દાખલ કરો
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="પાસવર્ડની પુષ્ટિ કરો"
                    className="w-full px-4 py-3 pl-11 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    onChange={handleChange}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-amber-600 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 
                text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 
                disabled:opacity-80"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>રજીસ્ટર કરો</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-emerald-700 border-t border-emerald-100 pt-6">
          <p>
            પહેલેથી એકાઉન્ટ છે?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-amber-600 hover:text-amber-700 underline underline-offset-4"
            >
              લોગ ઇન કરો
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
      `}</style>
    </div>
  );
}

export default Register;
