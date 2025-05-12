export const THEME_KEYS = {
  THEME_MODE: 'themeMode',
};

// Initialize theme based on user's preference or system preference
export const initializeTheme = () => {
  try {
    // Check if user has previously set a theme preference
    const savedTheme = localStorage.getItem(THEME_KEYS.THEME_MODE);
    
    if (savedTheme) {
      // Apply saved theme
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      return;
    }
    
    // If no saved preference, check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', systemPrefersDark);
    
    // Save the system preference
    localStorage.setItem(THEME_KEYS.THEME_MODE, systemPrefersDark ? 'dark' : 'light');
  } catch (error) {
    console.error('Error initializing theme:', error);
    // Default to light theme if there's an error
    document.documentElement.classList.remove('dark');
  }
};

// Toggle between light and dark theme
export const toggleTheme = () => {
  try {
    const isDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark');
    
    // Save the new theme preference
    localStorage.setItem(THEME_KEYS.THEME_MODE, isDark ? 'light' : 'dark');
    
    return !isDark;
  } catch (error) {
    console.error('Error toggling theme:', error);
    return false;
  }
};

// Get current theme
export const getTheme = (): 'light' | 'dark' => {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};