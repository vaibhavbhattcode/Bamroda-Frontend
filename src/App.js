// src/App.js
import "./axiosConfig"; // Axios interceptor
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Gallery from "./Gallery";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import VillagerProfile from "./VillagerProfile";
import NotFound from "./NotFound";
import AdminRegister from "./AdminRegister";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminUserList from "./AdminUserList";
import AdminSidebar from "./AdminSidebar";
import UploadImages from "./AdminUploadImages";
import AdminGallery from "./AdminGallery";
import AdminSlider from "./AdminSlider";

// Admin blog pages
import AdminBlogCategories from "./AdminBlogCategories";
import AdminBlogPosts from "./AdminBlogPosts";
import AdminBlogPostForm from "./AdminBlogPostForm";
import DisplayBlogPost from "./DisplayBlogPost";
import News from "./News";

// New Events components
import EventsList from "./EventsList"; // For clients
import AdminAddEvent from "./AdminAddEvent"; // For adding events
import AdminManageEvents from "./AdminManageEvents"; // For managing events (list with edit/delete)
import AdminEditEvent from "./AdminEditEvent"; // For editing an event

// Protected Route Component
const ProtectedRoute = ({ children, admin = false }) => {
  const token = localStorage.getItem(admin ? "adminToken" : "token");
  return token ? children : <Navigate to={admin ? "/admin/login" : "/login"} />;
};

function Layout({ children }) {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/admin/login",
    "/admin/register",
    "/404",
  ];
  const isAuthenticated = localStorage.getItem("token");

  return (
    <>
      {isAuthenticated && !hideNavbarRoutes.includes(location.pathname) && (
        <Navbar />
      )}
      {children}
    </>
  );
}

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-100">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Layout>
                <Gallery />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/villagerprofile/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <VillagerProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <DisplayBlogPost />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/news-articles"
          element={
            <ProtectedRoute>
              <Layout>
                <News />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Client Events Route */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Layout>
                <EventsList />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminUserList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/upload-images"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <UploadImages />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminGallery />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/adminslider"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminSlider />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        {/* New Admin Event Routes */}
        <Route
          path="/admin/events/new"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminAddEvent />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/manage"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminManageEvents />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events/edit/:id"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminEditEvent />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* New Blog Management Routes */}
        <Route
          path="/admin/blog-categories"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminBlogCategories />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog-posts"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminBlogPosts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog-posts/new"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminBlogPostForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blog-posts/edit/:id"
          element={
            <ProtectedRoute admin>
              <AdminLayout>
                <AdminBlogPostForm />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
