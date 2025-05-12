import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { getCurrentSeasonIngredients, getActiveSeasonalIngredients } from '@/utils/seasonalIngredients';
import SeasonalIngredientCard from './SeasonalIngredientCard';

const SeasonalIngredientsSection = () => {
  const { t } = useTranslation();
  const [currentSeasonIngredients, setCurrentSeasonIngredients] = useState(getCurrentSeasonIngredients());
  const [allIngredients, setAllIngredients] = useState(getActiveSeasonalIngredients());
  const [showAll, setShowAll] = useState(false);

  // Listen for updates to ingredients
  useEffect(() => {
    const handleIngredientsUpdate = () => {
      setCurrentSeasonIngredients(getCurrentSeasonIngredients());
      setAllIngredients(getActiveSeasonalIngredients());
    };

    // Update when localStorage changes or custom event fired
    window.addEventListener('storage', handleIngredientsUpdate);
    document.addEventListener('ingredientsUpdated', handleIngredientsUpdate);

    return () => {
      window.removeEventListener('storage', handleIngredientsUpdate);
      document.removeEventListener('ingredientsUpdated', handleIngredientsUpdate);
    };
  }, []);

  const displayedIngredients = showAll ? allIngredients : currentSeasonIngredients;

  // If there are no ingredients to display, don't render the section
  if (displayedIngredients.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background dark:bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.2,
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('seasonal.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('seasonal.subtitle')}</p>
          </motion.div>
          
          <div className="mt-6 flex justify-center">
            <Button
              className="group relative overflow-hidden"
              onClick={() => setShowAll(!showAll)}
              variant="outline"
            >
              <span className="relative z-10">
                {showAll ? t('seasonal.current') : t('seasonal.cta')}
              </span>
              <motion.span
                className="absolute inset-0 bg-primary/10 dark:bg-primary/20"
                initial={{ x: "-100%" }}
                animate={{ x: showAll ? "0%" : "-100%" }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedIngredients.map((ingredient, index) => (
            <SeasonalIngredientCard 
              key={ingredient.id} 
              ingredient={ingredient} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeasonalIngredientsSection;