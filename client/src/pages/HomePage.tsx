import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CustomCarousel from '@/components/CustomCarousel';
import MenuItemCard from '@/components/MenuItemCard';
import { restaurantImages, menuItemImages, formatCurrency } from '@/lib/utils';
import { type MenuItem, type Category, type SpecialDish } from '@shared/schema';
import { getCarouselData } from '@/utils/carousel';
import { getStoryData, type StoryData } from '@/utils/story';

// Special Dishes Component
const SpecialDishesSection = () => {
  const { language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  
  // Fetch regular menu items instead of special dishes
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
  });
  
  // Get the latest 3 dishes based on ID (assuming higher ID = more recently added)
  const latestDishes = [...menuItems]
    .sort((a, b) => b.id - a.id) // Sort by ID descending (newest first)
    .slice(0, 3);  // Take only the first 3
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-white/80">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
      </div>
    );
  }
  
  if (latestDishes.length === 0) {
    // Default dishes if no menu items are available yet
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Default Special Dish 1 */}
        <div className="bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-primary/30 transition duration-300">
          <img 
            src={menuItemImages[6].url} 
            alt={menuItemImages[6].alt} 
            className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4 sm:mb-6"
          />
          <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-primary mb-2">
            {language === 'ar' ? 'طبق المشاوي الملكي' : 'Royal Mixed Grill Plate'}
          </h3>
          <p className="text-white/80 dark:text-white/90 mb-4 text-sm sm:text-base line-clamp-3">
            {language === 'ar'
              ? 'تشكيلة فاخرة من المشاوي تتضمن قطع من لحم الضأن، شيش طاووق، كفتة، ريش غنم، وكباب. يقدم مع الأرز المبهر والخضروات المشوية وصلصات متنوعة.'
              : 'A luxurious selection of grilled meats including lamb cuts, shish tawook, kofta, lamb chops, and kebab. Served with spiced rice, grilled vegetables, and various sauces.'
            }
          </p>
          <div className="flex justify-start">
            <span className="text-xl sm:text-2xl font-bold text-primary dark:text-primary">{formatCurrency(395)}</span>
          </div>
        </div>
                  
        {/* Default Special Dish 2 */}
        <div className="bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-primary/30 transition duration-300">
          <img 
            src={menuItemImages[7].url} 
            alt={menuItemImages[7].alt} 
            className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4 sm:mb-6"
          />
          <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-primary mb-2">
            {language === 'ar' ? 'طبق المأكولات البحرية' : 'Seafood Platter'}
          </h3>
          <p className="text-white/80 dark:text-white/90 mb-4 text-sm sm:text-base line-clamp-3">
            {language === 'ar'
              ? 'تشكيلة من أجود أنواع المأكولات البحرية الطازجة تشمل سمك السلطان إبراهيم، الروبيان، الكاليماري والمحار. يقدم مع الأعشاب البحرية، صلصة الليمون والثوم وخبز محمص.'
              : 'A selection of the finest fresh seafood including Sultan Ibrahim fish, prawns, calamari, and oysters. Served with seaweed, lemon and garlic sauce, and toasted bread.'
            }
          </p>
          <div className="flex justify-start">
            <span className="text-xl sm:text-2xl font-bold text-primary dark:text-primary">{formatCurrency(450)}</span>
          </div>
        </div>
                  
        {/* Default Special Dish 3 */}
        <div className="bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-primary/30 transition duration-300">
          <img 
            src={menuItemImages[5].url} 
            alt={menuItemImages[5].alt} 
            className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4 sm:mb-6"
          />
          <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-primary mb-2">
            {language === 'ar' ? 'كنافة بالقشطة' : 'Cream Kunafa'}
          </h3>
          <p className="text-white/80 dark:text-white/90 mb-4 text-sm sm:text-base line-clamp-3">
            {language === 'ar'
              ? 'حلوى عربية تقليدية من العجين الرفيع المحمص والمحشو بالقشطة الطازجة، مغطاة بالقطر ومزينة بالفستق الحلبي.'
              : 'Traditional Arabic dessert made with thin, crispy pastry filled with fresh cream, soaked in sweet syrup and garnished with crushed pistachios.'
            }
          </p>
          <div className="flex justify-start">
            <span className="text-xl sm:text-2xl font-bold text-primary dark:text-primary">{formatCurrency(95)}</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Display the 3 most recently added menu items
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {latestDishes.map((item) => (
        <div key={item.id} className="bg-white/5 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10 hover:border-primary/30 transition duration-300">
          <img 
            src={item.imageUrl || menuItemImages[Math.floor(Math.random() * menuItemImages.length)].url} 
            alt={isRtl ? item.nameAr : item.nameTr} 
            className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4 sm:mb-6"
          />
          <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-primary mb-2">
            {isRtl ? item.nameAr : item.nameTr}
          </h3>
          <p className="text-white/80 dark:text-white/90 mb-4 text-sm sm:text-base line-clamp-3">
            {isRtl ? item.descriptionAr : item.descriptionTr}
          </p>
          <div className="flex justify-start">
            <span className="text-xl sm:text-2xl font-bold text-primary dark:text-primary">{formatCurrency(item.price)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const HomePage = () => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const isArabic = language === 'ar';

  // Fetch menu items for featured section
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
  });

  // Fetch categories for mapping to menu items
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get carousel data from settings
  const [slidesData, setSlidesData] = useState(getCarouselData(language as 'tr' | 'ar'));
  
  // Get story data from settings
  const [storyData, setStoryData] = useState<StoryData>(getStoryData());
  
  // Listen for carousel data changes
  useEffect(() => {
    // Update carousel data when language changes
    setSlidesData(getCarouselData(language as 'tr' | 'ar'));
    
    // Listen for carousel settings changes
    const handleCarouselUpdate = () => {
      setSlidesData(getCarouselData(language as 'tr' | 'ar'));
    };
    
    // Update when localStorage changes
    window.addEventListener('storage', handleCarouselUpdate);
    
    // Listen for custom event from carousel editor
    document.addEventListener('carouselUpdated', handleCarouselUpdate);
    
    return () => {
      window.removeEventListener('storage', handleCarouselUpdate);
      document.removeEventListener('carouselUpdated', handleCarouselUpdate);
    };
  }, [language]);
  
  // Listen for story data changes
  useEffect(() => {
    // Listen for story settings changes
    const handleStoryUpdate = () => {
      setStoryData(getStoryData());
    };
    
    // Update when localStorage changes
    window.addEventListener('storage', handleStoryUpdate);
    
    // Listen for custom event from story editor
    document.addEventListener('storyUpdated', handleStoryUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStoryUpdate);
      document.removeEventListener('storyUpdated', handleStoryUpdate);
    };
  }, []);
  
  // Create carousel items from settings
  const carouselItems = slidesData.map(slide => ({
    id: slide.id,
    imageUrl: slide.imageUrl,
    alt: slide.imageAlt,
    title: slide.title,
    subtitle: slide.subtitle,
    cta: {
      text: slide.ctaText,
      link: slide.ctaLink
    }
  }));

  return (
    <div>
      {/* Hero Carousel */}
      <section id="home">
        <CustomCarousel items={carouselItems} />
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary dark:text-primary mb-4">{t('home.about.title')}</h2>
            <div className="w-24 h-1 bg-primary dark:bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-foreground dark:text-foreground/90 max-w-3xl mx-auto">{t('home.about.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative">
              <img 
                src={storyData.imageUrl} 
                alt={isArabic ? storyData.title.ar : storyData.title.tr} 
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute -bottom-5 right-5 md:-right-5 w-24 h-24 md:w-32 md:h-32 bg-primary rounded-lg flex items-center justify-center">
                <p className="text-white font-bold text-lg md:text-xl">Since {storyData.sinceYear}</p>
              </div>
            </div>
            
            <div className="mt-10 md:mt-0">
              <h3 className="text-xl sm:text-2xl font-bold text-secondary dark:text-secondary mb-3 md:mb-4">
                {isArabic ? storyData.title.ar : storyData.title.tr}
              </h3>
              <div className="w-16 h-1 bg-primary dark:bg-primary mb-4 md:mb-6"></div>
              <p className="text-sm sm:text-base text-foreground dark:text-foreground/90 mb-4 md:mb-6">
                {isArabic ? storyData.paragraph1.ar : storyData.paragraph1.tr}
              </p>
              <p className="text-sm sm:text-base text-foreground dark:text-foreground/90 mb-4 md:mb-6">
                {isArabic ? storyData.paragraph2.ar : storyData.paragraph2.tr}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 md:mb-6">
                <div className="bg-gray-50 dark:bg-card p-3 sm:p-4 rounded-lg text-center shadow-sm">
                  <i className="bi bi-award text-2xl sm:text-3xl text-primary dark:text-primary mb-1 sm:mb-2"></i>
                  <p className="font-bold text-sm sm:text-base dark:text-foreground">{t('home.about.quality')}</p>
                </div>
                <div className="bg-gray-50 dark:bg-card p-3 sm:p-4 rounded-lg text-center shadow-sm">
                  <i className="bi bi-hand-thumbs-up text-2xl sm:text-3xl text-primary dark:text-primary mb-1 sm:mb-2"></i>
                  <p className="font-bold text-sm sm:text-base dark:text-foreground">{t('home.about.service')}</p>
                </div>
              </div>
              
              <Link href="/contact" className="inline-flex items-center text-primary hover:text-primary/80 font-bold transition-colors text-sm sm:text-base">
                <span>{t('home.about.cta')}</span>
                <i className={`bi bi-arrow-${isRtl ? 'left' : 'right'} ${isRtl ? 'mr-2' : 'ml-2'}`}></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;