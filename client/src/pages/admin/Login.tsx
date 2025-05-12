import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowRight, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        toast({
          title: language === 'ar' ? "غير مصرح" : "Unauthorized",
          description: language === 'ar' 
            ? "ليس لديك صلاحيات المسؤول" 
            : "You don't have admin privileges",
          variant: "destructive",
        });
      }
    }
  }, [isAuthenticated, isAdmin, navigate, toast, language]);

  // Handle login with Replit
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-primary">
            {t('admin.login.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">
            {language === 'ar' 
              ? "سجل الدخول باستخدام حساب Replit للوصول إلى لوحة التحكم"
              : "Sign in with your Replit account to access the admin dashboard"}
          </p>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 py-6"
            disabled={isLoading}
          >
            <LogIn className="h-5 w-5" />
            {language === 'ar' ? "تسجيل الدخول باستخدام Replit" : "Sign in with Replit"}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-sm text-gray-500">
          {language === 'ar' 
            ? "بعد تسجيل الدخول، اطلب من المسؤول منحك صلاحيات الإدارة" 
            : "After logging in, ask the administrator to grant you admin privileges"
          }
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
