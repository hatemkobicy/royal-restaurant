import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';

  // Fetch menu items for recent items list
  const { data: menuItems, isLoading: menuItemsLoading } = useQuery({
    queryKey: ['/api/menu-items'],
  });

  // Fetch categories for mapping to menu items
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Get recent items (latest 5)
  const recentItems = menuItems?.slice(0, 5);

  // Get category name by id
  const getCategoryName = (categoryId: number) => {
    if (!categories) return '';
    const category = categories.find((cat: any) => cat.id === categoryId);
    return category ? (language === 'ar' ? category.nameAr : category.nameTr) : '';
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary">{t('admin.dashboard')}</h1>
        <p className="text-foreground/70">
          {language === 'ar' 
            ? `مرحباً، مدير المطعم. آخر تسجيل دخول: ${new Date().toLocaleDateString()}`
            : `Welcome, Restaurant Manager. Last login: ${new Date().toLocaleDateString()}`
          }
        </p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-3 mr-4">
                <i className="bi bi-cart text-2xl text-primary"></i>
              </div>
              <div>
                <p className="text-sm text-foreground/70">{t('admin.stats.orders')}</p>
                <h3 className="text-2xl font-bold text-secondary">28</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-3 mr-4">
                <i className="bi bi-currency-dollar text-2xl text-primary"></i>
              </div>
              <div>
                <p className="text-sm text-foreground/70">{t('admin.stats.revenue')}</p>
                <h3 className="text-2xl font-bold text-secondary">{formatCurrency(12450)}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-3 mr-4">
                <i className="bi bi-people text-2xl text-primary"></i>
              </div>
              <div>
                <p className="text-sm text-foreground/70">{t('admin.stats.bookings')}</p>
                <h3 className="text-2xl font-bold text-secondary">14</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-primary/10 rounded-full p-3 mr-4">
                <i className="bi bi-star text-2xl text-primary"></i>
              </div>
              <div>
                <p className="text-sm text-foreground/70">{t('admin.stats.rating')}</p>
                <h3 className="text-2xl font-bold text-secondary">4.8/5.0</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Items */}
      <Card className="mb-8">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-secondary">{t('admin.items.recent')}</h2>
        </div>
        <div className="overflow-x-auto">
          {menuItemsLoading || categoriesLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {Array(5).fill(0).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={isRtl ? "text-right" : "text-left"}>{t('admin.items.name')}</TableHead>
                  <TableHead className={isRtl ? "text-right" : "text-left"}>{t('admin.items.category')}</TableHead>
                  <TableHead className={isRtl ? "text-right" : "text-left"}>{t('admin.items.price')}</TableHead>
                  <TableHead className={isRtl ? "text-right" : "text-left"}>{t('admin.items.status')}</TableHead>
                  <TableHead className={isRtl ? "text-right" : "text-left"}>{t('admin.items.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentItems?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={item.imageUrl || `https://via.placeholder.com/40?text=${item.id}`} 
                            alt={language === 'ar' ? item.nameAr : item.nameTr} 
                          />
                        </div>
                        <div className={isRtl ? "mr-4" : "ml-4"}>
                          <div className="text-sm font-medium text-secondary">
                            {language === 'ar' ? item.nameAr : item.nameTr}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>
                      <Badge variant={item.isAvailable ? "success" : "destructive"}>
                        {item.isAvailable ? t('admin.items.available') : t('admin.items.unavailable')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-primary">
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-accent">
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboard;
