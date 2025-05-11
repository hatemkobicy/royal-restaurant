import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTheme, toggleTheme } from '../utils/theme';
import { getSocialLinks } from '../utils/social';

export const SOCIAL_MEDIA_KEYS = {
  INSTAGRAM: 'social_instagram',
  FACEBOOK: 'social_facebook',
  YOUTUBE: 'social_youtube',
  TWITTER: 'social_twitter',
};

export const THEME_KEYS = {
  THEME_MODE: 'themeMode',
};

export interface Setting {
  id: number;
  key: string;
  value: string;
}

interface SettingsContextType {
  settings: Record<string, string>;
  getSetting: (key: string) => string;
  updateSetting: (key: string, value: string) => Promise<void>;
  socialLinks: {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  theme: {
    mode: 'light' | 'dark';
    setMode: (mode: 'light' | 'dark') => void;
    toggleMode: () => void;
  };
  isLoading: boolean;
}

const defaultSettings: Record<string, string> = {};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  getSetting: () => '',
  updateSetting: async () => {},
  socialLinks: {
    instagram: '',
    facebook: '',
    youtube: '',
    twitter: '',
  },
  theme: {
    mode: 'light',
    setMode: () => {},
    toggleMode: () => {},
  },
  isLoading: true,
});

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState(getSocialLinks());
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(getTheme());

  // Load settings from localStorage
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('siteSettings');
      if (storedSettings) {
        const settingsData = JSON.parse(storedSettings);
        setSettings(settingsData);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Update social links when settings change
    setSocialLinks(getSocialLinks());
  }, [settings]);

  // Update theme mode when it changes
  useEffect(() => {
    const handleThemeChange = () => {
      setThemeMode(getTheme());
    };

    document.addEventListener('themeChanged', handleThemeChange);
    window.addEventListener('storage', (e) => {
      if (e.key === THEME_KEYS.THEME_MODE) {
        handleThemeChange();
      }
    });

    return () => {
      document.removeEventListener('themeChanged', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const getSetting = (key: string): string => {
    return settings[key] || '';
  };

  const updateSetting = async (key: string, value: string): Promise<void> => {
    try {
      // Update localStorage
      const newSettings = { ...settings, [key]: value };
      localStorage.setItem('siteSettings', JSON.stringify(newSettings));
      setSettings(newSettings);

      // Send to API if needed
      // await apiClient.post('/api/settings', { key, value });
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  const value: SettingsContextType = {
    settings,
    getSetting,
    updateSetting,
    socialLinks,
    theme: {
      mode: themeMode,
      setMode: (mode: 'light' | 'dark') => {
        const currentMode = getTheme();
        if (currentMode !== mode) {
          toggleTheme();
        }
      },
      toggleMode: () => {
        toggleTheme();
        setThemeMode(getTheme());
      }
    },
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}