import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiClient } from '@/lib/utils';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for mock token (for development)
        const token = localStorage.getItem('token');
        if (token === 'mock-admin-token') {
          setIsAuthenticated(true);
          setUser({
            id: 1,
            username: 'admin',
            isAdmin: true
          });
          setIsLoading(false);
          return;
        }
        
        // Regular auth check
        const { authenticated, user } = await apiClient.checkAuth();
        setIsAuthenticated(authenticated);
        setUser(user);
        
        if (!authenticated) {
          navigate('/admin/login');
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/admin/login');
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout
  };
}