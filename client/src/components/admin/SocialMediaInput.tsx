import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
  const [value, setValue] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const { language } = useLanguage();

  // Load stored value from localStorage when available
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
      const key = `social_${name.toLowerCase()}`;
      if (settings[key]) {
        setValue(settings[key]);
      }
    } catch (error) {
      console.error('Error loading social media link:', error);
    }
  }, [name]);

  const handleSave = () => {
    onSave(value);
    setEditing(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`social-${name}`}>{label}</Label>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Input
          id={`social-${name}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!editing}
          className="flex-1"
        />
        {!editing ? (
          <Button variant="outline" onClick={() => setEditing(true)}>
            {language === 'ar' ? 'تعديل' : 'Edit'}
          </Button>
        ) : (
          <Button onClick={handleSave}>
            {language === 'ar' ? 'حفظ' : 'Save'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SocialMediaInput;