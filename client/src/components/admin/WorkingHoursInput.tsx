import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';

interface WorkingHoursInputProps {
  name: string;
  label: string;
  defaultValue: string;
  onSave: (value: string) => void;
}

const WorkingHoursInput: React.FC<WorkingHoursInputProps> = ({
  name,
  label,
  defaultValue,
  onSave
}) => {
  const [value, setValue] = useState(defaultValue);
  const [isEditing, setIsEditing] = useState(false);
  const { language } = useLanguage();
  const { t } = useTranslation();
  
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(defaultValue);
    setIsEditing(false);
  };

  // Validate time format (simple validation)
  const isValidTimeFormat = (value: string): boolean => {
    const pattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] - ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return pattern.test(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      
      {isEditing ? (
        <div className="flex flex-col space-y-2">
          <Input
            id={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="12:00 - 23:00"
            className={!isValidTimeFormat(value) ? "border-red-500" : ""}
          />
          
          {!isValidTimeFormat(value) && (
            <p className="text-red-500 text-xs">
              {t('admin.hours.format')}
            </p>
          )}
          
          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button 
              onClick={handleSave}
              disabled={!isValidTimeFormat(value)}
              size="sm"
            >
              {t('admin.hours.save')}
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
              size="sm"
            >
              {t('admin.hours.cancel')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between border rounded-md p-2">
          <span>{value}</span>
          <Button 
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
          >
            {t('admin.hours.edit')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkingHoursInput;