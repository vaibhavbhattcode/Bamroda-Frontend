import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiLogOut,
  FiImage,
  FiUpload,
  FiSliders,
  FiFolder,
  FiFileText,
  FiChevronRight,
  FiUser,
  FiCalendar,
  FiEdit,
} from "react-icons/fi";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check screen size on resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  // Updated menu items including new event-related links
  const menuItems = [
    { path: "/admin", name: "Dashboard", icon: FiHome },
    { path: "/admin/users", name: "User List", icon: FiUsers },
    { path: "/admin/upload-images", name: "Upload Images", icon: FiUpload },
    { path: "/admin/gallery", name: "Admin Gallery", icon: FiImage },
    { path: "/admin/adminslider", name: "Admin Slider", icon: FiSliders },
    { path: "/admin/blog-categories", name: "Blog Categories", icon: FiFolder },
    { path: "/admin/blog-posts", name: "Blog Posts", icon: FiFileText },
    // New event links:
    { path: "/admin/events/new", name: "Add Event", icon: FiCalendar },
    { path: "/admin/events/manage", name: "Manage Events", icon: FiEdit },
  ];

  return (
    <>
      {/* Inline styles to hide scrollbar */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-gray-300 w-64 min-h-screen fixed top-0 left-0 bottom-0 transition-transform z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0 shadow-xl overflow-y-auto flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <FiUser className="text-xl text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>
        </div>

        {/* Navigation Area with Scroll (scrollbar hidden) */}
        <nav className="p-4 flex-1 overflow-y-auto no-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-all
                    ${
                      location.pathname === item.path
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-gray-800 hover:text-white"
                    }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="flex-1">{item.name}</span>
                  <FiChevronRight className="w-4 h-4 opacity-70" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer (Profile & Logout Section) */}
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 space-x-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
      >
        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
      </button>

      {/* Main Content Placeholder */}
      <main
        className={`min-h-screen ${
          isOpen && isMobile ? "ml-64" : "ml-0"
        } sm:ml-64`}
      />
    </>
  );
};

export default AdminSidebar;
