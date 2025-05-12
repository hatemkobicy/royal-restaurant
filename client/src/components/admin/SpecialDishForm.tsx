import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { menuItemImages, apiClient } from '@/lib/utils';
import { insertSpecialDishSchema, SpecialDish } from '@shared/schema';
import { toast } from '@/hooks/use-toast';

// Create an extended schema with validations
const specialDishFormSchema = insertSpecialDishSchema.extend({
  titleAr: z.string().min(2, { message: 'Title in Arabic is required' }),
  titleTr: z.string().min(2, { message: 'Title in Turkish is required' }),
  descriptionAr: z.string().min(5, { message: 'Description in Arabic is required' }),
  descriptionTr: z.string().min(5, { message: 'Description in Turkish is required' }),
  price: z.number().min(0, { message: 'Price must be positive' }),
  position: z.number().min(1, { message: 'Position must be positive' }).max(3, { message: 'Maximum position is 3' }),
});

type SpecialDishFormValues = z.infer<typeof specialDishFormSchema>;

interface SpecialDishFormProps {
  dish?: SpecialDish;
  onSuccess?: (dish: SpecialDish, isUpdate: boolean) => void;
}

const SpecialDishForm = ({ dish, onSuccess }: SpecialDishFormProps) => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const queryClient = useQueryClient();
  const stockImages = menuItemImages.map(img => img.url);
  
  // Fetch all dishes to check positions
  const { data: allDishes = [] } = useQuery<SpecialDish[]>({
    queryKey: ['/api/special-dishes'],
  });
  
  // Form setup
  const form = useForm<SpecialDishFormValues>({
    resolver: zodResolver(specialDishFormSchema),
    defaultValues: {
      titleAr: dish?.titleAr || '',
      titleTr: dish?.titleTr || '',
      descriptionAr: dish?.descriptionAr || '',
      descriptionTr: dish?.descriptionTr || '',
      price: dish?.price || 0,
      imageUrl: dish?.imageUrl || '',
      position: dish?.position || findNextAvailablePosition(allDishes),
      isActive: dish?.isActive ?? true,
    },
  });

  // Find the next available position (1, 2, or 3)
  function findNextAvailablePosition(dishes: SpecialDish[]): number {
    const usedPositions = new Set(dishes.map(d => d.position));
    for (let i = 1; i <= 3; i++) {
      if (!usedPositions.has(i) || (dish && dish.position === i)) {
        return i;
      }
    }
    return 1; // Default to 1 if all positions are taken (will need validation)
  }

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: SpecialDishFormValues) => {
      return apiClient.post<SpecialDish>('/api/special-dishes', data);
    },
    onSuccess: (newDish) => {
      queryClient.invalidateQueries({ queryKey: ['/api/special-dishes'] });
      toast({
        title: language === 'ar' ? "تمت الإضافة بنجاح" : "Added Successfully",
        description: language === 'ar' ? "تمت إضافة الطبق المميز بنجاح" : "The special dish has been added successfully",
      });
      if (onSuccess) onSuccess(newDish, false);
    },
    onError: (error) => {
      console.error('Error creating special dish:', error);
      toast({
        title: language === 'ar' ? "خطأ في الإضافة" : "Error Adding",
        description: language === 'ar' ? "حدث خطأ أثناء إضافة الطبق المميز" : "An error occurred while adding the special dish",
        variant: "destructive",
      });
    }
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: SpecialDishFormValues) => {
      return apiClient.put<SpecialDish>(`/api/special-dishes/${dish?.id}`, data);
    },
    onSuccess: (updatedDish) => {
      queryClient.invalidateQueries({ queryKey: ['/api/special-dishes'] });
      toast({
        title: language === 'ar' ? "تم التحديث بنجاح" : "Updated Successfully",
        description: language === 'ar' ? "تم تحديث الطبق المميز بنجاح" : "The special dish has been updated successfully",
      });
      if (onSuccess) onSuccess(updatedDish, true);
    },
    onError: (error) => {
      console.error('Error updating special dish:', error);
      toast({
        title: language === 'ar' ? "خطأ في التحديث" : "Error Updating",
        description: language === 'ar' ? "حدث خطأ أثناء تحديث الطبق المميز" : "An error occurred while updating the special dish",
        variant: "destructive",
      });
    }
  });
  
  // Image selector state
  const [showImageSelector, setShowImageSelector] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: language === 'ar' ? "الملف كبير جدًا" : "File Too Large",
        description: language === 'ar' ? "يجب أن يكون حجم الملف أقل من 2 ميجابايت" : "File size must be less than 2MB",
        variant: "destructive",
      });
      return;
    }
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedImage(result);
      form.setValue('imageUrl', result);
    };
    reader.readAsDataURL(file);
  };
  
  // Form submission
  const onSubmit = async (data: SpecialDishFormValues) => {
    try {
      // Check if we need to add a default image
      if (!data.imageUrl && stockImages.length > 0) {
        data.imageUrl = stockImages[0];
      }
      
      // Handle custom upload
      if (uploadedImage && !data.imageUrl.startsWith('http')) {
        console.log('Using uploaded image');
        data.imageUrl = uploadedImage;
      }
      
      console.log('Final data to submit:', data);
      
      // Show toast to indicate form is being processed
      toast({
        title: dish 
          ? (language === 'ar' ? "جاري التحديث..." : "Updating...") 
          : (language === 'ar' ? "جاري الإضافة..." : "Adding dish..."),
        description: language === 'ar' 
          ? "يرجى الانتظار قليلاً" 
          : "Please wait a moment",
      });
      
      if (dish) {
        updateMutation.mutate(data);
      } else {
        createMutation.mutate(data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' 
          ? "حدث خطأ أثناء معالجة النموذج" 
          : "An error occurred while processing the form",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="titleAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الطبق (بالعربية)</FormLabel>
                  <FormControl>
                    <Input {...field} dir="rtl" className="font-arabic" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="titleTr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الطبق (بالتركية)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.form.price')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      {...field} 
                      onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الترتيب (1-3)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="3" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="descriptionAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>وصف الطبق (بالعربية)</FormLabel>
                <FormControl>
                  <Textarea {...field} dir="rtl" className="font-arabic" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="descriptionTr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>وصف الطبق (بالتركية)</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>صورة الطبق</FormLabel>
                <div className="space-y-4">
                  {/* Preview current image */}
                  {field.value && (
                    <div className="relative w-full h-40 rounded-md overflow-hidden border">
                      <img 
                        src={field.value}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Image input options */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Custom upload */}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {language === 'ar' 
                          ? 'الحد الأقصى للحجم: 2 ميجابايت. الصيغ المدعومة: JPG, PNG, GIF' 
                          : 'Max size: 2MB. Formats: JPG, PNG, GIF'}
                      </p>
                    </div>
                    
                    {/* Stock images */}
                    <div>
                      <Popover open={showImageSelector} onOpenChange={setShowImageSelector}>
                        <PopoverTrigger asChild>
                          <Button 
                            type="button"
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            {language === 'ar' ? 'اختر من الصور' : 'Choose from Stock'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-2">
                          <div className="grid grid-cols-2 gap-2">
                            {stockImages.map((img, index) => (
                              <div 
                                key={index}
                                className={`relative cursor-pointer rounded-md overflow-hidden border h-24 ${
                                  field.value === img ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => {
                                  form.setValue('imageUrl', img);
                                  setShowImageSelector(false);
                                }}
                              >
                                <img 
                                  src={img} 
                                  alt={`Stock ${index + 1}`} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <FormControl>
                    <Input 
                      type="hidden" 
                      {...field} 
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {language === 'ar' ? 'نشط' : 'Active'}
                  </FormLabel>
                  <p className="text-sm text-gray-500">
                    {language === 'ar' 
                      ? 'تفعيل أو تعطيل ظهور هذا الطبق في قسم الأطباق المميزة' 
                      : 'Enable or disable this dish in the special dishes section'}
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                if (onSuccess) onSuccess(null as any, false);
              }}
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button 
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {dish
                ? (language === 'ar' ? 'تحديث الطبق' : 'Update Dish')
                : (language === 'ar' ? 'إضافة طبق' : 'Add Dish')
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SpecialDishForm;