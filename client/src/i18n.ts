interface Translation {
  [key: string]: string;
}

interface TranslationSet {
  ar: Translation;
  tr: Translation;
}

const translations: TranslationSet = {
  ar: {
    // Layout & Navigation
    "app.title": "المطعم الملكي",
    "app.subtitle": "Royal Restaurant",
    "app.language.select": "الرجاء اختيار اللغة المفضلة",
    "app.language.arabic": "العربية",
    "app.language.turkish": "Türkçe",
    
    "nav.home": "الرئيسية",
    "nav.menu": "القائمة",
    "nav.about": "من نحن",
    "nav.contact": "اتصل بنا",
    
    // Home Page
    "home.hero.title": "المطعم الملكي",
    "home.hero.subtitle": "تجربة طعام لا تُنسى بنكهات الشرق الأوسط الأصيلة",
    "home.hero.cta": "استعرض القائمة",
    
    "home.about.title": "مرحباً بكم في المطعم الملكي",
    "home.about.subtitle": "تجربة طعام فريدة تجمع بين الأصالة والفخامة، نقدم لكم أشهى المأكولات الشرقية والتركية بلمسة عصرية.",
    "home.about.story.title": "قصتنا",
    "home.about.story.p1": "بدأت رحلتنا منذ أكثر من 25 عاماً، حيث افتتح المطعم الملكي أبوابه في قلب مدينة اسطنبول ليقدم تجربة طعام أصيلة تعكس ثراء المطبخ الشرق أوسطي والتركي.",
    "home.about.story.p2": "يتميز المطعم الملكي بأجوائه الفاخرة وخدمته الاستثنائية، ويفتخر بتقديم وصفات تقليدية معدة بأيدي طهاة محترفين يستخدمون أجود أنواع المكونات الطازجة.",
    "home.about.quality": "جودة عالية",
    "home.about.service": "خدمة ممتازة",
    "home.about.since": "منذ 1995",
    "home.about.cta": "تواصل معنا",
    
    "home.special.title": "أطباقنا المميزة",
    "home.special.subtitle": "تذوق أشهر أطباقنا التي اشتهر بها المطعم الملكي على مر السنين",
    "home.special.cta": "اطلب الآن",
    
    // Menu Page
    "menu.title": "قائمتنا",
    "menu.subtitle": "استمتع بتشكيلة واسعة من الأطباق الشرقية والتركية الأصيلة المحضرة بعناية فائقة",
    "menu.filter.all": "جميع الأصناف",
    "menu.view.all": "عرض القائمة كاملة",
    
    // Category Names
    "category.appetizers": "المقبلات",
    "category.main-dishes": "الأطباق الرئيسية",
    "category.drinks": "المشروبات",
    "category.desserts": "الحلويات",
    
    // Contact Page
    "contact.title": "تواصل معنا",
    "contact.subtitle": "نحن سعداء بالرد على استفساراتكم وحجز طاولتكم في المطعم الملكي",
    "contact.info.title": "معلومات التواصل",
    "contact.address.title": "العنوان",
    "contact.address.value": "حي إسمت باشا، الشارع 53، رقم: 9A سلطان غازي، اسطنبول",
    "contact.phone.title": "الهاتف",
    "contact.phone.value": "+90 543 488 88 28",
    "contact.email.title": "البريد الإلكتروني",
    "contact.email.value": "info@royalrestaurant.com",
    "contact.hours.title": "ساعات العمل",
    "contact.hours.value": "يومياً: 12:00 ظهراً - 12:00 منتصف الليل",
    "contact.social.title": "تابعنا",
    
    "contact.booking.title": "احجز طاولتك",
    "contact.booking.name": "الاسم",
    "contact.booking.phone": "رقم الهاتف",
    "contact.booking.date": "التاريخ",
    "contact.booking.time": "الوقت",
    "contact.booking.people": "عدد الأشخاص",
    "contact.booking.notes": "ملاحظات إضافية",
    "contact.booking.submit": "تأكيد الحجز",
    
    // Footer
    "footer.quicklinks": "روابط سريعة",
    "footer.hours": "ساعات العمل",
    "footer.hours.weekdays": "الإثنين - الخميس",
    "footer.hours.weekend": "الجمعة - السبت",
    "footer.hours.sunday": "الأحد",
    "footer.contact": "اتصل بنا",
    "footer.copyright": "© 2023 المطعم الملكي. جميع الحقوق محفوظة.",
    
    // Admin Dashboard
    "admin.dashboard": "لوحة التحكم",
    "admin.categories": "الأصناف",
    "admin.menu-items": "العناصر",
    "admin.foods": "الأطعمة",
    "admin.drinks": "المشروبات",
    "admin.orders": "الطلبات",
    "admin.users": "المستخدمين",
    "admin.settings": "الإعدادات",
    "admin.logout": "تسجيل الخروج",
    
    "admin.login.title": "تسجيل الدخول للوحة التحكم",
    "admin.login.username": "اسم المستخدم",
    "admin.login.password": "كلمة المرور",
    "admin.login.submit": "تسجيل الدخول",
    
    "admin.stats.orders": "طلبات اليوم",
    "admin.stats.revenue": "إيرادات اليوم",
    "admin.stats.bookings": "حجوزات اليوم",
    "admin.stats.rating": "متوسط التقييم",
    
    "admin.items.recent": "آخر العناصر المضافة",
    "admin.items.name": "الاسم",
    "admin.items.category": "الصنف",
    "admin.items.price": "السعر",
    "admin.items.status": "الحالة",
    "admin.items.actions": "الإجراءات",
    "admin.items.available": "متاح",
    "admin.items.unavailable": "غير متاح",
    "admin.items.noItems": "لا توجد عناصر لعرضها",
    
    "admin.form.add": "إضافة عنصر جديد",
    "admin.form.name.ar": "اسم العنصر (عربي)",
    "admin.form.name.tr": "اسم العنصر (تركي)",
    "admin.form.description.ar": "الوصف (عربي)",
    "admin.form.description.tr": "الوصف (تركي)",
    "admin.form.price": "السعر (₺)",
    "admin.form.category": "الصنف",
    "admin.form.image": "صورة العنصر",
    "admin.form.upload": "رفع صورة",
    "admin.form.available": "متاح للطلب",
    "admin.form.cancel": "إلغاء",
    "admin.form.submit": "إضافة العنصر",
    "admin.form.update": "تحديث العنصر"
  },
  tr: {
    // Layout & Navigation
    "app.title": "Royal Restaurant",
    "app.subtitle": "المطعم الملكي",
    "app.language.select": "Lütfen tercih ettiğiniz dili seçin",
    "app.language.arabic": "العربية",
    "app.language.turkish": "Türkçe",
    
    "nav.home": "Ana Sayfa",
    "nav.menu": "Menü",
    "nav.about": "Hakkımızda",
    "nav.contact": "İletişim",
    
    // Home Page
    "home.hero.title": "Royal Restaurant",
    "home.hero.subtitle": "Otantik Orta Doğu lezzetleriyle unutulmaz bir yemek deneyimi",
    "home.hero.cta": "Menüyü Görüntüle",
    
    "home.about.title": "Royal Restaurant'a Hoş Geldiniz",
    "home.about.subtitle": "Otantiklik ve lüksü bir araya getiren eşsiz bir yemek deneyimi, modern bir dokunuşla en lezzetli Doğu ve Türk yemeklerini sunuyoruz.",
    "home.about.story.title": "Hikayemiz",
    "home.about.story.p1": "Yolculuğumuz 25 yıldan fazla bir süre önce başladı. Royal Restaurant, İstanbul'un kalbinde kapılarını açarak, Orta Doğu ve Türk mutfağının zenginliğini yansıtan otantik bir yemek deneyimi sundu.",
    "home.about.story.p2": "Royal Restaurant, lüks atmosferi ve olağanüstü hizmetiyle öne çıkıyor ve en kaliteli taze malzemeler kullanan profesyonel şefler tarafından hazırlanan geleneksel tarifleri sunmaktan gurur duyuyor.",
    "home.about.quality": "Yüksek Kalite",
    "home.about.service": "Mükemmel Hizmet",
    "home.about.since": "1995'ten beri",
    "home.about.cta": "Bize Ulaşın",
    
    "home.special.title": "Özel Yemeklerimiz",
    "home.special.subtitle": "Royal Restaurant'ın yıllar içinde ünlendiği en popüler yemeklerimizi tadın",
    "home.special.cta": "Şimdi Sipariş Ver",
    
    // Menu Page
    "menu.title": "Menümüz",
    "menu.subtitle": "Özenle hazırlanmış otantik Doğu ve Türk yemeklerinin geniş seçkisinin tadını çıkarın",
    "menu.filter.all": "Tüm Kategoriler",
    "menu.view.all": "Tüm Menüyü Görüntüle",
    
    // Category Names
    "category.appetizers": "Başlangıçlar",
    "category.main-dishes": "Ana Yemekler",
    "category.drinks": "İçecekler",
    "category.desserts": "Tatlılar",
    
    // Contact Page
    "contact.title": "Bize Ulaşın",
    "contact.subtitle": "Sorularınızı yanıtlamaktan ve Royal Restaurant'ta masanızı ayırmaktan mutluluk duyarız",
    "contact.info.title": "İletişim Bilgileri",
    "contact.address.title": "Adres",
    "contact.address.value": "İsmetpaşa, 53. Sk. NO:9A, 34270 Sultangazi/İstanbul, Türkiye",
    "contact.phone.title": "Telefon",
    "contact.phone.value": "+90 543 488 88 28",
    "contact.email.title": "E-posta",
    "contact.email.value": "info@royalrestaurant.com",
    "contact.hours.title": "Çalışma Saatleri",
    "contact.hours.value": "Her gün: 12:00 - 00:00",
    "contact.social.title": "Bizi Takip Edin",
    
    "contact.booking.title": "Masa Rezervasyonu",
    "contact.booking.name": "İsim",
    "contact.booking.phone": "Telefon Numarası",
    "contact.booking.date": "Tarih",
    "contact.booking.time": "Saat",
    "contact.booking.people": "Kişi Sayısı",
    "contact.booking.notes": "Ek Notlar",
    "contact.booking.submit": "Rezervasyonu Onayla",
    
    // Footer
    "footer.quicklinks": "Hızlı Bağlantılar",
    "footer.hours": "Çalışma Saatleri",
    "footer.hours.weekdays": "Pazartesi - Perşembe",
    "footer.hours.weekend": "Cuma - Cumartesi",
    "footer.hours.sunday": "Pazar",
    "footer.contact": "İletişim",
    "footer.copyright": "© 2023 Royal Restaurant. Tüm hakları saklıdır.",
    
    // Admin Dashboard
    "admin.dashboard": "Kontrol Paneli",
    "admin.categories": "Kategoriler",
    "admin.menu-items": "Menü Öğeleri",
    "admin.foods": "Yemekler",
    "admin.drinks": "İçecekler",
    "admin.orders": "Siparişler",
    "admin.users": "Kullanıcılar",
    "admin.settings": "Ayarlar",
    "admin.logout": "Çıkış Yap",
    
    "admin.login.title": "Kontrol Paneli Girişi",
    "admin.login.username": "Kullanıcı Adı",
    "admin.login.password": "Şifre",
    "admin.login.submit": "Giriş Yap",
    
    "admin.stats.orders": "Günlük Siparişler",
    "admin.stats.revenue": "Günlük Gelir",
    "admin.stats.bookings": "Günlük Rezervasyonlar",
    "admin.stats.rating": "Ortalama Puanlama",
    
    "admin.items.recent": "Son Eklenen Öğeler",
    "admin.items.name": "İsim",
    "admin.items.category": "Kategori",
    "admin.items.price": "Fiyat",
    "admin.items.status": "Durum",
    "admin.items.actions": "İşlemler",
    "admin.items.available": "Mevcut",
    "admin.items.unavailable": "Mevcut Değil",
    "admin.items.noItems": "Gösterilecek öğe yok",
    
    "admin.form.add": "Yeni Öğe Ekle",
    "admin.form.name.ar": "Öğe Adı (Arapça)",
    "admin.form.name.tr": "Öğe Adı (Türkçe)",
    "admin.form.description.ar": "Açıklama (Arapça)",
    "admin.form.description.tr": "Açıklama (Türkçe)",
    "admin.form.price": "Fiyat (₺)",
    "admin.form.category": "Kategori",
    "admin.form.image": "Öğe Resmi",
    "admin.form.upload": "Resim Yükle",
    "admin.form.available": "Sipariş İçin Mevcut",
    "admin.form.cancel": "İptal",
    "admin.form.submit": "Öğe Ekle",
    "admin.form.update": "Öğeyi Güncelle"
  }
};

export default translations;
