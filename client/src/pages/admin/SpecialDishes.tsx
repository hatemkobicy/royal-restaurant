import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Switch } from '@/components/ui/switch';
import { formatCurrency, apiClient } from '@/lib/utils';
import SpecialDishForm from '@/components/admin/SpecialDishForm';
import { toast } from '@/hooks/use-toast';
import { SpecialDish } from '@shared/schema';
import { Edit, Trash2, Plus, X, Info } from 'lucide-react';

const SpecialDishesAdmin = () => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const queryClient = useQueryClient();
  const [selectedDish, setSelectedDish] = useState<SpecialDish | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  
  // Fetch all special dishes
  const { data: dishes = [], isLoading, error, refetch } = useQuery<SpecialDish[]>({
    queryKey: ['/api/special-dishes'],
  });
  
  // Toggle active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return apiClient.put<SpecialDish>(`/api/special-dishes/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/special-dishes'] });
      toast({
        title: language === 'ar' ? "تم التحديث بنجاح" : "Updated Successfully",
        description: language === 'ar' ? "تم تحديث حالة الطبق بنجاح" : "Dish status updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error toggling dish status:', error);
      toast({
        title: language === 'ar' ? "خطأ في التحديث" : "Update Error",
        description: language === 'ar' ? "حدث خطأ أثناء تحديث حالة الطبق" : "An error occurred while updating dish status",
        variant: "destructive",
      });
    }
  });
  
  // Delete dish mutation
  const deleteDishMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiClient.delete(`/api/special-dishes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/special-dishes'] });
      toast({
        title: language === 'ar' ? "تم الحذف بنجاح" : "Deleted Successfully",
        description: language === 'ar' ? "تم حذف الطبق المميز بنجاح" : "Special dish deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting special dish:', error);
      toast({
        title: language === 'ar' ? "خطأ في الحذف" : "Delete Error",
        description: language === 'ar' ? "حدث خطأ أثناء حذف الطبق المميز" : "An error occurred while deleting the special dish",
        variant: "destructive",
      });
    }
  });
  
  // Handle toggling dish active status
  const handleToggleActive = (dish: SpecialDish) => {
    toggleActiveMutation.mutate({
      id: dish.id,
      isActive: !dish.isActive,
    });
  };
  
  // Handle edit button click
  const handleEditDish = (dish: SpecialDish) => {
    setSelectedDish(dish);
    setIsFormOpen(true);
  };
  
  // Handle add new dish
  const handleAddDish = () => {
    setSelectedDish(null);
    setIsFormOpen(true);
  };
  
  // Handle form submission success
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedDish(null);
  };
  
  // Sort dishes by position
  const sortedDishes = [...dishes].sort((a, b) => a.position - b.position);
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {language === 'ar' ? "الأطباق المميزة" : "Special Dishes"}
          </h1>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsInfoOpen(true)}>
              <Info className="h-4 w-4 me-2" />
              {language === 'ar' ? "تعليمات" : "Info"}
            </Button>
            
            <Button onClick={handleAddDish}>
              <Plus className="h-4 w-4 me-2" />
              {language === 'ar' ? "إضافة طبق مميز" : "Add Special Dish"}
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <p>{language === 'ar' ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{language === 'ar' ? "حدث خطأ أثناء تحميل البيانات" : "Error loading data"}</p>
            <Button variant="outline" onClick={() => refetch()} className="mt-2">
              {language === 'ar' ? "إعادة المحاولة" : "Retry"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sortedDishes.length === 0 ? (
              <div className="text-center py-10 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'ar' 
                    ? "لا توجد أطباق مميزة. أضف بعض الأطباق لعرضها في الصفحة الرئيسية." 
                    : "No special dishes yet. Add some dishes to display on the homepage."}
                </p>
                <Button onClick={handleAddDish} className="mt-4">
                  {language === 'ar' ? "إضافة طبق مميز" : "Add Special Dish"}
                </Button>
              </div>
            ) : (
              sortedDishes.map((dish) => (
                <Card key={dish.id} className={dish.isActive ? "border-primary/30" : "opacity-70"}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <CardTitle className={isRtl ? "font-arabic" : ""}>
                            {isRtl ? dish.titleAr : dish.titleTr}
                          </CardTitle>
                          <div className="flex items-center mt-1 gap-2">
                            <span className="text-sm text-gray-500">
                              {language === 'ar' ? "الترتيب: " : "Position: "}
                              {dish.position}
                            </span>
                            <span className="text-sm text-gray-500">
                              {language === 'ar' ? "السعر: " : "Price: "}
                              {formatCurrency(dish.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={dish.isActive}
                          onCheckedChange={() => handleToggleActive(dish)}
                        />
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditDish(dish)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {language === 'ar' ? "هل أنت متأكد؟" : "Are you sure?"}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {language === 'ar'
                                  ? `هذا الإجراء سيؤدي إلى حذف طبق "${dish.titleAr}" نهائياً`
                                  : `This action will permanently delete dish "${dish.titleTr}"`
                                }
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {language === 'ar' ? "إلغاء" : "Cancel"}
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteDishMutation.mutate(dish.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {language === 'ar' ? "حذف" : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <div className="w-full h-40 rounded-md overflow-hidden">
                        <img
                          src={dish.imageUrl}
                          alt={isRtl ? dish.titleAr : dish.titleTr}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <p className={`text-sm text-gray-600 dark:text-gray-300 mb-2 ${isRtl ? 'font-arabic' : ''}`}>
                        {isRtl ? dish.descriptionAr : dish.descriptionTr}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
      
      {/* Add/Edit Dish Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedDish
                ? (language === 'ar' ? "تعديل طبق مميز" : "Edit Special Dish")
                : (language === 'ar' ? "إضافة طبق مميز" : "Add Special Dish")
              }
            </DialogTitle>
            <DialogDescription>
              {language === 'ar'
                ? "هذه الأطباق المميزة ستظهر في قسم خاص على الصفحة الرئيسية"
                : "These special dishes will appear in a dedicated section on the homepage"
              }
            </DialogDescription>
          </DialogHeader>
          
          <SpecialDishForm 
            dish={selectedDish || undefined}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>
      
      {/* Info Dialog */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? "معلومات" : "Information"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-sm">
            <p>
              {language === 'ar'
                ? "يمكنك إضافة حتى 3 أطباق مميزة لعرضها في قسم \"أطباقنا المميزة\" على الصفحة الرئيسية."
                : "You can add up to 3 special dishes to be displayed in the \"Our Special Dishes\" section on the homepage."
              }
            </p>
            <p>
              {language === 'ar'
                ? "استخدم خاصية \"الترتيب\" لتحديد موقع كل طبق في القسم (1-3)."
                : "Use the \"Position\" feature to determine the location of each dish in the section (1-3)."
              }
            </p>
            <p>
              {language === 'ar'
                ? "يمكنك تفعيل أو تعطيل أي طبق باستخدام زر التبديل دون الحاجة لحذفه."
                : "You can activate or deactivate any dish using the toggle button without having to delete it."
              }
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SpecialDishesAdmin;