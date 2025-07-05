import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, LogOut, ChevronDown } from "lucide-react";

// Replace this with your actual logo import or URL
import villageLogo from "./assets/bamroda_logo.png";

function Navbar({ username }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  // This height will now only reflect the base navbar (logo, nav links, etc.)
  const [baseNavbarHeight, setBaseNavbarHeight] = useState(0);

  // Refs
  const navRef = useRef(null);
  const baseNavRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Function to update the base navbar height.
  const updateBaseNavbarHeight = () => {
    if (baseNavRef.current) {
      setBaseNavbarHeight(baseNavRef.current.offsetHeight);
    }
  };

  // Update the base navbar height on mount and when dependencies change.
  useEffect(() => {
    updateBaseNavbarHeight();
  }, [isMobileMenuOpen, isSearchOpen]);

  // Update on window resize.
  useEffect(() => {
    window.addEventListener("resize", updateBaseNavbarHeight);
    return () => window.removeEventListener("resize", updateBaseNavbarHeight);
  }, []);

  // Listen for route changes and clear search state.
  useEffect(() => {
    setIsSearchOpen(false);
    setSuggestions([]);
    setSearchQuery("");
  }, [location.pathname]);

  // Click-outside handler to close dropdowns, mobile search, and mobile menu.
  useEffect(() => {
    const handleClickOutside = (event) => {
      // For desktop search and its suggestions.
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]);
        setSuggestionIndex(-1);
      }
      // For mobile search container.
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
      // For mobile menu.
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", {
      state: { message: "You have been logged out successfully." },
    });
  };

  // Toggle mobile menu.
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSuggestionIndex(-1);

    if (query.length > 2) {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/villagers?search=${query}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Enable keyboard navigation.
  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSuggestionIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
      } else if (e.key === "Enter") {
        if (suggestionIndex >= 0 && suggestionIndex < suggestions.length) {
          handleSuggestionClick(suggestions[suggestionIndex].userId);
        }
      }
    }
  };

  // When a suggestion is clicked, navigate and clear all search/mobile states.
  const handleSuggestionClick = (userId) => {
    navigate(`/villagerprofile/${userId}`);
    setSearchQuery("");
    setSuggestions([]);
    setSuggestionIndex(-1);
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Helper for mobile navigation link clicks.
  const handleMobileNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="bg-emerald-50 text-emerald-900 shadow-lg fixed top-0 w-full z-50 border-b border-emerald-100"
      >
        <div
          ref={baseNavRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20"
        >
          {/* Village Logo */}
          <img
            src={villageLogo}
            alt="Village Logo"
            className="cursor-pointer h-16 w-auto transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/")}
          />

          {/* Desktop Search */}
          <div className="relative flex-grow max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Find community members..."
                className="w-full py-3 pl-12 pr-6 rounded-full bg-white border-2 border-emerald-200 text-emerald-900 placeholder-emerald-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 shadow-sm"
                ref={desktopSearchRef}
              />
              <Search className="absolute left-4 top-3.5 text-emerald-500 w-5 h-5" />
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute bg-white text-emerald-900 w-full mt-2 rounded-xl shadow-xl z-20 border border-emerald-100"
                    ref={suggestionsRef}
                  >
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={suggestion.userId}
                        className={`px-4 py-3 cursor-pointer hover:bg-emerald-50 ${
                          index === suggestionIndex ? "bg-emerald-50" : ""
                        }`}
                        onClick={() => handleSuggestionClick(suggestion.userId)}
                      >
                        <span className="font-medium block">
                          {suggestion.fullName}
                        </span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-lg font-medium">
            <button
              onClick={() => navigate("/")}
              className="relative px-2 py-1 text-emerald-900 hover:text-amber-600 transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-600 hover:after:w-full after:transition-all after:duration-300"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="relative px-2 py-1 text-emerald-900 hover:text-amber-600 transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-amber-600 hover:after:w-full after:transition-all after:duration-300"
            >
              Profile
            </button>

            <div
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center px-2 py-1 text-emerald-900 hover:text-amber-600 transition-colors duration-300">
                Community <ChevronDown className="ml-1 w-5 h-5" />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute bg-white text-emerald-900 mt-2 w-48 rounded-xl shadow-xl border border-emerald-100"
                  >
                    {[
                      "Gallery",
                      "News & Articles",
                      "Events",
                      "Contact Elders",
                    ].map((item) => (
                      <button
                        key={item}
                        className="block w-full text-left px-5 py-3 hover:bg-emerald-50 transition-colors duration-300 border-b border-emerald-100 last:border-0"
                        onClick={() =>
                          navigate(
                            `/${item
                              .toLowerCase()
                              .replace(/ & /g, "-")
                              .replace(/ /g, "-")}`
                          )
                        }
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors duration-300 shadow-md hover:shadow-lg"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-4">
            <Search
              className="text-emerald-900 w-6 h-6 cursor-pointer hover:text-amber-600 transition-colors duration-300"
              onClick={() => setIsSearchOpen((prev) => !prev)}
            />
            <button
              onClick={toggleMobileMenu}
              className="text-emerald-900 hover:text-amber-600 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              ref={mobileSearchRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="md:hidden bg-white px-4 pb-4 border-t border-emerald-100 w-full"
              style={{ top: baseNavbarHeight }}
            >
              <div className="relative mt-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Find community members..."
                  className="w-full py-3 pl-12 pr-6 rounded-full bg-white border-2 border-emerald-200 text-emerald-900 placeholder-emerald-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 shadow-sm"
                />
                <Search className="absolute left-4 top-3.5 text-emerald-500 w-5 h-5" />
                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute bg-white text-emerald-900 w-full mt-2 rounded-xl shadow-xl z-20 border border-emerald-100"
                    >
                      {suggestions.map((suggestion, index) => (
                        <li
                          key={suggestion.userId}
                          className={`px-4 py-3 cursor-pointer hover:bg-emerald-50 ${
                            index === suggestionIndex ? "bg-emerald-50" : ""
                          }`}
                          onClick={() =>
                            handleSuggestionClick(suggestion.userId)
                          }
                        >
                          <span className="font-medium block">
                            {suggestion.fullName}
                          </span>
                          <span className="text-sm text-emerald-600">
                            {suggestion.familyHead}
                          </span>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 w-full bg-white border-t border-emerald-100 flex flex-col py-4 px-6 space-y-4"
              ref={mobileMenuRef}
            >
              {[
                "Home",
                "Profile",
                "Gallery",
                "News & Articles",
                "Events",
                "Contact Elders",
              ].map((item) => {
                const path =
                  item === "Home"
                    ? "/" // Use root path for Home
                    : `/${item
                        .toLowerCase()
                        .replace(/ & /g, "-")
                        .replace(/ /g, "-")}`;

                return (
                  <button
                    key={item}
                    className="text-emerald-900 hover:text-amber-600 text-lg font-medium transition-colors duration-300 py-2 text-left"
                    onClick={() => handleMobileNavClick(path)}
                  >
                    {item}
                  </button>
                );
              })}
              <button
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors duration-300 shadow-md mt-4"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer */}
      <div style={{ height: baseNavbarHeight }} />
    </>
  );
}

export default Navbar;
