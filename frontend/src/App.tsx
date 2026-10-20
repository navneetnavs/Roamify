import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ToastViewport from './components/ui/Toast';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import HotelDetail from './pages/HotelDetail';
import BookingFlow from './pages/BookingFlow';
import BookingStatusPage from './pages/BookingStatus';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import HotelEdit from './pages/admin/HotelEdit';
import Inventory from './pages/admin/Inventory';

// ─── Route Guards ─────────────────────────────────────────────────────────────

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner fullPage />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isManager, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner fullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isManager) return <Navigate to="/" replace />;
  return <>{children}</>;
};

// ─── App Content ─────────────────────────────────────────────────────────────

function AppContent() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/search" element={<Search />} />
      <Route path="/hotels/:id" element={<HotelDetail />} />

      {/* Auth (redirect if already logged in) */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Protected Guest Routes */}
      <Route path="/booking/:bookingId" element={<PrivateRoute><BookingFlow /></PrivateRoute>} />
      <Route path="/booking/:bookingId/status" element={<PrivateRoute><BookingStatusPage /></PrivateRoute>} />
      <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/hotels/new" element={<AdminRoute><HotelEdit /></AdminRoute>} />
      <Route path="/admin/hotels/:hotelId" element={<AdminRoute><HotelEdit /></AdminRoute>} />
      <Route path="/admin/inventory/:roomId" element={<AdminRoute><Inventory /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastViewport />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
