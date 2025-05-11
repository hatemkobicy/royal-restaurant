import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Twitter, 
  Check, 
  X, 
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageSelector';

interface SocialMediaInputProps {
  name: string;
  label: string;
  defaultValue: string;
  onSave: (value: string) => void;
}

const SocialMediaInput: React.FC<SocialMediaInputProps> = ({
  name,
  label,
  defaultValue,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [savedValue, setSavedValue] = useState(defaultValue);
  const { language } = useLanguage();
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
      const key = `social_${name.toLowerCase()}`;
      if (settings[key]) {
        setValue(settings[key]);
        setSavedValue(settings[key]);
      }
    } catch (error) {
      console.error('Error loading social media settings:', error);
    }
  }, [name]);

  const getIcon = () => {
    switch (name.toLowerCase()) {
      case 'instagram':
        return <Instagram size={18} />;
      case 'facebook':
        return <Facebook size={18} />;
      case 'youtube':
        return <Youtube size={18} />;
      case 'twitter':
        return <Twitter size={18} />;
      default:
        return <ExternalLink size={18} />;
    }
  };

  const handleSave = () => {
    onSave(value);
    setSavedValue(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(savedValue);
    setIsEditing(false);
  };

  const iconClasses = "h-5 w-5";

  return (
    <div className="space-y-2">
      <Label htmlFor={`social-${name.toLowerCase()}`} className="flex items-center gap-2">
        {getIcon()} {label}
      </Label>
      
      <div className="flex gap-2">
        <Input
          id={`social-${name.toLowerCase()}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`https://${name.toLowerCase()}.com/youraccount`}
          disabled={!isEditing}
          className="flex-1"
        />
        
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)} 
            variant="outline" 
            size="sm"
            title={language === 'ar' ? 'تعديل' : 'Edit'}
          >
            {language === 'ar' ? 'تعديل' : 'Edit'}
          </Button>
        ) : (
          <>
            <Button 
              onClick={handleSave} 
              variant="default" 
              size="sm"
              title={language === 'ar' ? 'حفظ' : 'Save'}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className={iconClasses} />
            </Button>
            <Button 
              onClick={handleCancel} 
              variant="destructive" 
              size="sm"
              title={language === 'ar' ? 'إلغاء' : 'Cancel'}
            >
              <X className={iconClasses} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialMediaInput;