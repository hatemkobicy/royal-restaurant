import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const { t, getDirection } = useTranslation();
  const [location] = useLocation();
  const { language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const isRtl = getDirection() === 'rtl';

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'tr' : 'ar');
  };

  return (
    <nav className={`bg-white sticky top-0 z-40 border-b border-primary/10 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex justify-start">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-12 w-auto" src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80" alt="Royal Restaurant Logo" />
              <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                <h1 className="text-xl font-bold text-primary">{t('app.title')}</h1>
                <p className="text-xs text-foreground/70">{t('app.subtitle')}</p>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-1">
            <Link href="/" className={`px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition duration-150 ${location === '/' ? 'text-primary' : ''}`}>
              {t('nav.home')}
            </Link>
            <Link href="/menu" className={`px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition duration-150 ${location === '/menu' ? 'text-primary' : ''}`}>
              {t('nav.menu')}
            </Link>

            <Link href="/contact" className={`px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition duration-150 ${location === '/contact' ? 'text-primary' : ''}`}>
              {t('nav.contact')}
            </Link>
            
            <div className={`${isRtl ? 'mr-3' : 'ml-3'} relative`}>
              <Button 
                variant="ghost" 
                onClick={toggleLanguage} 
                className="flex items-center text-sm font-medium text-foreground hover:text-primary transition duration-150"
              >
                <span>{language === 'ar' ? 'العربية' : 'Türkçe'}</span>
                <i className={`bi bi-globe ${isRtl ? 'me-1' : 'ms-1'} text-primary`}></i>
              </Button>
            </div>
            
            {/* Theme toggle for desktop */}
            <div className="ml-3">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary">
                  <i className="bi bi-list text-2xl"></i>
                </Button>
              </SheetTrigger>
              <SheetContent side={isRtl ? "right" : "left"} className="w-[250px] sm:w-[350px]">
                <div className="py-4 flex flex-col h-full">
                  <div className="px-2 space-y-1">
                    <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition duration-150">
                      {t('nav.home')}
                    </Link>
                    <Link href="/menu" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition duration-150">
                      {t('nav.menu')}
                    </Link>

                    <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 transition duration-150">
                      {t('nav.contact')}
                    </Link>
                    
                    <Button 
                      variant="ghost" 
                      onClick={toggleLanguage} 
                      className="mt-1 flex w-full items-center px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-md transition duration-150 justify-start"
                    >
                      <span>{language === 'ar' ? 'العربية' : 'Türkçe'}</span>
                      <i className={`bi bi-globe ${isRtl ? 'me-1' : 'ms-1'} text-primary`}></i>
                    </Button>

                    {/* Theme toggle for mobile */}
                    <div className="mt-2">
                      <ThemeToggle variant="ghost" showText={true} size="default" />
                    </div>
                  </div>
                  
                  <div className="mt-auto border-t border-gray-200 pt-4 px-2">
                    <div className="flex items-center">
                      <img className="h-8 w-auto" src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80" alt="Royal Restaurant Logo" />
                      <div className={`${isRtl ? 'mr-3' : 'ml-3'}`}>
                        <h1 className="text-sm font-bold text-primary">{t('app.title')}</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
