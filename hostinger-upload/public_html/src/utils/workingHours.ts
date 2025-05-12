export const WORKING_HOURS = {
  KEYS: {
    WEEKDAYS: 'hours_weekdays',
    WEEKEND: 'hours_weekend',
    SUNDAY: 'hours_sunday',
  },
  DEFAULT: {
    WEEKDAYS: '12:00 - 23:00',
    WEEKEND: '12:00 - 00:00',
    SUNDAY: '12:00 - 22:00',
  }
};

// Get working hours from localStorage
export function getWorkingHours() {
  try {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    return {
      weekdays: settings[WORKING_HOURS.KEYS.WEEKDAYS] || WORKING_HOURS.DEFAULT.WEEKDAYS,
      weekend: settings[WORKING_HOURS.KEYS.WEEKEND] || WORKING_HOURS.DEFAULT.WEEKEND,
      sunday: settings[WORKING_HOURS.KEYS.SUNDAY] || WORKING_HOURS.DEFAULT.SUNDAY,
    };
  } catch (error) {
    console.error('Error loading working hours:', error);
    return {
      weekdays: WORKING_HOURS.DEFAULT.WEEKDAYS,
      weekend: WORKING_HOURS.DEFAULT.WEEKEND,
      sunday: WORKING_HOURS.DEFAULT.SUNDAY,
    };
  }
}

// Save working hours to localStorage
export function saveWorkingHours(key: string, value: string): boolean {
  try {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    settings[key] = value;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    // Dispatch custom event for components to update
    document.dispatchEvent(new CustomEvent('workingHoursUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving working hours:', error);
    return false;
  }
}