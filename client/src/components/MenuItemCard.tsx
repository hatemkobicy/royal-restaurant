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
      <div className="w-full h-48 overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-secondary dark:text-secondary">{name}</h3>
          <span className="text-primary dark:text-primary font-bold">{formatCurrency(item.price)}</span>
        </div>
        <p className="text-foreground/80 dark:text-foreground/70 text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary text-xs font-medium px-2.5 py-1 rounded">
            {categoryName}
          </span>
          <Button variant="ghost" size="sm" className="text-accent dark:text-accent hover:text-accent/80 dark:hover:text-accent/90 transition">
            <i className="bi bi-heart text-lg"></i>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
