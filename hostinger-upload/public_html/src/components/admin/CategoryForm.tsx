import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { apiClient } from '@/lib/utils';
import { insertCategorySchema, Category } from '@shared/schema';

// Create an extended schema with validations
const categoryFormSchema = insertCategorySchema.extend({
  nameAr: z.string().min(2, { message: "Name in Arabic is required" }),
  nameTr: z.string().min(2, { message: "Name in Turkish is required" }),
  slug: z.string().min(2, { message: "Slug is required" }).regex(/^[a-z0-9-]+$/, {
    message: "Slug must contain only lowercase letters, numbers, and hyphens",
  }),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
}

const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nameAr: category?.nameAr || '',
      nameTr: category?.nameTr || '',
      slug: category?.slug || '',
    },
  });

  // Auto-generate slug from Arabic or Turkish name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')     // Replace multiple - with single -
      .replace(/^-+/, '')         // Trim - from start
      .replace(/-+$/, '');        // Trim - from end
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: apiClient.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: language === 'ar' ? "تم إنشاء الفئة" : "Category Created",
        description: language === 'ar' 
          ? "تم إنشاء الفئة بنجاح" 
          : "Category has been created successfully",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const response = await fetch(`/api/categories/${category?.id}`, {
        method: 'PUT',
        headers: apiClient.getAuthHeaders(),
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: language === 'ar' ? "تم تحديث الفئة" : "Category Updated",
        description: language === 'ar' 
          ? "تم تحديث الفئة بنجاح" 
          : "Category has been updated successfully",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: CategoryFormValues) => {
    if (category) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nameAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {language === 'ar' ? "الاسم (عربي)" : "Name (Arabic)"}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  dir="rtl" 
                  className="font-arabic"
                  onChange={(e) => {
                    field.onChange(e);
                    // Auto-generate slug if it's a new category
                    if (!category && !form.getValues('slug')) {
                      form.setValue('slug', generateSlug(e.target.value));
                    }
                  }}
                />
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
              <FormLabel>
                {language === 'ar' ? "الاسم (تركي)" : "Name (Turkish)"}
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  dir="ltr" 
                  className="font-turkish"
                  onChange={(e) => {
                    field.onChange(e);
                    // Auto-generate slug if it's a new category and arabic name is empty
                    if (!category && !form.getValues('slug') && !form.getValues('nameAr')) {
                      form.setValue('slug', generateSlug(e.target.value));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => onSuccess && onSuccess()}
          >
            {language === 'ar' ? "إلغاء" : "Cancel"}
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <i className="bi bi-hourglass-split animate-spin mr-2"></i>
            ) : null}
            {category 
              ? (language === 'ar' ? "تحديث" : "Update") 
              : (language === 'ar' ? "إضافة" : "Add")
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
