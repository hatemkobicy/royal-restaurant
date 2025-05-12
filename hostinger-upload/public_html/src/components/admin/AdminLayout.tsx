import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { t, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const [location, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // The hook will redirect to login
  }

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { path: '/admin', icon: 'grid', label: t('admin.dashboard') },
    { path: '/admin/categories', icon: 'tags', label: t('admin.categories') },
    { path: '/admin/menu-items', icon: 'egg-fried', label: t('admin.menu-items') },
    { path: '/admin/settings', icon: 'gear', label: t('admin.settings') }
  ];

  // For each route, check if the current location matches
  const isActive = (path: string) => {
    if (path === '/admin' && location === '/admin') return true;
    if (path !== '/admin' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar for desktop */}
      <div className="w-64 hidden md:block bg-white dark:bg-card shadow-lg">
        <div className="p-4 border-b dark:border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary dark:text-primary">{t('admin.dashboard')}</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-foreground hover:text-accent dark:text-foreground dark:hover:text-accent"
            >
              <i className="bi bi-x-lg"></i>
            </Button>
          </div>
        </div>
        
        <div className="py-4">
          <div className="px-4 mb-4">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className={isRtl ? "mr-3" : "ml-3"}>
                <p className="text-sm font-medium text-secondary dark:text-secondary">
                  {user?.username || t('admin.dashboard')}
                </p>
                <p className="text-xs text-foreground/70 dark:text-foreground/80">admin@royalrestaurant.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-1">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div className={`sidebar-item flex items-center px-4 py-2 text-secondary hover:text-primary transition ${
                  isActive(item.path) ? 'active bg-primary/10' : ''
                }`}>
                  <i className={`bi bi-${item.icon} ${isRtl ? 'ml-3' : 'mr-3'}`}></i>
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="mt-auto p-4 border-t">
          <Button 
            variant="ghost" 
            className="flex items-center text-accent hover:text-accent/80 transition"
            onClick={handleLogout}
          >
            <i className={`bi bi-box-arrow-right ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
            <span>{t('admin.logout')}</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-white dark:bg-card border-b border-gray-200 dark:border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground dark:text-foreground -ml-1 mr-2"
            >
              <i className="bi bi-list text-xl"></i>
            </Button>
            <h1 className="text-lg font-bold text-primary dark:text-primary">{t('admin.dashboard')}</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-accent dark:text-accent"
          >
            <i className="bi bi-box-arrow-right"></i>
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-60" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-card shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b dark:border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary dark:text-primary">{t('admin.dashboard')}</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground hover:text-accent dark:text-foreground dark:hover:text-accent"
                >
                  <i className="bi bi-x-lg"></i>
                </Button>
              </div>
            </div>
            
            <div className="py-4">
              <div className="px-4 mb-4">
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className={isRtl ? "mr-3" : "ml-3"}>
                    <p className="text-sm font-medium text-secondary dark:text-secondary">
                      {user?.username || t('admin.dashboard')}
                    </p>
                    <p className="text-xs text-foreground/70 dark:text-foreground/80">admin@royalrestaurant.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-1">
                {menuItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <div 
                      className={`sidebar-item flex items-center px-4 py-2 text-secondary hover:text-primary transition ${
                        isActive(item.path) ? 'active bg-primary/10' : ''
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <i className={`bi bi-${item.icon} ${isRtl ? 'ml-3' : 'mr-3'}`}></i>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="mt-auto p-4 border-t">
              <Button 
                variant="ghost" 
                className="flex items-center text-accent hover:text-accent/80 transition"
                onClick={handleLogout}
              >
                <i className={`bi bi-box-arrow-right ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
                <span>{t('admin.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 bg-gray-50 dark:bg-background/95 md:p-8 pt-16 md:pt-0">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
