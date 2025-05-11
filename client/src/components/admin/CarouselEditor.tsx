import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/components/LanguageSelector';
import { 
  CAROUSEL_KEYS, 
  DEFAULT_CAROUSEL_DATA,
  saveCarouselSetting
} from '@/utils/carousel';
import { restaurantImages } from '@/lib/utils';

interface LocalizedInput {
  tr: string;
  ar: string;
}

interface CarouselSlideState {
  title: LocalizedInput;
  subtitle: LocalizedInput;
  ctaText: LocalizedInput;
  ctaLink: string;
  imageUrl: string;
}

const CarouselEditor: React.FC = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  
  const [slide1, setSlide1] = useState<CarouselSlideState>({
    title: { tr: DEFAULT_CAROUSEL_DATA.tr[0].title, ar: DEFAULT_CAROUSEL_DATA.ar[0].title },
    subtitle: { tr: DEFAULT_CAROUSEL_DATA.tr[0].subtitle, ar: DEFAULT_CAROUSEL_DATA.ar[0].subtitle },
    ctaText: { tr: DEFAULT_CAROUSEL_DATA.tr[0].ctaText, ar: DEFAULT_CAROUSEL_DATA.ar[0].ctaText },
    ctaLink: DEFAULT_CAROUSEL_DATA.tr[0].ctaLink,
    imageUrl: DEFAULT_CAROUSEL_DATA.tr[0].imageUrl
  });
  
  const [slide2, setSlide2] = useState<CarouselSlideState>({
    title: { tr: DEFAULT_CAROUSEL_DATA.tr[1].title, ar: DEFAULT_CAROUSEL_DATA.ar[1].title },
    subtitle: { tr: DEFAULT_CAROUSEL_DATA.tr[1].subtitle, ar: DEFAULT_CAROUSEL_DATA.ar[1].subtitle },
    ctaText: { tr: DEFAULT_CAROUSEL_DATA.tr[1].ctaText, ar: DEFAULT_CAROUSEL_DATA.ar[1].ctaText },
    ctaLink: DEFAULT_CAROUSEL_DATA.tr[1].ctaLink,
    imageUrl: DEFAULT_CAROUSEL_DATA.tr[1].imageUrl
  });
  
  const [slide3, setSlide3] = useState<CarouselSlideState>({
    title: { tr: DEFAULT_CAROUSEL_DATA.tr[2].title, ar: DEFAULT_CAROUSEL_DATA.ar[2].title },
    subtitle: { tr: DEFAULT_CAROUSEL_DATA.tr[2].subtitle, ar: DEFAULT_CAROUSEL_DATA.ar[2].subtitle },
    ctaText: { tr: DEFAULT_CAROUSEL_DATA.tr[2].ctaText, ar: DEFAULT_CAROUSEL_DATA.ar[2].ctaText },
    ctaLink: DEFAULT_CAROUSEL_DATA.tr[2].ctaLink,
    imageUrl: DEFAULT_CAROUSEL_DATA.tr[2].imageUrl
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
      
      // Load Slide 1
      if (settings[CAROUSEL_KEYS.SLIDE_1_TITLE]) {
        setSlide1(prev => ({
          ...prev,
          title: settings[CAROUSEL_KEYS.SLIDE_1_TITLE] || prev.title
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_1_SUBTITLE]) {
        setSlide1(prev => ({
          ...prev,
          subtitle: settings[CAROUSEL_KEYS.SLIDE_1_SUBTITLE] || prev.subtitle
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_1_CTA_TEXT]) {
        setSlide1(prev => ({
          ...prev,
          ctaText: settings[CAROUSEL_KEYS.SLIDE_1_CTA_TEXT] || prev.ctaText
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_1_CTA_LINK]) {
        setSlide1(prev => ({
          ...prev,
          ctaLink: settings[CAROUSEL_KEYS.SLIDE_1_CTA_LINK] || prev.ctaLink
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_1_IMAGE]) {
        setSlide1(prev => ({
          ...prev,
          imageUrl: settings[CAROUSEL_KEYS.SLIDE_1_IMAGE] || prev.imageUrl
        }));
      }
      
      // Load Slide 2
      if (settings[CAROUSEL_KEYS.SLIDE_2_TITLE]) {
        setSlide2(prev => ({
          ...prev,
          title: settings[CAROUSEL_KEYS.SLIDE_2_TITLE] || prev.title
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_2_SUBTITLE]) {
        setSlide2(prev => ({
          ...prev,
          subtitle: settings[CAROUSEL_KEYS.SLIDE_2_SUBTITLE] || prev.subtitle
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_2_CTA_TEXT]) {
        setSlide2(prev => ({
          ...prev,
          ctaText: settings[CAROUSEL_KEYS.SLIDE_2_CTA_TEXT] || prev.ctaText
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_2_CTA_LINK]) {
        setSlide2(prev => ({
          ...prev,
          ctaLink: settings[CAROUSEL_KEYS.SLIDE_2_CTA_LINK] || prev.ctaLink
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_2_IMAGE]) {
        setSlide2(prev => ({
          ...prev,
          imageUrl: settings[CAROUSEL_KEYS.SLIDE_2_IMAGE] || prev.imageUrl
        }));
      }
      
      // Load Slide 3
      if (settings[CAROUSEL_KEYS.SLIDE_3_TITLE]) {
        setSlide3(prev => ({
          ...prev,
          title: settings[CAROUSEL_KEYS.SLIDE_3_TITLE] || prev.title
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_3_SUBTITLE]) {
        setSlide3(prev => ({
          ...prev,
          subtitle: settings[CAROUSEL_KEYS.SLIDE_3_SUBTITLE] || prev.subtitle
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_3_CTA_TEXT]) {
        setSlide3(prev => ({
          ...prev,
          ctaText: settings[CAROUSEL_KEYS.SLIDE_3_CTA_TEXT] || prev.ctaText
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_3_CTA_LINK]) {
        setSlide3(prev => ({
          ...prev,
          ctaLink: settings[CAROUSEL_KEYS.SLIDE_3_CTA_LINK] || prev.ctaLink
        }));
      }
      if (settings[CAROUSEL_KEYS.SLIDE_3_IMAGE]) {
        setSlide3(prev => ({
          ...prev,
          imageUrl: settings[CAROUSEL_KEYS.SLIDE_3_IMAGE] || prev.imageUrl
        }));
      }
    } catch (error) {
      console.error('Error loading carousel settings:', error);
    }
  }, []);

  const handleSaveSlide = (slideNumber: number) => {
    const slide = slideNumber === 1 ? slide1 : (slideNumber === 2 ? slide2 : slide3);
    const prefix = `SLIDE_${slideNumber}`;
    
    // Save all fields
    saveCarouselSetting(CAROUSEL_KEYS[`${prefix}_TITLE` as keyof typeof CAROUSEL_KEYS], slide.title);
    saveCarouselSetting(CAROUSEL_KEYS[`${prefix}_SUBTITLE` as keyof typeof CAROUSEL_KEYS], slide.subtitle);
    saveCarouselSetting(CAROUSEL_KEYS[`${prefix}_CTA_TEXT` as keyof typeof CAROUSEL_KEYS], slide.ctaText);
    saveCarouselSetting(CAROUSEL_KEYS[`${prefix}_CTA_LINK` as keyof typeof CAROUSEL_KEYS], slide.ctaLink);
    saveCarouselSetting(CAROUSEL_KEYS[`${prefix}_IMAGE` as keyof typeof CAROUSEL_KEYS], slide.imageUrl);
    
    toast({
      title: language === 'ar' ? 'تم الحفظ' : 'Saved',
      description: language === 'ar' 
        ? `تم حفظ إعدادات الشريحة ${slideNumber} بنجاح` 
        : `Slide ${slideNumber} settings saved successfully`
    });
  };

  const handleResetSlide = (slideNumber: number) => {
    if (slideNumber === 1) {
      setSlide1({
        title: { tr: DEFAULT_CAROUSEL_DATA.tr[0].title, ar: DEFAULT_CAROUSEL_DATA.ar[0].title },
        subtitle: { tr: DEFAULT_CAROUSEL_DATA.tr[0].subtitle, ar: DEFAULT_CAROUSEL_DATA.ar[0].subtitle },
        ctaText: { tr: DEFAULT_CAROUSEL_DATA.tr[0].ctaText, ar: DEFAULT_CAROUSEL_DATA.ar[0].ctaText },
        ctaLink: DEFAULT_CAROUSEL_DATA.tr[0].ctaLink,
        imageUrl: DEFAULT_CAROUSEL_DATA.tr[0].imageUrl
      });
    } else if (slideNumber === 2) {
      setSlide2({
        title: { tr: DEFAULT_CAROUSEL_DATA.tr[1].title, ar: DEFAULT_CAROUSEL_DATA.ar[1].title },
        subtitle: { tr: DEFAULT_CAROUSEL_DATA.tr[1].subtitle, ar: DEFAULT_CAROUSEL_DATA.ar[1].subtitle },
        ctaText: { tr: DEFAULT_CAROUSEL_DATA.tr[1].ctaText, ar: DEFAULT_CAROUSEL_DATA.ar[1].ctaText },
        ctaLink: DEFAULT_CAROUSEL_DATA.tr[1].ctaLink,
        imageUrl: DEFAULT_CAROUSEL_DATA.tr[1].imageUrl
      });
    } else {
      setSlide3({
        title: { tr: DEFAULT_CAROUSEL_DATA.tr[2].title, ar: DEFAULT_CAROUSEL_DATA.ar[2].title },
        subtitle: { tr: DEFAULT_CAROUSEL_DATA.tr[2].subtitle, ar: DEFAULT_CAROUSEL_DATA.ar[2].subtitle },
        ctaText: { tr: DEFAULT_CAROUSEL_DATA.tr[2].ctaText, ar: DEFAULT_CAROUSEL_DATA.ar[2].ctaText },
        ctaLink: DEFAULT_CAROUSEL_DATA.tr[2].ctaLink,
        imageUrl: DEFAULT_CAROUSEL_DATA.tr[2].imageUrl
      });
    }
    
    // Also remove from localStorage
    const prefix = `SLIDE_${slideNumber}`;
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    delete settings[CAROUSEL_KEYS[`${prefix}_TITLE` as keyof typeof CAROUSEL_KEYS]];
    delete settings[CAROUSEL_KEYS[`${prefix}_SUBTITLE` as keyof typeof CAROUSEL_KEYS]];
    delete settings[CAROUSEL_KEYS[`${prefix}_CTA_TEXT` as keyof typeof CAROUSEL_KEYS]];
    delete settings[CAROUSEL_KEYS[`${prefix}_CTA_LINK` as keyof typeof CAROUSEL_KEYS]];
    delete settings[CAROUSEL_KEYS[`${prefix}_IMAGE` as keyof typeof CAROUSEL_KEYS]];
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    toast({
      title: language === 'ar' ? 'تم إعادة الضبط' : 'Reset',
      description: language === 'ar' 
        ? `تم إعادة ضبط الشريحة ${slideNumber} إلى القيم الافتراضية` 
        : `Slide ${slideNumber} has been reset to default values`
    });
  };

  // Manage slide inputs
  const updateSlide = (
    slideNumber: number, 
    field: keyof CarouselSlideState, 
    value: string | LocalizedInput,
    lang?: 'tr' | 'ar'
  ) => {
    const updateFunction = slideNumber === 1 
      ? setSlide1 
      : (slideNumber === 2 ? setSlide2 : setSlide3);
    
    if (typeof value === 'string') {
      // For non-localized fields like ctaLink and imageUrl
      updateFunction(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (lang) {
      // For localized fields like title, subtitle, ctaText
      updateFunction(prev => ({
        ...prev,
        [field]: {
          ...prev[field as keyof Pick<CarouselSlideState, 'title' | 'subtitle' | 'ctaText'>],
          [lang]: value
        }
      }));
    }
  };

  return (
    <div className="carousel-editor">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">
          {language === 'ar' ? 'إعدادات عرض الشرائح' : 'Carousel Settings'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {language === 'ar' 
            ? 'قم بتخصيص شرائح الصفحة الرئيسية عن طريق تعديل العناوين والصور وأزرار الدعوة للعمل' 
            : 'Customize the homepage carousel slides by editing the titles, images, and call-to-action buttons'}
        </p>
      </div>
      
      <div className="flex mb-6 space-x-2">
        <Button 
          variant={currentSlide === 1 ? "default" : "outline"} 
          onClick={() => setCurrentSlide(1)}
          className="flex-1"
        >
          {language === 'ar' ? 'الشريحة ١' : 'Slide 1'}
        </Button>
        <Button 
          variant={currentSlide === 2 ? "default" : "outline"} 
          onClick={() => setCurrentSlide(2)}
          className="flex-1"
        >
          {language === 'ar' ? 'الشريحة ٢' : 'Slide 2'}
        </Button>
        <Button 
          variant={currentSlide === 3 ? "default" : "outline"} 
          onClick={() => setCurrentSlide(3)}
          className="flex-1"
        >
          {language === 'ar' ? 'الشريحة ٣' : 'Slide 3'}
        </Button>
      </div>
      
      {/* Slide 1 Settings */}
      {currentSlide === 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <img 
                src={slide1.imageUrl} 
                alt="Slide 1 Preview" 
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {restaurantImages.map((image, index) => (
                  <div 
                    key={image.id}
                    className={`relative cursor-pointer border-2 rounded overflow-hidden ${
                      slide1.imageUrl === image.url ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => updateSlide(1, 'imageUrl', image.url)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.alt} 
                      className="w-full h-16 object-cover"
                    />
                    {slide1.imageUrl === image.url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <i className="bi bi-check-circle-fill text-primary text-xl"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="tr">
              <TabsList className="mb-4">
                <TabsTrigger value="tr">Türkçe</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slide1-title-tr">Title</Label>
                  <Input
                    id="slide1-title-tr"
                    value={slide1.title.tr}
                    onChange={(e) => updateSlide(1, 'title', e.target.value, 'tr')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide1-subtitle-tr">Subtitle</Label>
                  <Input
                    id="slide1-subtitle-tr"
                    value={slide1.subtitle.tr}
                    onChange={(e) => updateSlide(1, 'subtitle', e.target.value, 'tr')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide1-cta-text-tr">Button Text</Label>
                  <Input
                    id="slide1-cta-text-tr"
                    value={slide1.ctaText.tr}
                    onChange={(e) => updateSlide(1, 'ctaText', e.target.value, 'tr')}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="ar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slide1-title-ar">العنوان</Label>
                  <Input
                    id="slide1-title-ar"
                    value={slide1.title.ar}
                    onChange={(e) => updateSlide(1, 'title', e.target.value, 'ar')}
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide1-subtitle-ar">العنوان الفرعي</Label>
                  <Input
                    id="slide1-subtitle-ar"
                    value={slide1.subtitle.ar}
                    onChange={(e) => updateSlide(1, 'subtitle', e.target.value, 'ar')}
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide1-cta-text-ar">نص الزر</Label>
                  <Input
                    id="slide1-cta-text-ar"
                    value={slide1.ctaText.ar}
                    onChange={(e) => updateSlide(1, 'ctaText', e.target.value, 'ar')}
                    className="text-right"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="slide1-cta-link">Button Link</Label>
              <Input
                id="slide1-cta-link"
                value={slide1.ctaLink}
                onChange={(e) => updateSlide(1, 'ctaLink', e.target.value)}
                placeholder="/menu"
              />
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={() => handleResetSlide(1)}
              >
                {language === 'ar' ? 'إعادة ضبط' : 'Reset'}
              </Button>
              <Button 
                onClick={() => handleSaveSlide(1)}
              >
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Slide 2 Settings */}
      {currentSlide === 2 && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <img 
                src={slide2.imageUrl} 
                alt="Slide 2 Preview" 
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {restaurantImages.map((image, index) => (
                  <div 
                    key={image.id}
                    className={`relative cursor-pointer border-2 rounded overflow-hidden ${
                      slide2.imageUrl === image.url ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => updateSlide(2, 'imageUrl', image.url)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.alt} 
                      className="w-full h-16 object-cover"
                    />
                    {slide2.imageUrl === image.url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <i className="bi bi-check-circle-fill text-primary text-xl"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="tr">
              <TabsList className="mb-4">
                <TabsTrigger value="tr">Türkçe</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slide2-title-tr">Title</Label>
                  <Input
                    id="slide2-title-tr"
                    value={slide2.title.tr}
                    onChange={(e) => updateSlide(2, 'title', e.target.value, 'tr')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide2-subtitle-tr">Subtitle</Label>
                  <Input
                    id="slide2-subtitle-tr"
                    value={slide2.subtitle.tr}
                    onChange={(e) => updateSlide(2, 'subtitle', e.target.value, 'tr')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide2-cta-text-tr">Button Text</Label>
                  <Input
                    id="slide2-cta-text-tr"
                    value={slide2.ctaText.tr}
                    onChange={(e) => updateSlide(2, 'ctaText', e.target.value, 'tr')}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="ar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slide2-title-ar">العنوان</Label>
                  <Input
                    id="slide2-title-ar"
                    value={slide2.title.ar}
                    onChange={(e) => updateSlide(2, 'title', e.target.value, 'ar')}
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide2-subtitle-ar">العنوان الفرعي</Label>
                  <Input
                    id="slide2-subtitle-ar"
                    value={slide2.subtitle.ar}
                    onChange={(e) => updateSlide(2, 'subtitle', e.target.value, 'ar')}
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide2-cta-text-ar">نص الزر</Label>
                  <Input
                    id="slide2-cta-text-ar"
                    value={slide2.ctaText.ar}
                    onChange={(e) => updateSlide(2, 'ctaText', e.target.value, 'ar')}
                    className="text-right"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="slide2-cta-link">Button Link</Label>
              <Input
                id="slide2-cta-link"
                value={slide2.ctaLink}
                onChange={(e) => updateSlide(2, 'ctaLink', e.target.value)}
                placeholder="/contact"
              />
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={() => handleResetSlide(2)}
              >
                {language === 'ar' ? 'إعادة ضبط' : 'Reset'}
              </Button>
              <Button 
                onClick={() => handleSaveSlide(2)}
              >
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Slide 3 Settings */}
      {currentSlide === 3 && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <img 
                src={slide3.imageUrl} 
                alt="Slide 3 Preview" 
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {restaurantImages.map((image, index) => (
                  <div 
                    key={image.id}
                    className={`relative cursor-pointer border-2 rounded overflow-hidden ${
                      slide3.imageUrl === image.url ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => updateSlide(3, 'imageUrl', image.url)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.alt} 
                      className="w-full h-16 object-cover"
                    />
                    {slide3.imageUrl === image.url && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <i className="bi bi-check-circle-fill text-primary text-xl"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Tabs defaultValue="tr">
              <TabsList className="mb-4">
                <TabsTrigger value="tr">Türkçe</TabsTrigger>
                <TabsTrigger value="ar">العربية</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tr" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slide3-title-tr">Title</Label>
                  <Input
                    id="slide3-title-tr"
                    value={slide3.title.tr}
                    onChange={(e) => updateSlide(3, 'title', e.target.value, 'tr')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide3-subtitle-tr">Subtitle</Label>
                  <Input
                    id="slide3-subtitle-tr"
                    value={slide3.subtitle.tr}
                    onChange={(e) => updateSlide(3, 'subtitle', e.target.value, 'tr')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide3-cta-text-tr">Button Text</Label>
                  <Input
                    id="slide3-cta-text-tr"
                    value={slide3.ctaText.tr}
                    onChange={(e) => updateSlide(3, 'ctaText', e.target.value, 'tr')}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="ar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="slide3-title-ar">العنوان</Label>
                  <Input
                    id="slide3-title-ar"
                    value={slide3.title.ar}
                    onChange={(e) => updateSlide(3, 'title', e.target.value, 'ar')}
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide3-subtitle-ar">العنوان الفرعي</Label>
                  <Input
                    id="slide3-subtitle-ar"
                    value={slide3.subtitle.ar}
                    onChange={(e) => updateSlide(3, 'subtitle', e.target.value, 'ar')}
                    className="text-right"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slide3-cta-text-ar">نص الزر</Label>
                  <Input
                    id="slide3-cta-text-ar"
                    value={slide3.ctaText.ar}
                    onChange={(e) => updateSlide(3, 'ctaText', e.target.value, 'ar')}
                    className="text-right"
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="slide3-cta-link">Button Link</Label>
              <Input
                id="slide3-cta-link"
                value={slide3.ctaLink}
                onChange={(e) => updateSlide(3, 'ctaLink', e.target.value)}
                placeholder="/menu"
              />
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={() => handleResetSlide(3)}
              >
                {language === 'ar' ? 'إعادة ضبط' : 'Reset'}
              </Button>
              <Button 
                onClick={() => handleSaveSlide(3)}
              >
                {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CarouselEditor;