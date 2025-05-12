import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { getLogo, saveLogo, fileToBase64 } from '@/utils/logo';

const LogoUploader: React.FC = () => {
  const [logo, setLogo] = useState(getLogo());
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Max file size: 2MB
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  // Allowed file types
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: t('admin.logo.error.size.title'),
        description: t('admin.logo.error.size.description'),
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: t('admin.logo.error.type.title'),
        description: t('admin.logo.error.type.description'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUploading(true);
      // Convert file to base64 
      const base64 = await fileToBase64(file);
      
      // Save to localStorage
      saveLogo(base64, 'Royal Restaurant Logo');
      
      // Update state
      setLogo({ url: base64, alt: 'Royal Restaurant Logo' });
      
      toast({
        title: t('admin.logo.success.title'),
        description: t('admin.logo.success.description')
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: t('admin.logo.error.upload.title'),
        description: t('admin.logo.error.upload.description'),
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetLogo = () => {
    // Import the default logo from the logo utility
    const { DEFAULT_LOGO } = require('@/utils/logo');
    
    // Save default logo
    saveLogo(DEFAULT_LOGO.URL, DEFAULT_LOGO.ALT);
    
    // Update state
    setLogo({ url: DEFAULT_LOGO.URL, alt: DEFAULT_LOGO.ALT });
    
    toast({
      title: t('admin.logo.reset.title'),
      description: t('admin.logo.reset.description')
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-shrink-0">
          <div className="h-24 w-24 bg-muted rounded-md flex items-center justify-center overflow-hidden border">
            <img
              src={logo.url}
              alt={logo.alt}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
        
        <div className="flex-grow space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {t('admin.logo.description')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('admin.logo.requirements')}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('admin.logo.uploading')}
                </span>
              ) : t('admin.logo.upload')}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleResetLogo}
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {t('admin.logo.reset')}
            </Button>
            
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.gif,.svg"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoUploader;