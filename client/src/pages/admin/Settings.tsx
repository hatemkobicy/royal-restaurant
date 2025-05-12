import React, { useEffect, useState } from 'react';
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
import { useTranslation } from '@/hooks/useTranslation';
import SocialMediaInput from '@/components/admin/SocialMediaInput';
import WorkingHoursInput from '@/components/admin/WorkingHoursInput';
import ThemeToggle from '@/components/ThemeToggle';
import { SOCIAL_MEDIA, saveSocialLink } from '@/utils/social';
import { WORKING_HOURS, getWorkingHours, saveWorkingHours } from '@/utils/workingHours';
import LogoUploader from '@/components/admin/LogoUploader';
import CarouselEditor from '@/components/admin/CarouselEditor';
import StoryEditor from '@/components/admin/StoryEditor';

const AdminSettings = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [hours, setHours] = useState(getWorkingHours());
  
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
              {/* Restaurant Logo */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">
                  {t('admin.logo.title')}
                </h3>
                <div className="border rounded-lg p-4 bg-background dark:bg-background/80">
                  <LogoUploader />
                </div>
              </div>
              
              {/* Dark Mode Toggle */}
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'ar' ? 'الوضع المظلم' : 'Dark Mode'}
                </h3>
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <ThemeToggle 
                    variant="default" 
                    size="default" 
                    showText={true} 
                  />
                  <p className="text-sm text-muted-foreground ml-2">
                    {language === 'ar' 
                      ? 'يمكنك تبديل مظهر الموقع بين الوضع الفاتح والمظلم' 
                      : 'Toggle between light and dark mode for the website appearance'}
                  </p>
                </div>
              </div>

              {/* Working Hours Section */}
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">
                  {t('admin.hours.title')}
                </h3>
                <div className="space-y-6 border rounded-lg p-4 bg-background dark:bg-background/80">
                  <p className="text-sm text-muted-foreground">
                    {t('admin.hours.description')}
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <WorkingHoursInput
                      name="weekdays"
                      label={t('admin.hours.weekdays')}
                      defaultValue={hours.weekdays}
                      onSave={(value) => {
                        saveWorkingHours(WORKING_HOURS.KEYS.WEEKDAYS, value);
                        setHours({...hours, weekdays: value});
                        toast({
                          title: t('admin.form.update'),
                          description: t('admin.hours.updated.weekdays')
                        });
                      }}
                    />
                    
                    <WorkingHoursInput
                      name="weekend"
                      label={t('admin.hours.weekend')}
                      defaultValue={hours.weekend}
                      onSave={(value) => {
                        saveWorkingHours(WORKING_HOURS.KEYS.WEEKEND, value);
                        setHours({...hours, weekend: value});
                        toast({
                          title: t('admin.form.update'),
                          description: t('admin.hours.updated.weekend')
                        });
                      }}
                    />
                    
                    <WorkingHoursInput
                      name="sunday"
                      label={t('admin.hours.sunday')}
                      defaultValue={hours.sunday}
                      onSave={(value) => {
                        saveWorkingHours(WORKING_HOURS.KEYS.SUNDAY, value);
                        setHours({...hours, sunday: value});
                        toast({
                          title: t('admin.form.update'),
                          description: t('admin.hours.updated.sunday')
                        });
                      }}
                    />
                  </div>
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
                    defaultValue={SOCIAL_MEDIA.DEFAULT.INSTAGRAM}
                    label={language === 'ar' ? 'إنستغرام' : 'Instagram'}
                    onSave={(value) => {
                      saveSocialLink(SOCIAL_MEDIA.KEYS.INSTAGRAM, value);
                      toast({
                        title: language === 'ar' ? 'تم التحديث' : 'Updated',
                        description: language === 'ar' ? 'تم تحديث رابط إنستغرام' : 'Instagram link updated'
                      });
                    }}
                  />
                  
                  <SocialMediaInput 
                    name="Facebook"
                    defaultValue={SOCIAL_MEDIA.DEFAULT.FACEBOOK}
                    label={language === 'ar' ? 'فيسبوك' : 'Facebook'}
                    onSave={(value) => {
                      saveSocialLink(SOCIAL_MEDIA.KEYS.FACEBOOK, value);
                      toast({
                        title: language === 'ar' ? 'تم التحديث' : 'Updated',
                        description: language === 'ar' ? 'تم تحديث رابط فيسبوك' : 'Facebook link updated'
                      });
                    }}
                  />
                  
                  <SocialMediaInput 
                    name="YouTube"
                    defaultValue={SOCIAL_MEDIA.DEFAULT.YOUTUBE}
                    label={language === 'ar' ? 'يوتيوب' : 'YouTube'}
                    onSave={(value) => {
                      saveSocialLink(SOCIAL_MEDIA.KEYS.YOUTUBE, value);
                      toast({
                        title: language === 'ar' ? 'تم التحديث' : 'Updated',
                        description: language === 'ar' ? 'تم تحديث رابط يوتيوب' : 'YouTube link updated'
                      });
                    }}
                  />
                  
                  <SocialMediaInput 
                    name="Twitter"
                    defaultValue={SOCIAL_MEDIA.DEFAULT.TWITTER}
                    label={language === 'ar' ? 'تويتر' : 'Twitter'}
                    onSave={(value) => {
                      saveSocialLink(SOCIAL_MEDIA.KEYS.TWITTER, value);
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
          
          {/* Carousel Editor Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                {language === 'ar' ? 'إعدادات عرض الشرائح' : 'Carousel Settings'}
              </CardTitle>
              <CardDescription>
                {language === 'ar' 
                  ? 'تخصيص شرائح الصفحة الرئيسية وتعديل محتواها' 
                  : 'Customize the homepage carousel slides and their content'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CarouselEditor />
            </CardContent>
          </Card>
          
          {/* Story Editor Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                {t('admin.story.title')}
              </CardTitle>
              <CardDescription>
                {t('admin.story.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StoryEditor />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;