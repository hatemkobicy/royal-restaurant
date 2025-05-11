import { useCallback } from 'react';
import { useLanguage } from '@/components/LanguageSelector';
import translations from '@/i18n';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = useCallback((key: string): string => {
    if (!translations[language] || !translations[language][key]) {
      console.warn(`Translation missing for key "${key}" in language "${language}"`);
      // Fallback to the key itself
      return key;
    }
    return translations[language][key];
  }, [language]);

  const getDirection = useCallback((): 'rtl' | 'ltr' => {
    return language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const getFontClass = useCallback((): string => {
    return language === 'ar' ? 'font-arabic' : 'font-turkish';
  }, [language]);

  return { t, getDirection, getFontClass, language };
};
