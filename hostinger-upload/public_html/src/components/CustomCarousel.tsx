import { useState, useEffect, useRef, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface CarouselItem {
  id: string;
  imageUrl: string;
  alt: string;
  title: string;
  subtitle: string;
  cta?: {
    text: string;
    link: string;
  };
}

interface CustomCarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
}

const CustomCarousel = ({ 
  items, 
  autoPlay = true, 
  interval = 5000 
}: CustomCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const { getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';

  // Handle navigation
  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToIndex = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay) {
      autoPlayRef.current = setInterval(goToNext, interval);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, interval]);

  // Reset transition state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Match this with CSS transition time
    
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Reset interval when navigating manually
  const resetInterval = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(goToNext, interval);
    }
  };

  // Carousel navigation with reset of interval
  const handlePrevious = () => {
    goToPrevious();
    resetInterval();
  };

  const handleNext = () => {
    goToNext();
    resetInterval();
  };

  const handleIndicatorClick = (index: number) => {
    goToIndex(index);
    resetInterval();
  };

  return (
    <div className="carousel-container h-[500px] md:h-[600px] relative overflow-hidden">
      <div 
        className="flex transition-transform duration-500 h-full"
        style={{ 
          transform: `translateX(${isRtl ? '' : '-'}${currentIndex * 100}%)` 
        }}
      >
        {items.map((item, index) => (
          <div key={item.id} className="carousel-item flex-shrink-0 w-full h-full">
            <div className="relative w-full h-full">
              <img 
                src={item.imageUrl} 
                alt={item.alt} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-50 flex items-center justify-center p-6">
                <div className="text-center">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">{item.title}</h2>
                  <p className="text-xl text-white mb-6 drop-shadow-sm">{item.subtitle}</p>
                  {item.cta && (
                    <button 
                      onClick={() => {
                        const link = item.cta?.link || '';
                        const url = link.startsWith('/') || link.startsWith('http') 
                          ? link 
                          : `/${link}`;
                        
                        // Force navigation with full page refresh
                        window.location.href = url;
                      }}
                      className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-primary-foreground font-bold py-3 px-8 rounded-lg transition duration-300 inline-block shadow-md cursor-pointer"
                    >
                      {item.cta.text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Carousel Controls */}
      <Button 
        onClick={handlePrevious}
        className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 dark:bg-black dark:bg-opacity-60 dark:hover:bg-opacity-80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 shadow-md`}
        size="icon"
        variant="ghost"
        aria-label={isRtl ? "Next slide" : "Previous slide"}
      >
        <i className={`bi ${isRtl ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
      </Button>
      
      <Button 
        onClick={handleNext}
        className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 dark:bg-black dark:bg-opacity-60 dark:hover:bg-opacity-80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 shadow-md`}
        size="icon"
        variant="ghost"
        aria-label={isRtl ? "Previous slide" : "Next slide"}
      >
        <i className={`bi ${isRtl ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
      </Button>
      
      {/* Carousel Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4">
        {items.map((_, index) => (
          <button 
            key={index}
            className={`carousel-indicator w-4 h-4 rounded-full ${
              index === currentIndex 
                ? 'bg-white dark:bg-primary' 
                : 'bg-white bg-opacity-50 dark:bg-white dark:bg-opacity-60 hover:bg-opacity-75 dark:hover:bg-opacity-80'
            } transition-all shadow-sm`}
            onClick={() => handleIndicatorClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomCarousel;
