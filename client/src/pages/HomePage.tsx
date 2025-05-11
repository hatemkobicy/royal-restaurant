import { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CustomCarousel from '@/components/CustomCarousel';
import MenuItemCard from '@/components/MenuItemCard';
import { restaurantImages, menuItemImages, formatCurrency } from '@/lib/utils';
import { type MenuItem, type Category } from '@shared/schema';
import { getCarouselData } from '@/utils/carousel';

const HomePage = () => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';

  // Fetch menu items for featured section
  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
  });

  // Fetch categories for mapping to menu items
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get carousel data from settings
  const slidesData = getCarouselData(language as 'tr' | 'ar');
  
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
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">{t('home.about.title')}</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-foreground max-w-3xl mx-auto">{t('home.about.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src={restaurantImages[3].url} 
                alt={restaurantImages[3].alt} 
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-primary rounded-lg hidden md:flex items-center justify-center">
                <p className="text-white font-bold text-xl">{t('home.about.since')}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-secondary mb-4">{t('home.about.story.title')}</h3>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <p className="text-foreground mb-6">{t('home.about.story.p1')}</p>
              <p className="text-foreground mb-6">{t('home.about.story.p2')}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <i className="bi bi-award text-3xl text-primary mb-2"></i>
                  <p className="font-bold">{t('home.about.quality')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <i className="bi bi-hand-thumbs-up text-3xl text-primary mb-2"></i>
                  <p className="font-bold">{t('home.about.service')}</p>
                </div>
              </div>
              
              <Link href="/contact" className="inline-flex items-center text-primary hover:text-primary/80 font-bold transition-colors">
                <span>{t('home.about.cta')}</span>
                <i className={`bi bi-arrow-${isRtl ? 'left' : 'right'} ${isRtl ? 'mr-2' : 'ml-2'}`}></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlights Section */}
      <section id="menu-highlights" className="py-16 bg-gray-50 arabic-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">{t('menu.title')}</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-foreground max-w-3xl mx-auto">{t('menu.subtitle')}</p>
          </div>
          
          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading skeleton
              Array(6).fill(0).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4 animate-pulse"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded-full w-8 animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Actual menu items
              menuItems.slice(0, 6).map((item) => {
                const category = categories.find((cat) => cat.id === item.categoryId);
                return (
                  <MenuItemCard 
                    key={item.id} 
                    item={{
                      ...item,
                      // If image URL is missing, use a stock image
                      imageUrl: item.imageUrl || menuItemImages[Math.floor(Math.random() * menuItemImages.length)].url
                    }} 
                    category={category}
                  />
                );
              })
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/menu" className="inline-block bg-secondary hover:bg-secondary/90 text-white font-bold py-3 px-8 rounded-lg transition duration-300">
              {t('menu.view.all')}
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section id="specialties" className="py-16 bg-secondary text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">{t('home.special.title')}</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">{t('home.special.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/30 transition duration-300">
              <img 
                src={menuItemImages[6].url} 
                alt={menuItemImages[6].alt} 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h3 className="text-2xl font-bold text-primary mb-2">
                {language === 'ar' ? 'طبق المشاوي الملكي' : 'Royal Mixed Grill Plate'}
              </h3>
              <p className="text-white/80 mb-4">
                {language === 'ar' 
                  ? 'تشكيلة فاخرة من المشاوي تتضمن قطع من لحم الضأن، شيش طاووق، كفتة، ريش غنم، وكباب. يقدم مع الأرز المبهر والخضروات المشوية وصلصات متنوعة.'
                  : 'A luxurious selection of grilled meats including lamb cuts, shish tawook, kofta, lamb chops, and kebab. Served with spiced rice, grilled vegetables, and various sauces.'
                }
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">{formatCurrency(395)}</span>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded transition duration-300">
                  {t('home.special.cta')}
                </Button>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-primary/30 transition duration-300">
              <img 
                src={menuItemImages[7].url} 
                alt={menuItemImages[7].alt} 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h3 className="text-2xl font-bold text-primary mb-2">
                {language === 'ar' ? 'طبق المأكولات البحرية' : 'Seafood Platter'}
              </h3>
              <p className="text-white/80 mb-4">
                {language === 'ar'
                  ? 'تشكيلة من أجود أنواع المأكولات البحرية الطازجة تشمل سمك السلطان إبراهيم، الروبيان، الكاليماري والمحار. يقدم مع الأعشاب البحرية، صلصة الليمون والثوم وخبز محمص.'
                  : 'A selection of the finest fresh seafood including Sultan Ibrahim fish, prawns, calamari, and oysters. Served with seaweed, lemon and garlic sauce, and toasted bread.'
                }
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">{formatCurrency(450)}</span>
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded transition duration-300">
                  {t('home.special.cta')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 arabic-pattern"></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
