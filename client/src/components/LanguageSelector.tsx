import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import translations from '@/i18n';

// Define language types
export type Language = 'ar' | 'tr';

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  showSelector: boolean;
  setShowSelector: (show: boolean) => void;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  setLanguage: () => {},
  showSelector: true,
  setShowSelector: () => {},
});

// Hook to use language context
export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  // Check if language is stored in localStorage
  const savedLanguage = localStorage.getItem('language') as Language;
  const initialLanguage = savedLanguage || 'ar';
  
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [showSelector, setShowSelector] = useState(true);

  // Update document direction and language when language changes
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('language', language);
  }, [language]);

  // Set language and handle related actions
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setShowSelector(false);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, showSelector, setShowSelector }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const LanguageSelector = () => {
  const { language, setLanguage, showSelector } = useLanguage();
  
  if (!showSelector) return null;

  return (
    <div className="fixed inset-0 bg-secondary bg-opacity-95 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 gold-border"></div>
        <CardContent className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2 font-turkish">Royal Restaurant</h1>
            <h2 className="text-xl font-bold text-primary mb-4 font-arabic">المطعم الملكي</h2>
            <p className="text-sm text-foreground mb-6">
              {translations.ar["app.language.select"]} / {translations.tr["app.language.select"]}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={() => setLanguage('ar')}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              <span className="font-arabic text-lg">{translations.ar["app.language.arabic"]}</span>
            </Button>
            <Button 
              onClick={() => setLanguage('tr')}
              className="bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              <span className="font-turkish text-lg">{translations.tr["app.language.turkish"]}</span>
            </Button>
          </div>

          <div className="mt-8 arabic-pattern h-16 rounded-b-lg opacity-50"></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSelector;
