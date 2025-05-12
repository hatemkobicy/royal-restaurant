import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { 
  getSeasonalIngredients, 
  addSeasonalIngredient, 
  updateSeasonalIngredient, 
  deleteSeasonalIngredient, 
  toggleIngredientActive, 
  type SeasonalIngredient 
} from '@/utils/seasonalIngredients';

const SeasonalIngredientsManager = () => {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [ingredients, setIngredients] = useState<SeasonalIngredient[]>(getSeasonalIngredients());
  
  const [editingIngredient, setEditingIngredient] = useState<SeasonalIngredient | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [nameAr, setNameAr] = useState('');
  const [nameTr, setNameTr] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionTr, setDescriptionTr] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [season, setSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring');
  
  useEffect(() => {
    // Update ingredients list when component mounts or ingredients change
    setIngredients(getSeasonalIngredients());
    
    // Listen for storage events
    const handleStorageChange = () => {
      setIngredients(getSeasonalIngredients());
    };
    
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('ingredientsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('ingredientsUpdated', handleStorageChange);
    };
  }, []);
  
  const resetForm = () => {
    setNameAr('');
    setNameTr('');
    setDescriptionAr('');
    setDescriptionTr('');
    setImageUrl('');
    setSeason('spring');
    setEditingIngredient(null);
    setIsAdding(false);
  };
  
  const handleEdit = (ingredient: SeasonalIngredient) => {
    setEditingIngredient(ingredient);
    setNameAr(ingredient.nameAr);
    setNameTr(ingredient.nameTr);
    setDescriptionAr(ingredient.descriptionAr);
    setDescriptionTr(ingredient.descriptionTr);
    setImageUrl(ingredient.imageUrl);
    setSeason(ingredient.season);
    setIsAdding(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm(t('admin.confirm.delete'))) {
      if (deleteSeasonalIngredient(id)) {
        setIngredients(getSeasonalIngredients());
        toast({
          title: t('admin.seasonal.success.delete'),
          variant: 'default',
        });
      }
    }
  };
  
  const handleToggleActive = (id: string) => {
    const isActive = toggleIngredientActive(id);
    setIngredients(getSeasonalIngredients());
    toast({
      title: isActive ? t('admin.seasonal.active') : t('admin.seasonal.inactive'),
      description: isActive 
        ? language === 'ar' ? 'تم تنشيط المكون بنجاح' : 'Malzeme başarıyla aktifleştirildi'
        : language === 'ar' ? 'تم إلغاء تنشيط المكون بنجاح' : 'Malzeme başarıyla deaktifleştirildi',
      variant: 'default',
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nameAr || !nameTr || !descriptionAr || !descriptionTr || !imageUrl) {
      toast({
        title: language === 'ar' ? 'خطأ في النموذج' : 'Form Hatası',
        description: language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Lütfen tüm gerekli alanları doldurun',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (editingIngredient) {
        // Update existing ingredient
        updateSeasonalIngredient(editingIngredient.id, {
          nameAr,
          nameTr,
          descriptionAr,
          descriptionTr,
          imageUrl,
          season,
        });
        
        toast({
          title: t('admin.seasonal.success.update'),
          variant: 'default',
        });
      } else {
        // Add new ingredient
        addSeasonalIngredient({
          nameAr,
          nameTr,
          descriptionAr,
          descriptionTr,
          imageUrl,
          season,
          isActive: true,
        });
        
        toast({
          title: t('admin.seasonal.success.add'),
          variant: 'default',
        });
      }
      
      setIngredients(getSeasonalIngredients());
      resetForm();
    } catch (error) {
      toast({
        title: t('admin.seasonal.error'),
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.seasonal.title')}</h2>
          <p className="text-muted-foreground">{t('admin.seasonal.description')}</p>
        </div>
        
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          variant={isAdding ? "outline" : "default"}
        >
          {isAdding ? t('admin.seasonal.cancel') : t('admin.seasonal.add')}
        </Button>
      </div>
      
      {isAdding && (
        <Card className="border border-primary/20">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameAr">{language === 'ar' ? 'الاسم بالعربية' : 'Arapça İsim'}</Label>
                  <Input
                    id="nameAr"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل الاسم بالعربية' : 'Arapça isim girin'}
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="nameTr">{language === 'ar' ? 'الاسم بالتركية' : 'Türkçe İsim'}</Label>
                  <Input
                    id="nameTr"
                    value={nameTr}
                    onChange={(e) => setNameTr(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل الاسم بالتركية' : 'Türkçe isim girin'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descriptionAr">{language === 'ar' ? 'الوصف بالعربية' : 'Arapça Açıklama'}</Label>
                  <Textarea
                    id="descriptionAr"
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل الوصف بالعربية' : 'Arapça açıklama girin'}
                    rows={3}
                    dir="rtl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="descriptionTr">{language === 'ar' ? 'الوصف بالتركية' : 'Türkçe Açıklama'}</Label>
                  <Textarea
                    id="descriptionTr"
                    value={descriptionTr}
                    onChange={(e) => setDescriptionTr(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل الوصف بالتركية' : 'Türkçe açıklama girin'}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">{t('admin.seasonal.image')}</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل رابط الصورة' : 'Görsel URL girin'}
                  />
                  {imageUrl && (
                    <div className="mt-2 overflow-hidden rounded-md border border-input">
                      <img 
                        src={imageUrl} 
                        alt={language === 'ar' ? 'معاينة الصورة' : 'Görsel önizleme'} 
                        className="h-32 w-full object-cover" 
                      />
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="season">{t('admin.seasonal.season')}</Label>
                  <Select 
                    value={season} 
                    onValueChange={(value) => setSeason(value as 'spring' | 'summer' | 'autumn' | 'winter')}
                  >
                    <SelectTrigger id="season">
                      <SelectValue placeholder={language === 'ar' ? 'اختر الموسم' : 'Mevsim seçin'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring">{t('seasonal.spring')}</SelectItem>
                      <SelectItem value="summer">{t('seasonal.summer')}</SelectItem>
                      <SelectItem value="autumn">{t('seasonal.autumn')}</SelectItem>
                      <SelectItem value="winter">{t('seasonal.winter')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={resetForm}
                >
                  {t('admin.seasonal.cancel')}
                </Button>
                <Button type="submit" variant="default">
                  {t('admin.seasonal.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ingredients.map((ingredient) => (
          <Card key={ingredient.id} className={ingredient.isActive ? "border-primary/30" : "border-muted opacity-70"}>
            <div className="relative h-40 overflow-hidden rounded-t-lg">
              <img 
                src={ingredient.imageUrl} 
                alt={language === 'ar' ? ingredient.nameAr : ingredient.nameTr} 
                className="object-cover w-full h-full transition-transform hover:scale-105" 
              />
              <div className="absolute top-2 right-2 flex space-x-2 rtl:space-x-reverse">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 dark:bg-background/90"
                  onClick={() => handleEdit(ingredient)}
                >
                  <span className="sr-only">{t('admin.seasonal.edit')}</span>
                  <i className="bi bi-pencil text-sm"></i>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 dark:bg-background/90"
                  onClick={() => handleDelete(ingredient.id)}
                >
                  <span className="sr-only">{t('admin.seasonal.delete')}</span>
                  <i className="bi bi-trash text-sm"></i>
                </Button>
              </div>
              <div className="absolute bottom-2 left-2 rounded-full px-2 py-1 text-xs font-medium text-foreground bg-white/90 dark:bg-background/90">
                {t(`seasonal.${ingredient.season}`)}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold truncate">
                  {language === 'ar' ? ingredient.nameAr : ingredient.nameTr}
                </h3>
                <div className="flex items-center">
                  <Switch 
                    id={`active-${ingredient.id}`}
                    checked={ingredient.isActive}
                    onCheckedChange={() => handleToggleActive(ingredient.id)}
                  />
                  <Label 
                    htmlFor={`active-${ingredient.id}`}
                    className="ml-2 rtl:mr-2 rtl:ml-0 text-sm"
                  >
                    {ingredient.isActive ? t('admin.seasonal.active') : t('admin.seasonal.inactive')}
                  </Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {language === 'ar' ? ingredient.descriptionAr : ingredient.descriptionTr}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SeasonalIngredientsManager;