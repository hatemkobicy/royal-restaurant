import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import MenuItemCard from '@/components/MenuItemCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { menuItemImages } from '@/lib/utils';

const MenuPage = () => {
  const { t, language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [localMenuItems, setLocalMenuItems] = useState<any[]>([]);
  
  // Fetch all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  // Fetch all menu items
  const { data: menuItems, isLoading: menuItemsLoading } = useQuery<any[]>({
    queryKey: ['/api/menu-items'],
  });
  
  // Load menu items from localStorage for development mode
  useEffect(() => {
    // Try to load from localStorage first
    try {
      const storedItems = localStorage.getItem('menuItems');
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          console.log('MenuPage loaded items from localStorage:', parsedItems.length);
          setLocalMenuItems(parsedItems);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading menu items from localStorage:', error);
    }
    
    // Fallback to API data
    if (menuItems && menuItems.length > 0) {
      setLocalMenuItems(menuItems);
    }
  }, [menuItems]);

  // Get filtered menu items based on active category
  const getFilteredItems = () => {
    if (localMenuItems.length === 0) return [];
    if (!activeCategory) return localMenuItems;
    
    const categoryId = parseInt(activeCategory);
    return localMenuItems.filter(item => item.categoryId === categoryId);
  };

  const filteredItems = getFilteredItems();

  // Render loading skeleton
  if (categoriesLoading || menuItemsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-48 mx-auto mb-4" />
          <Skeleton className="h-1 w-24 mx-auto mb-6" />
          <Skeleton className="h-6 w-96 max-w-full mx-auto" />
        </div>
        
        <div className="flex justify-center gap-3 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-full" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-24 rounded" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 arabic-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary mb-4">{t('menu.title')}</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-lg text-foreground max-w-3xl mx-auto">{t('menu.subtitle')}</p>
        </div>
        
        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Button 
            variant={!activeCategory ? "default" : "outline"}
            className={!activeCategory ? "bg-primary text-white" : ""}
            onClick={() => setActiveCategory(null)}
          >
            {t('menu.filter.all')}
          </Button>
          
          {categories?.map((category: any) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id.toString() ? "default" : "outline"}
              className={activeCategory === category.id.toString() ? "bg-primary text-white" : ""}
              onClick={() => setActiveCategory(category.id.toString())}
            >
              {language === 'ar' ? category.nameAr : category.nameTr}
            </Button>
          ))}
        </div>
        
        {/* Menu items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.length > 0 ? (
            filteredItems.map((item: any) => {
              const category = categories?.find((cat: any) => cat.id === item.categoryId);
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
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-lg text-foreground/70">
                {language === 'ar' 
                  ? 'لا توجد عناصر في هذه الفئة حالياً'
                  : 'No items in this category yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MenuPage;
