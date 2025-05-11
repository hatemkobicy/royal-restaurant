import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { toggleTheme, getTheme } from '@/utils/theme';
import { useLanguage } from '@/components/LanguageSelector';

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'icon' | 'default';
  showText?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'outline', 
  size = 'icon',
  showText = false
}) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(getTheme);
  const { language } = useLanguage();

  // Update theme state on change
  React.useEffect(() => {
    const handleThemeChange = () => {
      setTheme(getTheme());
    };

    window.addEventListener('storage', handleThemeChange);
    document.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      document.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);

  const handleToggle = () => {
    toggleTheme();
    setTheme(getTheme());
    
    // Dispatch event for other components to react to theme change
    document.dispatchEvent(new Event('themeChanged'));
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleToggle}
      title={theme === 'light' 
        ? (language === 'ar' ? 'التبديل إلى الوضع الداكن' : 'Switch to dark mode') 
        : (language === 'ar' ? 'التبديل إلى الوضع الفاتح' : 'Switch to light mode')
      }
      className="gap-2"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      {showText && (
        <span>
          {theme === 'light' 
            ? (language === 'ar' ? 'وضع مظلم' : 'Dark mode') 
            : (language === 'ar' ? 'وضع فاتح' : 'Light mode')
          }
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;