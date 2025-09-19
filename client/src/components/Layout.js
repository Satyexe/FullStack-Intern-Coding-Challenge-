import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Store, 
  Star, 
  LogOut, 
  User,
  BarChart3,
  Settings
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout, isAdmin, isStoreOwner } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavigationItems = () => {
    if (isAdmin()) {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/stores', label: 'Stores', icon: Store },
      ];
    } else if (isStoreOwner()) {
      return [
        { path: '/store-owner/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/store-owner/stores', label: 'My Stores', icon: Store },
      ];
    } else {
      return [
        { path: '/user/stores', label: 'Stores', icon: Store },
        { path: '/user/ratings', label: 'My Ratings', icon: Star },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Store className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">Store Rating App</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.name}</span>
                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                  {user?.role}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <ul className="space-y-2">
              {getNavigationItems().map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              
              <li>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/profile')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

