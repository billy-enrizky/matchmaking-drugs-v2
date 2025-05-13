import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface AuthCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AuthCheck: React.FC<AuthCheckProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};
