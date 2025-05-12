import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { formatCurrency } from '@/lib/utils';
import { MenuItem, Category } from '@shared/schema';

interface MenuItemCardProps {
  item: MenuItem;
  category?: Category;
}

const MenuItemCard = ({ item, category }: MenuItemCardProps) => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';

  // Get name and description based on language
  const name = language === 'ar' ? item.nameAr : item.nameTr;
  const description = language === 'ar' ? item.descriptionAr : item.descriptionTr;
  
  // Get category name based on language if category is provided
  const categoryName = category 
    ? (language === 'ar' ? category.nameAr : category.nameTr)
    : t(`category.${item.categoryId === 1 ? 'appetizers' : item.categoryId === 2 ? 'main-dishes' : item.categoryId === 3 ? 'drinks' : 'desserts'}`);

  return (
    <Card className="overflow-hidden menu-card transition-all duration-300 hover:shadow-md dark:shadow-none dark:hover:shadow-primary/5">
      <div className="w-full h-40 sm:h-48 overflow-hidden">
        <img 
          src={item.imageUrl || ''} 
          alt={name} 
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-wrap justify-between items-start mb-2 gap-1">
          <h3 className="text-lg sm:text-xl font-bold text-secondary dark:text-secondary line-clamp-1">{name}</h3>
          <div className="flex flex-col items-end">
            <span className="text-primary dark:text-primary font-bold text-base sm:text-lg whitespace-nowrap">{formatCurrency(item.price)}</span>
            {item.travelPrice && (
              <span 
                className="text-xs sm:text-sm whitespace-nowrap" 
                style={{ color: item.travelPriceColor || '#FF5722' }}
              >
                {isRtl ? `توصيل: ${formatCurrency(item.travelPrice)}` : `Delivery: ${formatCurrency(item.travelPrice)}`}
              </span>
            )}
          </div>
        </div>
        <p className="text-foreground/80 dark:text-foreground/70 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center">
          <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary text-xs font-medium px-2 py-1 rounded truncate">
            {categoryName}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
