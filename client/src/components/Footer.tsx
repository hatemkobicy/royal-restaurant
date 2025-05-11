import { Link } from 'wouter';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettings } from '@/hooks/useSettings';
import { getSocialLinks } from '@/utils/social';

const Footer = () => {
  const { t, getDirection } = useTranslation();
  const [links, setLinks] = useState(getSocialLinks());
  const isRtl = getDirection() === 'rtl';
  
  // Listen for localStorage changes to update social links
  useEffect(() => {
    const handleStorageChange = () => {
      setLinks(getSocialLinks());
    };
    
    // Update links when localStorage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for when social links are updated in the admin panel
    document.addEventListener('socialLinksUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('socialLinksUpdated', handleStorageChange);
    };
  }, []);

  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <div className="flex items-center mb-6">
              <img 
                className="h-12 w-auto" 
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80" 
                alt="Royal Restaurant Logo" 
              />
              <div className={isRtl ? "mr-3" : "ml-3"}>
                <h3 className="text-xl font-bold text-primary">{t('app.title')}</h3>
                <p className="text-xs text-white/70">{t('app.subtitle')}</p>
              </div>
            </div>
            <p className="text-white/70 mb-6">
              {t('home.about.subtitle')}
            </p>
            <div className="flex gap-8">
              <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition text-xl">
                <i className="bi bi-instagram"></i>
              </a>
              <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition text-xl">
                <i className="bi bi-facebook"></i>
              </a>
              <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition text-xl">
                <i className="bi bi-youtube"></i>
              </a>
              <a href={links.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition text-xl">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-primary mb-6">{t('footer.quicklinks')}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/70 hover:text-primary transition">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-white/70 hover:text-primary transition">
                  {t('nav.menu')}
                </Link>
              </li>

              <li>
                <Link href="/contact" className="text-white/70 hover:text-primary transition">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="text-lg font-bold text-primary mb-6">{t('footer.hours')}</h4>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-white/70">{t('footer.hours.weekdays')}:</span>
                <span className="text-white">12:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/70">{t('footer.hours.weekend')}:</span>
                <span className="text-white">12:00 - 00:00</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/70">{t('footer.hours.sunday')}:</span>
                <span className="text-white">12:00 - 22:00</span>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-bold text-primary mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex">
                <i className={`bi bi-geo-alt text-primary mt-1 ${isRtl ? 'ml-3' : 'mr-3'}`}></i>
                <span className="text-white/70">{t('contact.address.value')}</span>
              </li>
              <li className="flex">
                <i className={`bi bi-telephone text-primary mt-1 ${isRtl ? 'ml-3' : 'mr-3'}`}></i>
                <span className="text-white/70">{t('contact.phone.value')}</span>
              </li>
              <li className="flex">
                <i className={`bi bi-envelope text-primary mt-1 ${isRtl ? 'ml-3' : 'mr-3'}`}></i>
                <span className="text-white/70">{t('contact.email.value')}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/60">
            Copyright © ROYLE LOKANTA, All Right Reserved. Designed By{' '}
            <a 
              href="https://www.facebook.com/hatem.ko123" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition underline"
            >
              HATEM KOBICY
            </a>
            <span className="mx-2">|</span>
            <Link href="/admin/login" className="text-white/60 hover:text-primary/80 transition">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
