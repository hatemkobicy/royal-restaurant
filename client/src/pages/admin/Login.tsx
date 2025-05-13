import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

// Form schema
const loginFormSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const AdminLogin = () => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated } = await apiClient.checkAuth();
        if (authenticated) {
          navigate('/admin');
        }
      } catch (error) {
        // Proceed with login
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Form setup
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // For testing purposes - hardcoded admin login
      if (data.username === 'admin' && data.password === 'RoyalRestaurant2023') {
        // Store a mock token
        localStorage.setItem('token', 'mock-admin-token');
        
        // Show success message
        toast({
          title: language === 'ar' ? "تم تسجيل الدخول بنجاح" : "Login Successful",
          description: language === 'ar' 
            ? "مرحباً بك في لوحة تحكم المطعم الملكي" 
            : "Welcome to Royal Restaurant admin dashboard",
        });
        
        // Navigate to admin dashboard
        navigate('/admin');
        return;
      }
      
      const result = await apiClient.login(data.username, data.password);
      
      // Store token
      localStorage.setItem('token', result.token);
      
      // Show success message
      toast({
        title: language === 'ar' ? "تم تسجيل الدخول بنجاح" : "Login Successful",
        description: language === 'ar' 
          ? "مرحباً بك في لوحة تحكم المطعم الملكي" 
          : "Welcome to Royal Restaurant admin dashboard",
      });
      
      // Navigate to admin dashboard
      navigate('/admin');
    } catch (error: any) {
      // Show error message
      toast({
        title: language === 'ar' ? "خطأ في تسجيل الدخول" : "Login Failed",
        description: error.message || (language === 'ar' 
          ? "فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك."
          : "Login failed. Please check your credentials."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-primary">
            {t('admin.login.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.login.username')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.login.password')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="bi bi-hourglass-split animate-spin mr-2"></i>
                    {language === 'ar' ? "جاري تسجيل الدخول..." : "Logging in..."}
                  </>
                ) : (
                  t('admin.login.submit')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-gray-500">
          {language === 'ar' 
            ? "استخدم 'admin' كاسم مستخدم و 'RoyalRestaurant2023' ككلمة مرور" 
            : "Use 'admin' as username and 'RoyalRestaurant2023' as password"
          }
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
