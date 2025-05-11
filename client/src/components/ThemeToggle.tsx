import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
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
  const { theme } = useSettings();
  const { language } = useLanguage();
  
  const handleToggle = () => {
    theme.toggleMode();
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleToggle}
      title={theme.mode === 'light' 
        ? (language === 'ar' ? 'التبديل إلى الوضع الداكن' : 'Switch to dark mode') 
        : (language === 'ar' ? 'التبديل إلى الوضع الفاتح' : 'Switch to light mode')
      }
      className="gap-2"
    >
      {theme.mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      {showText && (
        <span>
          {theme.mode === 'light' 
            ? (language === 'ar' ? 'وضع مظلم' : 'Dark mode') 
            : (language === 'ar' ? 'وضع فاتح' : 'Light mode')
          }
        </span>
      )}
    </Button>
  );
};

export default ThemeToggle;