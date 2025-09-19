import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminStores from './pages/admin/Stores';
import AdminUserDetails from './pages/admin/UserDetails';
import AdminStoreDetails from './pages/admin/StoreDetails';

// User Pages
import UserStores from './pages/user/Stores';
import UserRatings from './pages/user/Ratings';

// Store Owner Pages
import StoreOwnerDashboard from './pages/storeOwner/Dashboard';
import StoreOwnerStores from './pages/storeOwner/Stores';

// Common Pages
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" replace /> : <Register />} 
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            {user?.role === 'ADMIN' && <Navigate to="/admin/dashboard" replace />}
            {user?.role === 'USER' && <Navigate to="/user/stores" replace />}
            {user?.role === 'STORE_OWNER' && <Navigate to="/store-owner/dashboard" replace />}
          </Layout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout>
            <AdminUsers />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users/:id" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout>
            <AdminUserDetails />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/stores" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout>
            <AdminStores />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/stores/:id" element={
        <ProtectedRoute requiredRole="ADMIN">
          <Layout>
            <AdminStoreDetails />
          </Layout>
        </ProtectedRoute>
      } />

      {/* User Routes */}
      <Route path="/user/stores" element={
        <ProtectedRoute requiredRole="USER">
          <Layout>
            <UserStores />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/user/ratings" element={
        <ProtectedRoute requiredRole="USER">
          <Layout>
            <UserRatings />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Store Owner Routes */}
      <Route path="/store-owner/dashboard" element={
        <ProtectedRoute requiredRole="STORE_OWNER">
          <Layout>
            <StoreOwnerDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/store-owner/stores" element={
        <ProtectedRoute requiredRole="STORE_OWNER">
          <Layout>
            <StoreOwnerStores />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Common Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

