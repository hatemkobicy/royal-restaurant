import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/components/LanguageSelector';

const LandingPage = () => {
  const [, setLocation] = useLocation();
  const { showSelector, setShowSelector } = useLanguage();

  // If language is already selected, redirect to homepage
  useEffect(() => {
    if (!showSelector) {
      setLocation('/');
    }
  }, [showSelector, setLocation]);

  return null; // No rendering needed, the LanguageSelector component will be shown via the LanguageProvider
};

export default LandingPage;
