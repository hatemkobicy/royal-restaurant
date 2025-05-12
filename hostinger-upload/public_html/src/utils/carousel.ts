import { restaurantImages } from '@/lib/utils';

// Keys for carousel settings in local storage
export const CAROUSEL_KEYS = {
  SLIDE_1_TITLE: 'carousel_slide_1_title',
  SLIDE_1_SUBTITLE: 'carousel_slide_1_subtitle',
  SLIDE_1_CTA_TEXT: 'carousel_slide_1_cta_text',
  SLIDE_1_CTA_LINK: 'carousel_slide_1_cta_link',
  SLIDE_1_IMAGE: 'carousel_slide_1_image',
  
  SLIDE_2_TITLE: 'carousel_slide_2_title',
  SLIDE_2_SUBTITLE: 'carousel_slide_2_subtitle',
  SLIDE_2_CTA_TEXT: 'carousel_slide_2_cta_text',
  SLIDE_2_CTA_LINK: 'carousel_slide_2_cta_link',
  SLIDE_2_IMAGE: 'carousel_slide_2_image',
  
  SLIDE_3_TITLE: 'carousel_slide_3_title',
  SLIDE_3_SUBTITLE: 'carousel_slide_3_subtitle',
  SLIDE_3_CTA_TEXT: 'carousel_slide_3_cta_text',
  SLIDE_3_CTA_LINK: 'carousel_slide_3_cta_link',
  SLIDE_3_IMAGE: 'carousel_slide_3_image',
};

// Default carousel data in Turkish and Arabic
export const DEFAULT_CAROUSEL_DATA = {
  tr: [
    {
      id: 'slide-1',
      title: 'Royal Restaurant',
      subtitle: 'İstanbul\'un kalbinde otantik lezzetler',
      ctaText: 'Menüyü Görüntüle',
      ctaLink: '/menu',
      imageUrl: restaurantImages[0].url,
      imageAlt: restaurantImages[0].alt
    },
    {
      id: 'slide-2',
      title: 'Royal Atmosphere',
      subtitle: 'Elegance and luxury in the heart of Istanbul',
      ctaText: 'Masanızı Şimdi Ayırın',
      ctaLink: '/contact',
      imageUrl: restaurantImages[1].url,
      imageAlt: restaurantImages[1].alt
    },
    {
      id: 'slide-3',
      title: 'Irresistible Taste',
      subtitle: 'Authentic flavors prepared by expert chefs',
      ctaText: 'Özel Ürünlerimizi Keşfedin',
      ctaLink: '/menu',
      imageUrl: restaurantImages[2].url,
      imageAlt: restaurantImages[2].alt
    }
  ],
  ar: [
    {
      id: 'slide-1',
      title: 'المطعم الملكي',
      subtitle: 'نكهات أصيلة في قلب اسطنبول',
      ctaText: 'عرض القائمة',
      ctaLink: '/menu',
      imageUrl: restaurantImages[0].url,
      imageAlt: restaurantImages[0].alt
    },
    {
      id: 'slide-2',
      title: 'أجواء ملكية',
      subtitle: 'أناقة وفخامة في قلب اسطنبول',
      ctaText: 'احجز طاولتك الآن',
      ctaLink: '/contact',
      imageUrl: restaurantImages[1].url,
      imageAlt: restaurantImages[1].alt
    },
    {
      id: 'slide-3',
      title: 'مذاق لا يُقاوم',
      subtitle: 'نكهات أصيلة محضرة بأيدي أمهر الطهاة',
      ctaText: 'اكتشف أطباقنا المميزة',
      ctaLink: '/menu',
      imageUrl: restaurantImages[2].url,
      imageAlt: restaurantImages[2].alt
    }
  ]
};

interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  imageAlt: string;
}

// Get carousel data from local storage or use defaults
export function getCarouselData(language: 'tr' | 'ar'): CarouselSlide[] {
  try {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    
    // Check if we have any carousel settings in local storage
    const hasCustomSettings = Object.keys(settings).some(key => key.startsWith('carousel_'));
    
    if (!hasCustomSettings) {
      return DEFAULT_CAROUSEL_DATA[language];
    }
    
    // Construct slides from settings
    return [
      {
        id: 'slide-1',
        title: settings[CAROUSEL_KEYS.SLIDE_1_TITLE]?.[language] || DEFAULT_CAROUSEL_DATA[language][0].title,
        subtitle: settings[CAROUSEL_KEYS.SLIDE_1_SUBTITLE]?.[language] || DEFAULT_CAROUSEL_DATA[language][0].subtitle,
        ctaText: settings[CAROUSEL_KEYS.SLIDE_1_CTA_TEXT]?.[language] || DEFAULT_CAROUSEL_DATA[language][0].ctaText,
        ctaLink: settings[CAROUSEL_KEYS.SLIDE_1_CTA_LINK] || DEFAULT_CAROUSEL_DATA[language][0].ctaLink,
        imageUrl: settings[CAROUSEL_KEYS.SLIDE_1_IMAGE] || DEFAULT_CAROUSEL_DATA[language][0].imageUrl,
        imageAlt: DEFAULT_CAROUSEL_DATA[language][0].imageAlt
      },
      {
        id: 'slide-2',
        title: settings[CAROUSEL_KEYS.SLIDE_2_TITLE]?.[language] || DEFAULT_CAROUSEL_DATA[language][1].title,
        subtitle: settings[CAROUSEL_KEYS.SLIDE_2_SUBTITLE]?.[language] || DEFAULT_CAROUSEL_DATA[language][1].subtitle,
        ctaText: settings[CAROUSEL_KEYS.SLIDE_2_CTA_TEXT]?.[language] || DEFAULT_CAROUSEL_DATA[language][1].ctaText,
        ctaLink: settings[CAROUSEL_KEYS.SLIDE_2_CTA_LINK] || DEFAULT_CAROUSEL_DATA[language][1].ctaLink,
        imageUrl: settings[CAROUSEL_KEYS.SLIDE_2_IMAGE] || DEFAULT_CAROUSEL_DATA[language][1].imageUrl,
        imageAlt: DEFAULT_CAROUSEL_DATA[language][1].imageAlt
      },
      {
        id: 'slide-3',
        title: settings[CAROUSEL_KEYS.SLIDE_3_TITLE]?.[language] || DEFAULT_CAROUSEL_DATA[language][2].title,
        subtitle: settings[CAROUSEL_KEYS.SLIDE_3_SUBTITLE]?.[language] || DEFAULT_CAROUSEL_DATA[language][2].subtitle,
        ctaText: settings[CAROUSEL_KEYS.SLIDE_3_CTA_TEXT]?.[language] || DEFAULT_CAROUSEL_DATA[language][2].ctaText,
        ctaLink: settings[CAROUSEL_KEYS.SLIDE_3_CTA_LINK] || DEFAULT_CAROUSEL_DATA[language][2].ctaLink,
        imageUrl: settings[CAROUSEL_KEYS.SLIDE_3_IMAGE] || DEFAULT_CAROUSEL_DATA[language][2].imageUrl,
        imageAlt: DEFAULT_CAROUSEL_DATA[language][2].imageAlt
      }
    ];
  } catch (error) {
    console.error('Error loading carousel data:', error);
    return DEFAULT_CAROUSEL_DATA[language];
  }
}

// Save carousel setting
export function saveCarouselSetting(key: string, value: any): boolean {
  try {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    settings[key] = value;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving carousel setting:', error);
    return false;
  }
}