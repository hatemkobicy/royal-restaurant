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
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function Categories() {
  const { t, language, isRtl } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: () => apiClient('/api/categories'),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient(`/api/categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: language === 'ar' ? "تم الحذف بنجاح" : "Deleted successfully",
        description: language === 'ar' ? "تم حذف الفئة بنجاح" : "Category deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: language === 'ar' ? "خطأ في الحذف" : "Delete error",
        description: error.message || (language === 'ar' ? "حدث خطأ أثناء الحذف" : "An error occurred while deleting"),
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
      {/* Mobile-friendly header */}
      <div className="mb-6 space-y-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-secondary">{t('admin.categories')}</h1>
          <p className="text-sm md:text-base text-foreground/70">
            {language === 'ar' 
              ? "إدارة فئات قائمة الطعام"
              : "Manage menu categories"
            }
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto h-12 md:h-10 text-base md:text-sm">
              <i className={`bi bi-plus-lg ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
              {language === 'ar' ? "إضافة فئة جديدة" : "Add New Category"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] mx-4">
            <DialogHeader>
              <DialogTitle>
                {language === 'ar' ? "إضافة فئة جديدة" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
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
                <Card key={index} className="p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[70%]" />
                      <Skeleton className="h-4 w-[50%]" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Mobile view - Cards */}
              <div className="block md:hidden space-y-4">
                {categories && categories.length > 0 ? (
                  categories.map((category: Category) => (
                    <Card key={category.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1 flex-1">
                            <div className="text-sm text-gray-500">ID: {category.id}</div>
                            <div className="font-semibold text-base" dir="rtl">{category.nameAr}</div>
                            <div className="text-gray-600" dir="ltr">{category.nameTr}</div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                              {category.slug}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2 border-t">
                          <Dialog open={isEditDialogOpen && editCategory?.id === category.id} 
                                 onOpenChange={(open) => {
                                   setIsEditDialogOpen(open);
                                   if (!open) setEditCategory(null);
                                 }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 h-10"
                                onClick={() => handleEdit(category)}
                              >
                                <i className={`bi bi-pencil ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
                                {language === 'ar' ? "تعديل" : "Edit"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] mx-4">
                              <DialogHeader>
                                <DialogTitle>
                                  {language === 'ar' ? "تعديل الفئة" : "Edit Category"}
                                </DialogTitle>
                              </DialogHeader>
                              <CategoryForm category={editCategory || undefined} onSuccess={handleFormSuccess} />
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="flex-1 h-10">
                                <i className={`bi bi-trash ${isRtl ? 'ml-2' : 'mr-2'}`}></i>
                                {language === 'ar' ? "حذف" : "Delete"}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="mx-4">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {language === 'ar' ? "تأكيد الحذف" : "Confirm Delete"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {language === 'ar' 
                                    ? `هل أنت متأكد من حذف فئة "${category.nameAr}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                                    : `Are you sure you want to delete category "${category.nameTr}"? This action cannot be undone.`
                                  }
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {language === 'ar' ? "إلغاء" : "Cancel"}
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(category.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {language === 'ar' ? "حذف" : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {language === 'ar' ? "لا توجد فئات" : "No categories found"}
                  </div>
                )}
              </div>

              {/* Desktop view - Table */}
              <div className="hidden md:block overflow-x-auto">
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
                    {categories && categories.length > 0 ? (
                      categories.map((category: Category) => (
                        <TableRow key={category.id}>
                          <TableCell>{category.id}</TableCell>
                          <TableCell dir="rtl" className="font-arabic">{category.nameAr}</TableCell>
                          <TableCell dir="ltr" className="font-turkish">{category.nameTr}</TableCell>
                          <TableCell>{category.slug}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog open={isEditDialogOpen && editCategory?.id === category.id} 
                                     onOpenChange={(open) => {
                                       setIsEditDialogOpen(open);
                                       if (!open) setEditCategory(null);
                                     }}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEdit(category)}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      {language === 'ar' ? "تعديل الفئة" : "Edit Category"}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <CategoryForm category={editCategory || undefined} onSuccess={handleFormSuccess} />
                                </DialogContent>
                              </Dialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-destructive">
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {language === 'ar' ? "تأكيد الحذف" : "Confirm Delete"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {language === 'ar' 
                                        ? `هل أنت متأكد من حذف فئة "${category.nameAr}"؟`
                                        : `Are you sure you want to delete category "${category.nameTr}"?`
                                      }
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      {language === 'ar' ? "إلغاء" : "Cancel"}
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDelete(category.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          {language === 'ar' ? "لا توجد فئات" : "No categories found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
