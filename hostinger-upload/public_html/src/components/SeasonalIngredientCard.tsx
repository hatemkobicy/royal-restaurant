import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { SeasonalIngredient } from '@/utils/seasonalIngredients';

interface SeasonalIngredientCardProps {
  ingredient: SeasonalIngredient;
  index: number;
}

const SeasonalIngredientCard = ({ ingredient, index }: SeasonalIngredientCardProps) => {
  const { language } = useTranslation();
  const isArabic = language === 'ar';

  // Animation variants for the card
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9 
    },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    }),
    hover: { 
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Animation variants for the image
  const imageVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    },
    hover: {
      scale: 1.05,
      transition: { 
        duration: 0.3,
        ease: "easeInOut",
        yoyo: Infinity,
        repeatDelay: 0.5
      }
    }
  };

  // Animation variants for the text content
  const contentVariants = {
    hidden: { 
      opacity: 0,
      x: isArabic ? 20 : -20
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    }
  };

  const seasonBadgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: 0.2 + (index * 0.1)
      }
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // Get seasonal colors
  const getSeasonColor = () => {
    switch (ingredient.season) {
      case 'spring':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'summer':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'autumn':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'winter':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  const name = isArabic ? ingredient.nameAr : ingredient.nameTr;
  const description = isArabic ? ingredient.descriptionAr : ingredient.descriptionTr;
  const season = isArabic 
    ? ingredient.season === 'spring' ? 'الربيع'
      : ingredient.season === 'summer' ? 'الصيف'
      : ingredient.season === 'autumn' ? 'الخريف'
      : 'الشتاء'
    : ingredient.season === 'spring' ? 'İlkbahar'
      : ingredient.season === 'summer' ? 'Yaz'
      : ingredient.season === 'autumn' ? 'Sonbahar'
      : 'Kış';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      custom={index}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border-primary/10 dark:border-primary/20 hover:border-primary/30 dark:hover:border-primary/40 transition-colors duration-300">
        <div className="relative overflow-hidden">
          <motion.div 
            className="absolute top-2 end-2 z-10"
            variants={seasonBadgeVariants}
          >
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getSeasonColor()}`}>
              {season}
            </span>
          </motion.div>
          <motion.div
            className="h-48 overflow-hidden"
            variants={imageVariants}
          >
            <img 
              src={ingredient.imageUrl} 
              alt={name}
              className="w-full h-full object-cover transform-gpu transition-all"
            />
          </motion.div>
        </div>
        <CardContent className="flex-grow flex flex-col p-4">
          <motion.div variants={contentVariants}>
            <h3 className="text-lg font-bold text-foreground mb-2">{name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-4 mb-2">
              {description}
            </p>
            <p className="text-xs text-primary/90 mt-auto flex items-center gap-1">
              <motion.span
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                ✨
              </motion.span>
              <span>{isArabic ? 'من المزارع المحلية' : 'Yerel Çiftliklerden'}</span>
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SeasonalIngredientCard;