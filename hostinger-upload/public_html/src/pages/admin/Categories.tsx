import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Skeleton } from '@/components/ui/skeleton';
import { apiClient } from '@/lib/utils';
import CategoryForm from '@/components/admin/CategoryForm';

interface Category {
  id: number;
  nameAr: string;
  nameTr: string;
  slug: string;
}

const AdminCategories = () => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: apiClient.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: language === 'ar' ? "تم حذف الفئة" : "Category Deleted",
        description: language === 'ar' 
          ? "تم حذف الفئة بنجاح" 
          : "Category has been deleted successfully",
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

  // Handle category edit
  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setIsEditDialogOpen(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditCategory(null);
  };

  // Handle category delete
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary">{t('admin.categories')}</h1>
          <p className="text-foreground/70">
            {language === 'ar' 
              ? "إدارة فئات قائمة الطعام"
              : "Manage menu categories"
            }
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <i className={`bi bi-plus-lg ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
              {language === 'ar' ? "إضافة فئة جديدة" : "Add New Category"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {language === 'ar' ? "إضافة فئة جديدة" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'ar' ? "فئات القائمة" : "Menu Categories"}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? "قائمة بجميع الفئات المستخدمة في قائمة المطعم"
              : "List of all categories used in the restaurant menu"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
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
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>ID</TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {language === 'ar' ? "الاسم (عربي)" : "Name (Arabic)"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {language === 'ar' ? "الاسم (تركي)" : "Name (Turkish)"}
                    </TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>Slug</TableHead>
                    <TableHead className={isRtl ? "text-right" : "text-left"}>
                      {language === 'ar' ? "الإجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.length > 0 ? (
                    categories.map((category: Category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell dir="rtl" className="font-arabic">{category.nameAr}</TableCell>
                        <TableCell dir="ltr" className="font-turkish">{category.nameTr}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-primary"
                              onClick={() => handleEdit(category)}
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
                                      ? `سيتم حذف الفئة "${category.nameAr}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.`
                                      : `This will permanently delete the "${category.nameTr}" category. This action cannot be undone.`
                                    }
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    {language === 'ar' ? "إلغاء" : "Cancel"}
                                  </AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(category.id)}
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
                          ? "لا توجد فئات. قم بإضافة فئة جديدة."
                          : "No categories found. Add a new category."
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

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? "تعديل الفئة" : "Edit Category"}
            </DialogTitle>
          </DialogHeader>
          {editCategory && (
            <CategoryForm category={editCategory} onSuccess={handleFormSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCategories;
