export const LOGO_KEYS = {
  URL: 'logo_url',
  ALT: 'logo_alt'
};

export const DEFAULT_LOGO = {
  URL: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80',
  ALT: 'Royal Restaurant Logo'
};

// Get logo from localStorage
export function getLogo() {
  try {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    return {
      url: settings[LOGO_KEYS.URL] || DEFAULT_LOGO.URL,
      alt: settings[LOGO_KEYS.ALT] || DEFAULT_LOGO.ALT
    };
  } catch (error) {
    console.error('Error loading logo:', error);
    return {
      url: DEFAULT_LOGO.URL,
      alt: DEFAULT_LOGO.ALT
    };
  }
}

// Save logo to localStorage
export function saveLogo(url: string, alt: string = DEFAULT_LOGO.ALT): boolean {
  try {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    settings[LOGO_KEYS.URL] = url;
    settings[LOGO_KEYS.ALT] = alt;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    // Dispatch custom event for components to update
    document.dispatchEvent(new CustomEvent('logoUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving logo:', error);
    return false;
  }
}

// Convert file to base64 (for image uploads)
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}