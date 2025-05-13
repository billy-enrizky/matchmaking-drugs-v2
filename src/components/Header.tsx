import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PlusCircle, Pill, Package, LogOut, UserCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, hospital, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <PlusCircle className="text-blue-600 h-6 w-6" />
          <span className="font-semibold text-xl text-gray-800">MedExchange</span>
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                to="/request-drugs" 
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/request-drugs' 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Pill className="h-4 w-4" />
                <span>Request</span>
              </Link>
              <Link 
                to="/provide-drugs" 
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/provide-drugs' 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Package className="h-4 w-4" />
                <span>Provide</span>
              </Link>
              <Link 
                to="/requester-dashboard" 
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/requester-dashboard' 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>My Requests</span>
              </Link>
              <Link 
                to="/provider-dashboard" 
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/provider-dashboard' 
                    ? 'text-blue-700 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span>My Offers</span>
              </Link>
            </nav>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-blue-600" />
                <div className="text-sm font-medium text-gray-700">
                  {hospital?.name || user?.email}
                </div>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-1 p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {location.pathname !== '/login' && location.pathname !== '/account-setup' && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/account-setup"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};