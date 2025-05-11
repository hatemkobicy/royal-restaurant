import React, { useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/LanguageSelector';
import SocialMediaInput from '@/components/admin/SocialMediaInput';

const AdminSettings = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  
  // Placeholder function to clear cache
  const handleClearCache = () => {
    toast({
      title: language === 'ar' ? 'تم مسح ذاكرة التخزين المؤقت' : 'Cache cleared',
      description: language === 'ar' 
        ? 'تم مسح ذاكرة التخزين المؤقت بنجاح' 
        : 'Cache has been successfully cleared',
    });
  };

  // Placeholder function to rebuild the website
  const handleRebuild = () => {
    toast({
      title: language === 'ar' ? 'تم إعادة بناء الموقع' : 'Website rebuilt',
      description: language === 'ar' 
        ? 'تم إعادة بناء الموقع بنجاح' 
        : 'Website has been successfully rebuilt',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </h2>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'إدارة إعدادات الموقع والنظام' 
              : 'Manage website and system settings'}
          </p>
        </div>

        <div className="grid gap-6">
          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إعدادات النظام' : 'System Settings'}</CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'إدارة ذاكرة التخزين المؤقت وأداء الموقع' 
                  : 'Manage cache and website performance'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === 'ar' ? 'ذاكرة التخزين المؤقت' : 'Cache'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'ar' 
                        ? 'مسح ذاكرة التخزين المؤقت لتحديث بيانات الموقع' 
                        : 'Clear cache to refresh website data'}
                    </p>
                    <Button onClick={handleClearCache}>
                      {language === 'ar' ? 'مسح ذاكرة التخزين المؤقت' : 'Clear Cache'}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === 'ar' ? 'إعادة البناء' : 'Rebuild'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'ar' 
                        ? 'إعادة بناء الموقع لتطبيق التغييرات الكبيرة' 
                        : 'Rebuild the website to apply major changes'}
                    </p>
                    <Button variant="destructive" onClick={handleRebuild}>
                      {language === 'ar' ? 'إعادة بناء الموقع' : 'Rebuild Website'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Website Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{language === 'ar' ? 'إعدادات الموقع' : 'Website Settings'}</CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'تعديل إعدادات وخصائص الموقع' 
                  : 'Modify website settings and properties'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dark Mode Toggle */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'ar' ? 'الوضع المظلم' : 'Dark Mode'}
                </h3>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Button 
                    onClick={() => {
                      // Toggle dark mode
                      const isDark = document.documentElement.classList.contains('dark');
                      if (isDark) {
                        document.documentElement.classList.remove('dark');
                        localStorage.setItem('theme', 'light');
                      } else {
                        document.documentElement.classList.add('dark');
                        localStorage.setItem('theme', 'dark');
                      }

                      toast({
                        title: isDark 
                          ? (language === 'ar' ? 'تم تفعيل الوضع الفاتح' : 'Light Mode Activated') 
                          : (language === 'ar' ? 'تم تفعيل الوضع المظلم' : 'Dark Mode Activated'),
                        description: isDark
                          ? (language === 'ar' ? 'تم تغيير مظهر الموقع إلى الوضع الفاتح' : 'Website appearance changed to light mode') 
                          : (language === 'ar' ? 'تم تغيير مظهر الموقع إلى الوضع المظلم' : 'Website appearance changed to dark mode'),
                      });
                    }}
                    variant="outline"
                  >
                    {language === 'ar' ? 'تبديل الوضع المظلم' : 'Toggle Dark Mode'}
                  </Button>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'ar' ? 'روابط مواقع التواصل الاجتماعي' : 'Social Media Links'}
                </h3>
                <div className="space-y-4">
                  <SocialMediaInput 
                    name="Instagram"
                    defaultValue="https://instagram.com/royalrestaurant"
                    label={language === 'ar' ? 'إنستغرام' : 'Instagram'}
                    onSave={(value) => {
                      // Save to localStorage for development
                      const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
                      settings.social_instagram = value;
                      localStorage.setItem('siteSettings', JSON.stringify(settings));
                      
                      toast({
                        title: language === 'ar' ? 'تم التحديث' : 'Updated',
                        description: language === 'ar' ? 'تم تحديث رابط إنستغرام' : 'Instagram link updated'
                      });
                    }}
                  />
                  
                  <SocialMediaInput 
                    name="Facebook"
                    defaultValue="https://facebook.com/royalrestaurant"
                    label={language === 'ar' ? 'فيسبوك' : 'Facebook'}
                    onSave={(value) => {
                      // Save to localStorage for development
                      const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
                      settings.social_facebook = value;
                      localStorage.setItem('siteSettings', JSON.stringify(settings));
                      
                      toast({
                        title: language === 'ar' ? 'تم التحديث' : 'Updated',
                        description: language === 'ar' ? 'تم تحديث رابط فيسبوك' : 'Facebook link updated'
                      });
                    }}
                  />
                  
                  <SocialMediaInput 
                    name="YouTube"
                    defaultValue="https://youtube.com/royalrestaurant"
                    label={language === 'ar' ? 'يوتيوب' : 'YouTube'}
                    onSave={(value) => {
                      // Save to localStorage for development
                      const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
                      settings.social_youtube = value;
                      localStorage.setItem('siteSettings', JSON.stringify(settings));
                      
                      toast({
                        title: language === 'ar' ? 'تم التحديث' : 'Updated',
                        description: language === 'ar' ? 'تم تحديث رابط يوتيوب' : 'YouTube link updated'
                      });
                    }}
                  />
                  
                  <SocialMediaInput 
                    name="Twitter"
                    defaultValue="https://twitter.com/royalrestaurant"
                    label={language === 'ar' ? 'تويتر' : 'Twitter'}
                    onSave={(value) => {
                      // Save to localStorage for development
                      const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
                      settings.social_twitter = value;
                      localStorage.setItem('siteSettings', JSON.stringify(settings));
                      
                      toast({
                        title: language === 'ar' ? 'تم التحديث' : 'Updated',
                        description: language === 'ar' ? 'تم تحديث رابط تويتر' : 'Twitter link updated'
                      });
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;