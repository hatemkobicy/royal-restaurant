import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { useTranslation } from '@/hooks/useTranslation';
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
  onSuccess?: () => void;
}

const MenuItemForm = ({ menuItem, onSuccess }: MenuItemFormProps) => {
  const { t, getDirection } = useTranslation();
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
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: apiClient.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create menu item');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      form.reset();
      if (onSuccess) onSuccess();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: MenuItemFormValues) => {
      const response = await fetch(`/api/menu-items/${menuItem?.id}`, {
        method: 'PUT',
        headers: apiClient.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update menu item');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      if (onSuccess) onSuccess();
    },
  });

  // Handle form submission
  const onSubmit = (data: MenuItemFormValues) => {
    if (menuItem) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

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
                    {categories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {isRtl ? category.nameAr : category.nameTr}
                      </SelectItem>
                    ))}
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} className="mb-2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Stock images grid */}
          <div className="mt-2 grid grid-cols-3 gap-2">
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
            onClick={() => onSuccess && onSuccess()}
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
