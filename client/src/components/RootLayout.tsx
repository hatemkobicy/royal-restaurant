import { useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { LanguageProvider, LanguageSelector } from './LanguageSelector';
import Navbar from './Navbar';
import Footer from './Footer';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface RootLayoutProps {
  children?: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated } = await apiClient.checkAuth();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <LanguageProvider>
      <LanguageSelector />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow bg-background">
          {children}
        </main>
        <Footer />
        
        {/* Admin Login Button (Fixed) */}
        <Button
          onClick={handleAdminClick}
          className="fixed bottom-4 left-4 bg-secondary hover:bg-secondary/90 text-white p-2 rounded-full shadow-lg z-20 transition duration-300"
          size="icon"
        >
          <i className="bi bi-person-lock text-xl"></i>
        </Button>
      </div>
    </LanguageProvider>
  );
};

export default RootLayout;
