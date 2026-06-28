// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AddressPage from "./pages/AddressPage.jsx";
import ResetPassword from "./pages/ResetPassword.jsx"; // ✅ added reset password page

// ✅ Dashboards from dashboards folder
import UserDashboard from "./dashboards/user/UserDashboard.jsx";
import OfficerDashboard from "./dashboards/officer/OfficerDashboard.jsx";
import AdminDashboard from "./dashboards/admin/AdminDashboard.jsx";

// ✅ ProtectedRoute wrapper
function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // No token → redirect to login
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && role !== roleRequired) {
    // Wrong role → redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboards with protection */}
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute roleRequired="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer-dashboard"
          element={
            <ProtectedRoute roleRequired="officer">
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Other pages */}
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/address" element={<AddressPage />} />

        {/* ✅ Forgot/Reset password route */}
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Catch-all route → redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
