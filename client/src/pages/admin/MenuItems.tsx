import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import MenuItemForm from '@/components/admin/MenuItemForm';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatCurrency, apiClient } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { MenuItem, Category } from '@shared/schema';

const AdminMenuItems = () => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>([]);

  // Fetch menu items
  const { data: menuItems, isLoading: menuItemsLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items']
  });
  
  // Initialize local state from localStorage and API data
  useEffect(() => {
    // Try to load from localStorage first (for development mode)
    try {
      const storedItems = localStorage.getItem('menuItems');
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          console.log('Loaded menu items from localStorage:', parsedItems.length);
          setLocalMenuItems(parsedItems);
          return; // Skip API data if we have localStorage data
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    // Fall back to API data if localStorage is empty or fails
    if (menuItems && Array.isArray(menuItems)) {
      setLocalMenuItems(menuItems);
    }
  }, [menuItems]);

  // Fetch categories for mapping to menu items
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Public methods for adding and updating menu items
  const addMenuItem = (item: MenuItem) => {
    setLocalMenuItems(prev => [item, ...prev]);
  };

  const updateMenuItem = (updatedItem: MenuItem) => {
    setLocalMenuItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  };

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: 'DELETE',
        headers: apiClient.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }
      
      return id;
    },
    onSuccess: (id) => {
      // Update local state
      setLocalMenuItems(prev => prev.filter(item => item.id !== id));
      
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      toast({
        title: language === 'ar' ? "تم حذف العنصر" : "Menu Item Deleted",
        description: language === 'ar' 
          ? "تم حذف العنصر بنجاح" 
          : "Menu item has been deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get category name by id
  const getCategoryName = (categoryId: number) => {
    if (!categories) return '';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? (language === 'ar' ? category.nameAr : category.nameTr) : '';
  };

  // Handle menu item edit
  const handleEdit = (item: MenuItem) => {
    setEditItem(item);
    setIsEditDialogOpen(true);
  };

  // Handle form success
  const handleFormSuccess = (item: MenuItem, isUpdate: boolean = false) => {
    // Update local state
    if (isUpdate) {
      updateMenuItem(item);
    } else {
      addMenuItem(item);
    }
    
    // Close dialogs
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditItem(null);
  };

  // Handle menu item delete
  const handleDelete = (id: number) => {
    // For mock development mode, also delete from localStorage
    if (localStorage.getItem('token') === 'mock-admin-token') {
      try {
        const storedItems = localStorage.getItem('menuItems');
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          const updatedItems = parsedItems.filter((item: any) => item.id !== id);
          localStorage.setItem('menuItems', JSON.stringify(updatedItems));
          console.log('Deleted menu item from localStorage:', id);
          
          // Update local state immediately for UI
          setLocalMenuItems(prev => prev.filter(item => item.id !== id));
          
          // Show success toast
          toast({
            title: language === 'ar' ? "تم حذف العنصر" : "Menu Item Deleted",
            description: language === 'ar' 
              ? "تم حذف العنصر بنجاح" 
              : "Menu item has been deleted successfully",
          });
          
          return; // Skip actual API call in mock mode
        }
      } catch (error) {
        console.error('Error deleting from localStorage:', error);
      }
    }
    
    // Regular API-based delete
    deleteMutation.mutate(id);
  };

  const isLoading = menuItemsLoading || categoriesLoading;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">{t('admin.menu-items')}</h1>
          <p className="text-foreground/70">
            {language === 'ar' 
              ? "إدارة عناصر قائمة الطعام"
              : "Manage menu items"
            }
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <i className={`bi bi-plus-lg ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
              {language === 'ar' ? "إضافة عنصر جديد" : "Add New Item"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {language === 'ar' ? "إضافة عنصر جديد" : "Add New Menu Item"}
              </DialogTitle>
            </DialogHeader>
            <MenuItemForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? "عناصر القائمة" : "Menu Items"}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? "قائمة بجميع عناصر القائمة في المطعم"
              : "List of all menu items in the restaurant"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {menuItemsLoading || categoriesLoading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : localMenuItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {language === 'ar' 
                  ? "لا توجد عناصر في القائمة بعد" 
                  : "No menu items added yet"}
              </p>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <i className={`bi bi-plus-lg ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
                {language === 'ar' ? "إضافة عنصر جديد" : "Add First Menu Item"}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {language === 'ar' ? "العنصر" : "Item"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {language === 'ar' ? "الفئة" : "Category"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {language === 'ar' ? "السعر" : "Price"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {language === 'ar' ? "الحالة" : "Status"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {language === 'ar' ? "الإجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localMenuItems.length > 0 ? (
                    localMenuItems.map((item: MenuItem) => (
                      <TableRow key={item.id}>
                        <TableCell>
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
                          <Badge variant={item.isAvailable ? "default" : "secondary"}>
                            {item.isAvailable 
                              ? (language === 'ar' ? "متاح" : "Available") 
                              : (language === 'ar' ? "غير متاح" : "Unavailable")
                            }
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-primary"
                              onClick={() => handleEdit(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-accent">
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {language === 'ar' ? "هل أنت متأكد؟" : "Are you sure?"}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {language === 'ar' 
                                      ? `سيتم حذف العنصر "${item.nameAr}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.`
                                      : `This will permanently delete the "${item.nameTr}" item. This action cannot be undone.`
                                    }
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    {language === 'ar' ? "إلغاء" : "Cancel"}
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-accent hover:bg-accent/90"
                                  >
                                    {language === 'ar' ? "حذف" : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        {language === 'ar' 
                          ? "لا توجد عناصر. قم بإضافة عنصر جديد."
                          : "No menu items found. Add a new item."
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? "تعديل العنصر" : "Edit Menu Item"}
            </DialogTitle>
          </DialogHeader>
          {editItem && (
            <MenuItemForm menuItem={editItem} onSuccess={handleFormSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminMenuItems;
