import { useTranslation } from '@/hooks/useTranslation';
import { restaurantImages } from '@/lib/utils';

const AboutPage = () => {
  const { t, language, getDirection } = useTranslation();
  const isRtl = getDirection() === 'rtl';

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-[300px] md:h-[400px] overflow-hidden">
          <img 
            src={restaurantImages[0].url} 
            alt={restaurantImages[0].alt} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('nav.about')}</h1>
              <div className="w-24 h-1 bg-primary mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">{t('home.about.title')}</h2>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <p className="text-foreground mb-6">{t('home.about.story.p1')}</p>
              <p className="text-foreground mb-6">{t('home.about.story.p2')}</p>
              <p className="text-foreground mb-6">
                {language === 'ar' 
                  ? 'نحن نفخر بتقديم مأكولات متنوعة من المطبخ العربي والتركي، مع التركيز على استخدام أفضل المكونات الطازجة والمحلية. هدفنا هو توفير تجربة طعام استثنائية لكل ضيف مع خدمة ممتازة في أجواء أنيقة.'
                  : 'We pride ourselves on offering a diverse selection of Arabic and Turkish cuisine, with a focus on using the best fresh, local ingredients. Our goal is to provide an exceptional dining experience for every guest with excellent service in an elegant atmosphere.'}
              </p>
            </div>
            <div className="relative">
              <img 
                src={restaurantImages[3].url} 
                alt={restaurantImages[3].alt} 
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-primary rounded-lg flex items-center justify-center">
                <p className="text-white font-bold text-xl">{t('home.about.since')}</p>
              </div>
            </div>
          </div>

          {/* Our Vision */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary mb-4">
                {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 shadow-inner">
              <p className="text-lg text-center text-foreground italic">
                {language === 'ar' 
                  ? 'نسعى في المطعم الملكي لأن نكون الوجهة المفضلة لعشاق الطعام الأصيل، حيث نقدم تجربة طعام فريدة تجمع بين الأصالة والابتكار، ونعكس ثراء وتنوع المطبخين العربي والتركي في أجواء تناسب جميع المناسبات.'
                  : 'At Royal Restaurant, we strive to be the preferred destination for lovers of authentic food, where we offer a unique dining experience that combines authenticity and innovation, reflecting the richness and diversity of both Arabic and Turkish cuisines in an atmosphere suitable for all occasions.'}
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary mb-4">
                {language === 'ar' ? 'قيمنا' : 'Our Values'}
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                  <i className="bi bi-star-fill text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">
                  {language === 'ar' ? 'الجودة' : 'Quality'}
                </h3>
                <p className="text-foreground">
                  {language === 'ar' 
                    ? 'نلتزم بتقديم أفضل المكونات والوصفات الأصيلة في كل طبق'
                    : 'We are committed to offering the best ingredients and authentic recipes in every dish'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                  <i className="bi bi-people-fill text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">
                  {language === 'ar' ? 'الضيافة' : 'Hospitality'}
                </h3>
                <p className="text-foreground">
                  {language === 'ar' 
                    ? 'نسعى لأن يشعر كل ضيف بالترحيب والراحة في أجواء المطعم الملكي'
                    : 'We strive to make every guest feel welcome and comfortable in the atmosphere of Royal Restaurant'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
                <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
                  <i className="bi bi-heart-fill text-3xl text-primary"></i>
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">
                  {language === 'ar' ? 'الشغف' : 'Passion'}
                </h3>
                <p className="text-foreground">
                  {language === 'ar' 
                    ? 'نعمل بشغف لتقديم تجربة طعام لا تُنسى وخدمة استثنائية'
                    : 'We work with passion to provide an unforgettable dining experience and exceptional service'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {language === 'ar' ? 'فريقنا' : 'Our Team'}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-foreground max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'يتكون فريقنا من مجموعة من الخبراء المحترفين الذين يسعون دائماً لتقديم الأفضل'
                : 'Our team consists of a group of professional experts who always strive to provide the best'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Executive Chef" 
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-secondary mb-1">
                  {language === 'ar' ? 'أحمد محمود' : 'Ahmed Mahmoud'}
                </h3>
                <p className="text-primary font-medium mb-3">
                  {language === 'ar' ? 'رئيس الطهاة التنفيذي' : 'Executive Chef'}
                </p>
                <p className="text-foreground/80 text-sm">
                  {language === 'ar' 
                    ? 'خبرة أكثر من 20 عاماً في المطبخ الشرقي، حائز على العديد من الجوائز العالمية'
                    : 'Over 20 years of experience in Middle Eastern cuisine, recipient of several international awards'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Restaurant Manager" 
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-secondary mb-1">
                  {language === 'ar' ? 'ليلى أوزتورك' : 'Leyla Öztürk'}
                </h3>
                <p className="text-primary font-medium mb-3">
                  {language === 'ar' ? 'مديرة المطعم' : 'Restaurant Manager'}
                </p>
                <p className="text-foreground/80 text-sm">
                  {language === 'ar' 
                    ? 'متخصصة في إدارة المطاعم الفاخرة وتقديم تجربة ضيافة استثنائية'
                    : 'Specialized in luxury restaurant management and providing an exceptional hospitality experience'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Pastry Chef" 
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-secondary mb-1">
                  {language === 'ar' ? 'مصطفى كمال' : 'Mustafa Kemal'}
                </h3>
                <p className="text-primary font-medium mb-3">
                  {language === 'ar' ? 'رئيس قسم الحلويات' : 'Pastry Chef'}
                </p>
                <p className="text-foreground/80 text-sm">
                  {language === 'ar' 
                    ? 'متخصص في الحلويات الشرقية التقليدية مع لمسة إبداعية عصرية'
                    : 'Specialized in traditional Eastern desserts with a creative modern touch'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
