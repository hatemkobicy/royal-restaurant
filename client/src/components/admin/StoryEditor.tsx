import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/components/LanguageSelector';
import { 
  getStoryData, 
  saveStoryImage, 
  saveSinceYear, 
  saveStoryTitle, 
  saveStoryParagraph1, 
  saveStoryParagraph2,
  resetStoryData,
  type StoryData
} from '@/utils/story';

const StoryEditor = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [storyData, setStoryData] = useState<StoryData>(getStoryData());
  
  // Form state
  const [imageUrl, setImageUrl] = useState(storyData.imageUrl);
  const [sinceYear, setSinceYear] = useState(storyData.sinceYear);
  const [titleAr, setTitleAr] = useState(storyData.title.ar);
  const [titleTr, setTitleTr] = useState(storyData.title.tr);
  const [p1Ar, setP1Ar] = useState(storyData.paragraph1.ar);
  const [p1Tr, setP1Tr] = useState(storyData.paragraph1.tr);
  const [p2Ar, setP2Ar] = useState(storyData.paragraph2.ar);
  const [p2Tr, setP2Tr] = useState(storyData.paragraph2.tr);
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    const handleStoryUpdated = () => {
      const newData = getStoryData();
      setStoryData(newData);
      setImageUrl(newData.imageUrl);
      setSinceYear(newData.sinceYear);
      setTitleAr(newData.title.ar);
      setTitleTr(newData.title.tr);
      setP1Ar(newData.paragraph1.ar);
      setP1Tr(newData.paragraph1.tr);
      setP2Ar(newData.paragraph2.ar);
      setP2Tr(newData.paragraph2.tr);
    };
    
    document.addEventListener('storyUpdated', handleStoryUpdated);
    window.addEventListener('storage', handleStoryUpdated);
    
    return () => {
      document.removeEventListener('storyUpdated', handleStoryUpdated);
      window.removeEventListener('storage', handleStoryUpdated);
    };
  }, []);
  
  const handleSave = () => {
    try {
      saveStoryImage(imageUrl);
      saveSinceYear(sinceYear);
      saveStoryTitle('ar', titleAr);
      saveStoryTitle('tr', titleTr);
      saveStoryParagraph1('ar', p1Ar);
      saveStoryParagraph1('tr', p1Tr);
      saveStoryParagraph2('ar', p2Ar);
      saveStoryParagraph2('tr', p2Tr);
      
      toast({
        title: t('admin.story.success.save'),
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: t('admin.story.error'),
        description: String(error),
        variant: 'destructive',
      });
    }
  };
  
  const handleReset = () => {
    if (window.confirm(t('admin.confirm.reset'))) {
      resetStoryData();
      
      toast({
        title: t('admin.story.success.reset'),
        variant: 'default',
      });
    }
  };
  
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold">{t('admin.story.title')}</h3>
          <p className="text-muted-foreground">{t('admin.story.description')}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={togglePreview}
          >
            {showPreview ? t('admin.edit') : t('admin.story.preview')}
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleReset}
          >
            {t('admin.story.reset')}
          </Button>
          
          <Button 
            onClick={handleSave}
          >
            {t('admin.story.save')}
          </Button>
        </div>
      </div>
      
      {showPreview ? (
        <PreviewStory storyData={{
          imageUrl,
          sinceYear,
          title: { ar: titleAr, tr: titleTr },
          paragraph1: { ar: p1Ar, tr: p1Tr },
          paragraph2: { ar: p2Ar, tr: p2Tr }
        }} />
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="story-image">{t('admin.story.image')}</Label>
                    <p className="text-sm text-muted-foreground mb-2">{t('admin.story.image.description')}</p>
                    <Input
                      id="story-image"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  {imageUrl && (
                    <div className="relative overflow-hidden rounded-md border border-input h-48">
                      <img 
                        src={imageUrl} 
                        alt={language === 'ar' ? titleAr : titleTr} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="since-year">{t('admin.story.since')}</Label>
                  <p className="text-sm text-muted-foreground mb-2">{t('admin.story.since.description')}</p>
                  <Input
                    id="since-year"
                    value={sinceYear}
                    onChange={(e) => setSinceYear(e.target.value)}
                    placeholder="1995"
                    maxLength={4}
                    className="mb-6"
                  />
                  
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md relative overflow-hidden mb-3">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover opacity-30"
                      />
                    </div>
                    <div className="relative flex items-center justify-center h-28">
                      <div className="w-24 h-24 bg-primary flex items-center justify-center rounded-lg shadow-lg">
                        <p className="text-white font-bold text-lg">Since {sinceYear}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="ar" className="w-full">
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
                  <TabsTrigger value="ar">العربية</TabsTrigger>
                  <TabsTrigger value="tr">Türkçe</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ar" className="space-y-6">
                  <div>
                    <Label htmlFor="title-ar">{t('admin.story.title.ar')}</Label>
                    <Input
                      id="title-ar"
                      dir="rtl"
                      value={titleAr}
                      onChange={(e) => setTitleAr(e.target.value)}
                      placeholder="قصتنا"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="p1-ar">{t('admin.story.p1.ar')}</Label>
                    <Textarea
                      id="p1-ar"
                      dir="rtl"
                      value={p1Ar}
                      onChange={(e) => setP1Ar(e.target.value)}
                      placeholder="الفقرة الأولى من قصتنا..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="p2-ar">{t('admin.story.p2.ar')}</Label>
                    <Textarea
                      id="p2-ar"
                      dir="rtl"
                      value={p2Ar}
                      onChange={(e) => setP2Ar(e.target.value)}
                      placeholder="الفقرة الثانية من قصتنا..."
                      rows={4}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="tr" className="space-y-6">
                  <div>
                    <Label htmlFor="title-tr">{t('admin.story.title.tr')}</Label>
                    <Input
                      id="title-tr"
                      value={titleTr}
                      onChange={(e) => setTitleTr(e.target.value)}
                      placeholder="Hikayemiz"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="p1-tr">{t('admin.story.p1.tr')}</Label>
                    <Textarea
                      id="p1-tr"
                      value={p1Tr}
                      onChange={(e) => setP1Tr(e.target.value)}
                      placeholder="Hikayemizin birinci paragrafı..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="p2-tr">{t('admin.story.p2.tr')}</Label>
                    <Textarea
                      id="p2-tr"
                      value={p2Tr}
                      onChange={(e) => setP2Tr(e.target.value)}
                      placeholder="Hikayemizin ikinci paragrafı..."
                      rows={4}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Preview component
const PreviewStory = ({ storyData }: { storyData: StoryData }) => {
  const { language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';
  const isArabic = language === 'ar';
  
  const title = isArabic ? storyData.title.ar : storyData.title.tr;
  const p1 = isArabic ? storyData.paragraph1.ar : storyData.paragraph1.tr;
  const p2 = isArabic ? storyData.paragraph2.ar : storyData.paragraph2.tr;
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="relative">
            <img 
              src={storyData.imageUrl} 
              alt={title} 
              className="w-full h-64 md:h-full object-cover"
            />
            <div className="absolute -bottom-5 right-5 md:-right-5 w-24 h-24 md:w-32 md:h-32 bg-primary rounded-lg flex items-center justify-center">
              <p className="text-white font-bold text-lg md:text-xl">Since {storyData.sinceYear}</p>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-secondary dark:text-secondary mb-3 md:mb-4">{title}</h3>
            <div className="w-16 h-1 bg-primary dark:bg-primary mb-4 md:mb-6"></div>
            <p className={`mb-4 md:mb-6 ${isRtl ? 'text-right' : ''}`}>{p1}</p>
            <p className={`${isRtl ? 'text-right' : ''}`}>{p2}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoryEditor;