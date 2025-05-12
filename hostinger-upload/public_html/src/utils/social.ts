export const SOCIAL_MEDIA = {
  KEYS: {
    INSTAGRAM: 'social_instagram',
    FACEBOOK: 'social_facebook',
    YOUTUBE: 'social_youtube',
    TWITTER: 'social_twitter',
  },
  DEFAULT: {
    INSTAGRAM: 'https://instagram.com/royalrestaurant',
    FACEBOOK: 'https://facebook.com/royalrestaurant',
    YOUTUBE: 'https://youtube.com/royalrestaurant',
    TWITTER: 'https://twitter.com/royalrestaurant',
  }
};

// Load social media links from localStorage
export function getSocialLinks() {
  try {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    return {
      instagram: settings[SOCIAL_MEDIA.KEYS.INSTAGRAM] || SOCIAL_MEDIA.DEFAULT.INSTAGRAM,
      facebook: settings[SOCIAL_MEDIA.KEYS.FACEBOOK] || SOCIAL_MEDIA.DEFAULT.FACEBOOK,
      youtube: settings[SOCIAL_MEDIA.KEYS.YOUTUBE] || SOCIAL_MEDIA.DEFAULT.YOUTUBE,
      twitter: settings[SOCIAL_MEDIA.KEYS.TWITTER] || SOCIAL_MEDIA.DEFAULT.TWITTER,
    };
  } catch (error) {
    console.error('Error loading social media links:', error);
    return {
      instagram: SOCIAL_MEDIA.DEFAULT.INSTAGRAM,
      facebook: SOCIAL_MEDIA.DEFAULT.FACEBOOK,
      youtube: SOCIAL_MEDIA.DEFAULT.YOUTUBE,
      twitter: SOCIAL_MEDIA.DEFAULT.TWITTER,
    };
  }
}

// Save social media link to localStorage
export function saveSocialLink(key: string, value: string) {
  try {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    settings[key] = value;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving social media link:', error);
    return false;
  }
}