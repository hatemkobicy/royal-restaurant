import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/utils';
import { insertMenuItemSchema, MenuItem } from '@shared/schema';

// Create an extended schema with validations
const menuItemFormSchema = insertMenuItemSchema.extend({
  nameAr: z.string().min(2, { message: 'Name in Arabic is required' }),
  nameTr: z.string().min(2, { message: 'Name in Turkish is required' }),
  descriptionAr: z.string().min(5, { message: 'Description in Arabic is required' }),
  descriptionTr: z.string().min(5, { message: 'Description in Turkish is required' }),
  price: z.number().min(0, { message: 'Price must be positive' }),
  categoryId: z.coerce.number().min(1, { message: 'Category is required' }),
});

type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;

interface MenuItemFormProps {
  menuItem?: MenuItem;
  onSuccess?: (item: MenuItem, isUpdate: boolean) => void;
}

const MenuItemForm = ({ menuItem, onSuccess }: MenuItemFormProps) => {
  const { t, getDirection, language } = useTranslation();
  const { toast } = useToast();
  const isRtl = getDirection() === 'rtl';
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState<string>('');

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });

  // Form setup
  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      nameAr: menuItem?.nameAr || '',
      nameTr: menuItem?.nameTr || '',
      descriptionAr: menuItem?.descriptionAr || '',
      descriptionTr: menuItem?.descriptionTr || '',
      price: menuItem?.price || 0,
      imageUrl: menuItem?.imageUrl || '',
      isAvailable: menuItem?.isAvailable ?? true,
      categoryId: menuItem?.categoryId || 1,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: MenuItemFormValues) => {
      console.log('Submitting menu item data:', data);
      
      // Special handling for mock token (development only)
      if (localStorage.getItem('token') === 'mock-admin-token') {
        console.log('Using mock token for menu item creation');
        // Get existing items or initialize empty array
        const existingItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        
        // Create mock item with generated ID
        const mockResult = {
          id: Math.floor(Math.random() * 10000),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add new item to stored items
        const updatedItems = [mockResult, ...existingItems];
        localStorage.setItem('menuItems', JSON.stringify(updatedItems));
        console.log('Saved menu item to localStorage:', mockResult);
        
        // Add a small delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockResult;
      }
      
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: apiClient.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error response:', errorData);
        throw new Error(`Failed to create menu item: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Menu item created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      
      // Show success toast
      toast({
        title: language === 'ar' ? "تمت إضافة العنصر بنجاح" : "Item Added Successfully",
        description: language === 'ar' 
          ? "تم إضافة العنصر الجديد إلى القائمة" 
          : "The new item has been added to the menu",
      });
      
      form.reset();
      setImageUrl('');
      setUploadedImage(null);
      
      if (onSuccess) onSuccess(data, false);
    },
    onError: (error) => {
      console.error('Error creating menu item:', error);
      toast({
        title: language === 'ar' ? "فشل في إضافة العنصر" : "Failed to Add Item",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: MenuItemFormValues) => {
      console.log('Updating menu item data:', data);
      
      // Special handling for mock token (development only)
      if (localStorage.getItem('token') === 'mock-admin-token') {
        console.log('Using mock token for menu item update');
        
        // Get existing items
        const existingItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        
        // Create updated item
        const mockResult = {
          id: menuItem?.id,
          ...data,
          updatedAt: new Date().toISOString()
        };
        
        // Update the item in the list
        const updatedItems = existingItems.map((item: any) => 
          item.id === menuItem?.id ? mockResult : item
        );
        
        // Save back to localStorage
        localStorage.setItem('menuItems', JSON.stringify(updatedItems));
        console.log('Updated menu item in localStorage:', mockResult);
        
        // Add a small delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockResult;
      }
      
      const response = await fetch(`/api/menu-items/${menuItem?.id}`, {
        method: 'PUT',
        headers: apiClient.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error response:', errorData);
        throw new Error(`Failed to update menu item: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Menu item updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      
      // Show success toast
      toast({
        title: language === 'ar' ? "تم تحديث العنصر بنجاح" : "Item Updated Successfully",
        description: language === 'ar' 
          ? "تم تحديث العنصر في القائمة" 
          : "The item has been updated in the menu",
      });
      
      if (onSuccess) onSuccess(data, true);
    },
    onError: (error) => {
      console.error('Error updating menu item:', error);
      toast({
        title: language === 'ar' ? "فشل في تحديث العنصر" : "Failed to Update Item",
        description: String(error),
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = async (data: MenuItemFormValues) => {
    try {
      console.log('Form submitted with data:', data);
      
      // Add default image URL if none provided
      if (!data.imageUrl) {
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
        title: menuItem 
          ? (language === 'ar' ? "جاري التحديث..." : "Updating...") 
          : (language === 'ar' ? "جاري الإضافة..." : "Adding item..."),
        description: language === 'ar' 
          ? "يرجى الانتظار قليلاً" 
          : "Please wait a moment",
      });
      
      if (menuItem) {
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

  // State for uploaded image
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Stock image URLs for form
  const stockImages = [
    "https://images.unsplash.com/photo-1544025162-d76694265947",
    "https://images.unsplash.com/photo-1577906096429-f73c2c312435",
    "https://images.pixabay.com/photo/2020/03/07/16/02/baklava-4910371_1280.jpg",
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
    "https://images.unsplash.com/photo-1603360946369-dc9bb6258143",
    "https://images.unsplash.com/photo-1541167760496-1628856ab772"
  ];

  // Handle stock image selection
  const handleImageSelect = (url: string) => {
    setImageUrl(url);
    form.setValue('imageUrl', url);
    setUploadedImage(null);
  };
  
  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        form.setValue('imageUrl', result);
        setImageUrl('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Set image URL when editing
  useEffect(() => {
    if (menuItem?.imageUrl) {
      setImageUrl(menuItem.imageUrl);
    }
  }, [menuItem]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="nameAr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.form.name.ar')}</FormLabel>
                <FormControl>
                  <Input {...field} dir="rtl" className="font-arabic" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameTr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.form.name.tr')}</FormLabel>
                <FormControl>
                  <Input {...field} dir="ltr" className="font-turkish" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('admin.form.category')}</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.isArray(categories) ? categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {isRtl ? category.nameAr : category.nameTr}
                      </SelectItem>
                    )) : (
                      <SelectItem value="1">Loading categories...</SelectItem>
                    )}
                  </SelectContent>
                </Select>
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
        </div>
        
        <FormField
          control={form.control}
          name="descriptionAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('admin.form.description.ar')}</FormLabel>
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
              <FormLabel>{t('admin.form.description.tr')}</FormLabel>
              <FormControl>
                <Textarea {...field} dir="ltr" className="font-turkish" rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
          <FormLabel>{t('admin.form.image')}</FormLabel>
          
          {/* Image Upload Button */}
          <div className="mb-4">
            <label htmlFor="image-upload" className="block w-full">
              <div className="bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg p-4 text-center cursor-pointer hover:bg-primary/20 transition">
                <i className="bi bi-cloud-arrow-up text-2xl text-primary mb-2"></i>
                <p className="font-medium text-primary">{t('admin.form.upload')}</p>
                <p className="text-sm text-muted-foreground">
                  {uploadedImage ? 'Image uploaded successfully' : 'Click to upload from your device'}
                </p>
              </div>
              <input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
            </label>
          </div>
          
          {/* Display Uploaded Image */}
          {uploadedImage && (
            <div className="mb-4 border rounded-md overflow-hidden">
              <img 
                src={uploadedImage} 
                alt="Uploaded food image" 
                className="w-full h-48 object-cover"
              />
            </div>
          )}
          
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input 
                    className="mb-2"
                    name={field.name}
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Stock images grid */}
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Or choose from our stock images:</p>
            <div className="grid grid-cols-3 gap-2">
              {stockImages.map((url, index) => (
                <div 
                  key={index}
                  className={`relative cursor-pointer border rounded-md overflow-hidden ${
                    imageUrl === url ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleImageSelect(url)}
                >
                  <img 
                    src={`${url}?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150&q=80`} 
                    alt={`Stock food image ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  {imageUrl === url && (
                    <div className="absolute top-1 right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <i className="bi bi-check-lg text-xs"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <FormField
          control={form.control}
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  {t('admin.form.available')}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => onSuccess && onSuccess(menuItem || {} as MenuItem, !!menuItem)}
          >
            {t('admin.form.cancel')}
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <i className="bi bi-hourglass-split animate-spin mr-2"></i>
            ) : null}
            {menuItem ? t('admin.form.update') : t('admin.form.submit')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MenuItemForm;
