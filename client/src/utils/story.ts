// Utility for managing "Our Story" section content

// Storage keys
export const STORY_KEYS = {
  IMAGE_URL: 'story_image_url',
  SINCE_YEAR: 'story_since_year',
  TITLE: {
    AR: 'story_title_ar',
    TR: 'story_title_tr'
  },
  PARAGRAPH_1: {
    AR: 'story_p1_ar',
    TR: 'story_p1_tr'
  },
  PARAGRAPH_2: {
    AR: 'story_p2_ar',
    TR: 'story_p2_tr'
  }
};

// Default content
export const DEFAULT_STORY = {
  IMAGE_URL: 'https://images.unsplash.com/photo-1586999768265-24af89630739?q=80&w=800&auto=format&fit=crop',
  SINCE_YEAR: '1995',
  TITLE: {
    AR: 'قصتنا',
    TR: 'Hikayemiz'
  },
  PARAGRAPH_1: {
    AR: 'بدأت رحلتنا في عام 1995 مع رؤية بسيطة: تقديم تجربة طعام تجمع بين النكهات التقليدية والإبداع الحديث. على مر السنين، أصبحنا وجهة محبوبة للمقيمين والزوار الذين يبحثون عن تجربة طعام أصيلة.',
    TR: 'Yolculuğumuz 1995 yılında basit bir vizyonla başladı: geleneksel lezzetler ile modern yaratıcılığı birleştiren bir yemek deneyimi sunmak. Yıllar içinde, otantik bir yemek deneyimi arayan yerli ve yabancı misafirler için sevilen bir mekan haline geldik.'
  },
  PARAGRAPH_2: {
    AR: 'نحن نستخدم فقط أفضل المكونات المحلية والموسمية، ويتم إعداد كل طبق بعناية واهتمام بالتفاصيل. نؤمن بالحفاظ على التراث الغني لمطبخنا مع إضافة لمساتنا الإبداعية الخاصة.',
    TR: 'Sadece en iyi yerel ve mevsimlik malzemeleri kullanıyoruz ve her yemek özenle ve detaylara dikkat edilerek hazırlanıyor. Mutfağımızın zengin mirasını korurken kendi yaratıcı dokunuşlarımızı eklemeye inanıyoruz.'
  }
};

// Interface for story data
export interface StoryData {
  imageUrl: string;
  sinceYear: string;
  title: {
    ar: string;
    tr: string;
  };
  paragraph1: {
    ar: string;
    tr: string;
  };
  paragraph2: {
    ar: string;
    tr: string;
  };
}

// Get story data
export function getStoryData(): StoryData {
  try {
    return {
      imageUrl: localStorage.getItem(STORY_KEYS.IMAGE_URL) || DEFAULT_STORY.IMAGE_URL,
      sinceYear: localStorage.getItem(STORY_KEYS.SINCE_YEAR) || DEFAULT_STORY.SINCE_YEAR,
      title: {
        ar: localStorage.getItem(STORY_KEYS.TITLE.AR) || DEFAULT_STORY.TITLE.AR,
        tr: localStorage.getItem(STORY_KEYS.TITLE.TR) || DEFAULT_STORY.TITLE.TR
      },
      paragraph1: {
        ar: localStorage.getItem(STORY_KEYS.PARAGRAPH_1.AR) || DEFAULT_STORY.PARAGRAPH_1.AR,
        tr: localStorage.getItem(STORY_KEYS.PARAGRAPH_1.TR) || DEFAULT_STORY.PARAGRAPH_1.TR
      },
      paragraph2: {
        ar: localStorage.getItem(STORY_KEYS.PARAGRAPH_2.AR) || DEFAULT_STORY.PARAGRAPH_2.AR,
        tr: localStorage.getItem(STORY_KEYS.PARAGRAPH_2.TR) || DEFAULT_STORY.PARAGRAPH_2.TR
      }
    };
  } catch (error) {
    console.error('Error retrieving story data:', error);
    return {
      imageUrl: DEFAULT_STORY.IMAGE_URL,
      sinceYear: DEFAULT_STORY.SINCE_YEAR,
      title: {
        ar: DEFAULT_STORY.TITLE.AR,
        tr: DEFAULT_STORY.TITLE.TR
      },
      paragraph1: {
        ar: DEFAULT_STORY.PARAGRAPH_1.AR,
        tr: DEFAULT_STORY.PARAGRAPH_1.TR
      },
      paragraph2: {
        ar: DEFAULT_STORY.PARAGRAPH_2.AR,
        tr: DEFAULT_STORY.PARAGRAPH_2.TR
      }
    };
  }
}

// Save story image
export function saveStoryImage(imageUrl: string): boolean {
  try {
    localStorage.setItem(STORY_KEYS.IMAGE_URL, imageUrl);
    document.dispatchEvent(new CustomEvent('storyUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving story image:', error);
    return false;
  }
}

// Save since year
export function saveSinceYear(year: string): boolean {
  try {
    localStorage.setItem(STORY_KEYS.SINCE_YEAR, year);
    document.dispatchEvent(new CustomEvent('storyUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving since year:', error);
    return false;
  }
}

// Save title
export function saveStoryTitle(language: 'ar' | 'tr', title: string): boolean {
  try {
    const key = language === 'ar' ? STORY_KEYS.TITLE.AR : STORY_KEYS.TITLE.TR;
    localStorage.setItem(key, title);
    document.dispatchEvent(new CustomEvent('storyUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving story title:', error);
    return false;
  }
}

// Save paragraph 1
export function saveStoryParagraph1(language: 'ar' | 'tr', text: string): boolean {
  try {
    const key = language === 'ar' ? STORY_KEYS.PARAGRAPH_1.AR : STORY_KEYS.PARAGRAPH_1.TR;
    localStorage.setItem(key, text);
    document.dispatchEvent(new CustomEvent('storyUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving story paragraph 1:', error);
    return false;
  }
}

// Save paragraph 2
export function saveStoryParagraph2(language: 'ar' | 'tr', text: string): boolean {
  try {
    const key = language === 'ar' ? STORY_KEYS.PARAGRAPH_2.AR : STORY_KEYS.PARAGRAPH_2.TR;
    localStorage.setItem(key, text);
    document.dispatchEvent(new CustomEvent('storyUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving story paragraph 2:', error);
    return false;
  }
}

// Reset to defaults
export function resetStoryData(): boolean {
  try {
    localStorage.setItem(STORY_KEYS.IMAGE_URL, DEFAULT_STORY.IMAGE_URL);
    localStorage.setItem(STORY_KEYS.SINCE_YEAR, DEFAULT_STORY.SINCE_YEAR);
    localStorage.setItem(STORY_KEYS.TITLE.AR, DEFAULT_STORY.TITLE.AR);
    localStorage.setItem(STORY_KEYS.TITLE.TR, DEFAULT_STORY.TITLE.TR);
    localStorage.setItem(STORY_KEYS.PARAGRAPH_1.AR, DEFAULT_STORY.PARAGRAPH_1.AR);
    localStorage.setItem(STORY_KEYS.PARAGRAPH_1.TR, DEFAULT_STORY.PARAGRAPH_1.TR);
    localStorage.setItem(STORY_KEYS.PARAGRAPH_2.AR, DEFAULT_STORY.PARAGRAPH_2.AR);
    localStorage.setItem(STORY_KEYS.PARAGRAPH_2.TR, DEFAULT_STORY.PARAGRAPH_2.TR);
    document.dispatchEvent(new CustomEvent('storyUpdated'));
    return true;
  } catch (error) {
    console.error('Error resetting story data:', error);
    return false;
  }
}