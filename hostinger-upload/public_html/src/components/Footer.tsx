import { Link } from 'wouter';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettings } from '@/hooks/useSettings';
import { getSocialLinks } from '@/utils/social';
import { getWorkingHours } from '@/utils/workingHours';
import { getLogo } from '@/utils/logo';

const Footer = () => {
  const { t, getDirection } = useTranslation();
  const [links, setLinks] = useState(getSocialLinks());
  const [hours, setHours] = useState(getWorkingHours());
  const [logo, setLogo] = useState(getLogo());
  const isRtl = getDirection() === 'rtl';
  
  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setLinks(getSocialLinks());
    };
    
    const handleWorkingHoursChange = () => {
      setHours(getWorkingHours());
    };
    
    const handleLogoChange = () => {
      setLogo(getLogo());
    };
    
    // Update data when localStorage changes
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleWorkingHoursChange);
    window.addEventListener('storage', handleLogoChange);
    
    // Custom events for admin panel updates
    document.addEventListener('socialLinksUpdated', handleStorageChange);
    document.addEventListener('workingHoursUpdated', handleWorkingHoursChange);
    document.addEventListener('logoUpdated', handleLogoChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleWorkingHoursChange);
      window.removeEventListener('storage', handleLogoChange);
      document.removeEventListener('socialLinksUpdated', handleStorageChange);
      document.removeEventListener('workingHoursUpdated', handleWorkingHoursChange);
      document.removeEventListener('logoUpdated', handleLogoChange);
    };
  }, []);

  return (
    <footer className="bg-secondary dark:bg-secondary/90 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
              <img 
                className="h-16 sm:h-12 w-auto object-contain mb-3 sm:mb-0" 
                src={logo.url} 
                alt={logo.alt} 
              />
              <div className={`${isRtl ? "sm:mr-3" : "sm:ml-3"}`}>
                <h3 className="text-xl font-bold text-primary">{t('app.title')}</h3>
                <p className="text-xs text-white/70">{t('app.subtitle')}</p>
              </div>
            </div>
            <p className="text-white/70 dark:text-white/80 mb-6 text-sm sm:text-base">
              {t('home.about.subtitle')}
            </p>
            <div className="flex justify-center sm:justify-start gap-6 sm:gap-8">
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary dark:hover:text-primary transition text-2xl sm:text-xl">
                <i className="bi bi-instagram"></i>
              </a>
              <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary dark:hover:text-primary transition text-2xl sm:text-xl">
                <i className="bi bi-facebook"></i>
              </a>
              <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary dark:hover:text-primary transition text-2xl sm:text-xl">
                <i className="bi bi-youtube"></i>
              </a>
              <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary dark:hover:text-primary transition text-2xl sm:text-xl">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-primary dark:text-primary mb-4 sm:mb-6">{t('footer.quicklinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/70 dark:text-white/80 hover:text-primary dark:hover:text-primary transition">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-white/70 dark:text-white/80 hover:text-primary dark:hover:text-primary transition">
                  {t('nav.menu')}
                </Link>
              </li>

              <li>
                <Link href="/contact" className="text-white/70 dark:text-white/80 hover:text-primary dark:hover:text-primary transition">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-primary dark:text-primary mb-4 sm:mb-6">{t('footer.hours')}</h4>
            <ul className="space-y-3">
              <li className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-white/70 dark:text-white/80 font-medium mb-1 sm:mb-0">{t('footer.hours.weekdays')}:</span>
                <span className="text-white dark:text-white text-sm sm:text-base">{hours.weekdays}</span>
              </li>
              <li className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-white/70 dark:text-white/80 font-medium mb-1 sm:mb-0">{t('footer.hours.weekend')}:</span>
                <span className="text-white dark:text-white text-sm sm:text-base">{hours.weekend}</span>
              </li>
              <li className="flex flex-col sm:flex-row sm:justify-between">
                <span className="text-white/70 dark:text-white/80 font-medium mb-1 sm:mb-0">{t('footer.hours.sunday')}:</span>
                <span className="text-white dark:text-white text-sm sm:text-base">{hours.sunday}</span>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-bold text-primary dark:text-primary mb-4 sm:mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex flex-col sm:flex-row items-center sm:items-start">
                <i className={`bi bi-geo-alt text-primary dark:text-primary text-xl mb-2 sm:mb-0 sm:mt-1 ${isRtl ? 'sm:ml-3' : 'sm:mr-3'}`}></i>
                <span className="text-white/70 dark:text-white/80 text-sm sm:text-base">{t('contact.address.value')}</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start">
                <i className={`bi bi-telephone text-primary dark:text-primary text-xl mb-2 sm:mb-0 sm:mt-1 ${isRtl ? 'sm:ml-3' : 'sm:mr-3'}`}></i>
                <span dir="ltr" className="text-white/70 dark:text-white/80 text-sm sm:text-base">{t('contact.phone.value')}</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start">
                <i className={`bi bi-envelope text-primary dark:text-primary text-xl mb-2 sm:mb-0 sm:mt-1 ${isRtl ? 'sm:ml-3' : 'sm:mr-3'}`}></i>
                <span dir="ltr" className="text-white/70 dark:text-white/80 text-sm sm:text-base">{t('contact.email.value')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 dark:border-white/20 text-center">
          <p className="text-white/60 dark:text-white/70 text-xs sm:text-sm">
            Copyright © ROYLE LOKANTA, All Right Reserved.
            <br className="sm:hidden" /> 
            <span className="hidden sm:inline"> </span>
            Designed By{' '}
            <a 
              href="https://www.facebook.com/hatem.ko123" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/90 transition underline"
            >
              HATEM KOBICY
            </a>
            <span className="hidden sm:inline mx-2">|</span>
            <br className="sm:hidden my-1" />
            <Link href="/admin/login" className="text-white/60 dark:text-white/70 hover:text-primary/80 dark:hover:text-primary/90 transition">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
