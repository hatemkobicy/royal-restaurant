import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Social media settings keys
export const SOCIAL_MEDIA_KEYS = {
  INSTAGRAM: 'social_instagram',
  FACEBOOK: 'social_facebook',
  YOUTUBE: 'social_youtube', 
  TWITTER: 'social_twitter',
};

// Theme settings
export const THEME_KEYS = {
  MODE: 'theme_mode', // 'light' or 'dark'
};

// Default values for settings
const DEFAULT_SETTINGS = {
  [SOCIAL_MEDIA_KEYS.INSTAGRAM]: 'https://instagram.com/royalrestaurant',
  [SOCIAL_MEDIA_KEYS.FACEBOOK]: 'https://facebook.com/royalrestaurant',
  [SOCIAL_MEDIA_KEYS.YOUTUBE]: 'https://youtube.com/royalrestaurant',
  [SOCIAL_MEDIA_KEYS.TWITTER]: 'https://twitter.com/royalrestaurant',
  [THEME_KEYS.MODE]: 'light',
};

// Type for a single setting
export interface Setting {
  id: number;
  key: string;
  value: string;
}

// Settings context type
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

// Create context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component for settings
interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({...DEFAULT_SETTINGS});
  
  // Fetch settings from the API
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['/api/settings']
  });
  
  // Update settings when data is fetched
  useEffect(() => {
    if (settingsData && Array.isArray(settingsData)) {
      const newSettings = { ...DEFAULT_SETTINGS };
      settingsData.forEach((setting: Setting) => {
        newSettings[setting.key] = setting.value;
      });
      setSettingsMap(newSettings);
    }
  }, [settingsData]);
  
  // For development with localStorage
  useEffect(() => {
    // In development mode, also check localStorage for settings
    if (localStorage.getItem('token') === 'mock-admin-token') {
      try {
        const storedSettings = localStorage.getItem('siteSettings');
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettingsMap(prevSettings => ({
            ...prevSettings,
            ...parsedSettings
          }));
        }
      } catch (error) {
        console.error('Error loading settings from localStorage:', error);
      }
    }
  }, []);
  
  // Mutation to update a setting
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      // For development mode with mock token
      if (localStorage.getItem('token') === 'mock-admin-token') {
        const updatedSettings = { ...settingsMap, [key]: value };
        localStorage.setItem('siteSettings', JSON.stringify(updatedSettings));
        return { key, value };
      }
      
      // Regular API call
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ key, value }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update setting: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Update local state
      setSettingsMap(prev => ({ ...prev, [data.key]: data.value }));
      
      // Invalidate query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      
      // Show success toast
      toast({
        title: 'Setting Updated',
        description: `Successfully updated ${data.key}`,
      });
    },
    onError: (error) => {
      console.error('Error updating setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update setting.',
        variant: 'destructive',
      });
    },
  });
  
  // Helper to get a setting value
  const getSetting = (key: string): string => {
    return settingsMap[key] || DEFAULT_SETTINGS[key] || '';
  };
  
  // Helper to update a setting
  const updateSetting = async (key: string, value: string): Promise<void> => {
    await updateSettingMutation.mutateAsync({ key, value });
  };
  
  // Social media links
  const socialLinks = {
    instagram: getSetting(SOCIAL_MEDIA_KEYS.INSTAGRAM),
    facebook: getSetting(SOCIAL_MEDIA_KEYS.FACEBOOK),
    youtube: getSetting(SOCIAL_MEDIA_KEYS.YOUTUBE),
    twitter: getSetting(SOCIAL_MEDIA_KEYS.TWITTER),
  };
  
  // Theme settings
  const theme = {
    mode: getSetting(THEME_KEYS.MODE) as 'light' | 'dark',
    setMode: (mode: 'light' | 'dark') => {
      updateSetting(THEME_KEYS.MODE, mode);
      
      // Update document class for theme
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    toggleMode: () => {
      const newMode = theme.mode === 'light' ? 'dark' : 'light';
      theme.setMode(newMode);
    },
  };
  
  // Set initial theme class on document
  useEffect(() => {
    if (theme.mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme.mode]);
  
  const value: SettingsContextType = {
    settings: settingsMap,
    getSetting,
    updateSetting,
    socialLinks,
    theme,
    isLoading,
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Hook to use settings
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}