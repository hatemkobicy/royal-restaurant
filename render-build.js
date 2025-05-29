const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Royal Restaurant Production Build ===');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Create a simple production version
  console.log('Creating production build...');
  
  // Create dist directory
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
  }
  
  if (!fs.existsSync('./dist/public')) {
    fs.mkdirSync('./dist/public', { recursive: true });
  }

  // Create the restaurant website
  console.log('Creating restaurant website...');
  
  // Create a proper restaurant landing page
  const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Royal Restaurant - مطعم رويال</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            font-family: 'Cairo', 'Segoe UI', Arial, sans-serif; 
            margin: 0;
            padding: 0;
            scroll-behavior: smooth;
        }
        .rtl { direction: rtl; text-align: right; }
        .dark { background: #1a1a1a; color: #ffffff; }
        .hero-bg {
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
        }
        .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(196, 165, 114, 0.3);
        }
        .golden { color: #C4A572; }
        .text-shadow { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
    </style>
</head>
<body class="dark">
    <div id="root">
        <!-- Navigation -->
        <nav class="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-yellow-600/20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold golden">Royal Restaurant</h1>
                    </div>
                    <div class="hidden md:flex space-x-8 rtl:space-x-reverse">
                        <a href="#home" class="text-white hover:text-yellow-400 transition-colors">الرئيسية</a>
                        <a href="#about" class="text-white hover:text-yellow-400 transition-colors">عنا</a>
                        <a href="#contact" class="text-white hover:text-yellow-400 transition-colors">اتصل بنا</a>
                        <a href="/admin/login" class="bg-yellow-600 hover:bg-yellow-700 text-black px-4 py-2 rounded transition-colors">لوحة التحكم</a>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section id="home" class="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
            <div class="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto">
                <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold golden text-shadow">Royal Restaurant</h1>
                <h2 class="text-2xl md:text-4xl lg:text-5xl text-yellow-400 text-shadow">مطعم رويال</h2>
                <p class="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    تجربة طعام فاخرة في قلب اسطنبول - نقدم لك أشهى الأطباق التركية والعربية الأصيلة
                </p>
                <p class="text-base md:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto">
                    Luxury dining experience in the heart of Istanbul - Authentic Turkish and Arabic cuisine
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                    <a href="#contact" class="bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
                        احجز طاولتك الآن
                    </a>
                    <a href="#about" class="border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-black font-bold py-4 px-8 rounded-lg text-lg transition-all">
                        اكتشف قصتنا
                    </a>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="py-20 bg-gray-900">
            <div class="max-w-6xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h3 class="text-4xl md:text-5xl font-bold golden mb-6">قصتنا منذ 1995</h3>
                    <h4 class="text-2xl md:text-3xl text-yellow-400 mb-8">Our Story Since 1995</h4>
                </div>
                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div class="space-y-6">
                        <p class="text-lg text-gray-300 leading-relaxed">
                            منذ عام 1995، نفتخر بتقديم أجود الأطباق التركية والعربية في أجواء راقية ومميزة. 
                            مطعم رويال هو وجهتك المثالية لتناول وجبة لا تُنسى في قلب اسطنبول.
                        </p>
                        <p class="text-base text-gray-400 leading-relaxed">
                            Since 1995, we've been proud to serve the finest Turkish and Arabic dishes in an elegant 
                            and distinctive atmosphere. Royal Restaurant is your perfect destination for an unforgettable 
                            meal in the heart of Istanbul.
                        </p>
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">
                            <div class="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center">
                                <i class="bi bi-award text-black text-2xl"></i>
                            </div>
                            <div>
                                <h5 class="text-xl font-semibold golden">جودة استثنائية</h5>
                                <p class="text-gray-400">Exceptional Quality</p>
                            </div>
                        </div>
                    </div>
                    <div class="relative">
                        <div class="bg-gradient-to-br from-yellow-600/20 to-transparent p-8 rounded-2xl">
                            <div class="text-center space-y-4">
                                <div class="text-6xl golden">🍽️</div>
                                <h5 class="text-2xl font-bold text-white">تجربة طعام فريدة</h5>
                                <p class="text-gray-300">Unique Dining Experience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="py-20 bg-black">
            <div class="max-w-6xl mx-auto px-4">
                <div class="text-center mb-16">
                    <h3 class="text-4xl md:text-5xl font-bold golden mb-6">تواصل معنا</h3>
                    <h4 class="text-2xl md:text-3xl text-yellow-400 mb-8">Contact Us</h4>
                </div>
                
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Location -->
                    <div class="card-hover bg-gray-900 p-8 rounded-2xl text-center transition-all duration-300">
                        <div class="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="bi bi-geo-alt text-black text-2xl"></i>
                        </div>
                        <h5 class="text-xl font-bold golden mb-4">موقعنا</h5>
                        <p class="text-gray-300 mb-2">İsmetpaşa, 53. Sk. NO:9A</p>
                        <p class="text-gray-300">34270 Sultangazi/İstanbul</p>
                    </div>

                    <!-- Phone -->
                    <div class="card-hover bg-gray-900 p-8 rounded-2xl text-center transition-all duration-300">
                        <div class="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="bi bi-telephone text-black text-2xl"></i>
                        </div>
                        <h5 class="text-xl font-bold golden mb-4">هاتف</h5>
                        <p class="text-gray-300 text-xl" dir="ltr">+90 543 488 88 28</p>
                        <p class="text-gray-400 text-sm mt-2">متاح 24/7</p>
                    </div>

                    <!-- Hours -->
                    <div class="card-hover bg-gray-900 p-8 rounded-2xl text-center transition-all duration-300">
                        <div class="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="bi bi-clock text-black text-2xl"></i>
                        </div>
                        <h5 class="text-xl font-bold golden mb-4">ساعات العمل</h5>
                        <p class="text-gray-300">يومياً: 11:00 - 23:00</p>
                        <p class="text-gray-400 text-sm mt-2">Daily: 11:00 AM - 11:00 PM</p>
                    </div>
                </div>

                <!-- Admin Panel Access -->
                <div class="mt-16 text-center">
                    <div class="bg-gradient-to-r from-yellow-600/10 to-yellow-600/5 border border-yellow-600/30 rounded-2xl p-8">
                        <h5 class="text-2xl font-bold golden mb-4">إدارة المطعم</h5>
                        <p class="text-gray-300 mb-6">للوصول إلى لوحة التحكم وإدارة المحتوى</p>
                        <a href="/admin/login" class="inline-block bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105">
                            <i class="bi bi-shield-lock ml-2"></i>
                            دخول لوحة التحكم
                        </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 border-t border-yellow-600/20 py-12">
            <div class="max-w-6xl mx-auto px-4 text-center">
                <h3 class="text-3xl font-bold golden mb-4">Royal Restaurant</h3>
                <p class="text-gray-400 mb-6">مطعم رويال - تجربة طعام فاخرة منذ 1995</p>
                <div class="flex justify-center space-x-6 rtl:space-x-reverse">
                    <a href="tel:+905434888828" class="text-gray-400 hover:text-yellow-400 transition-colors">
                        <i class="bi bi-telephone text-2xl"></i>
                    </a>
                    <a href="#contact" class="text-gray-400 hover:text-yellow-400 transition-colors">
                        <i class="bi bi-geo-alt text-2xl"></i>
                    </a>
                </div>
                <div class="mt-8 pt-8 border-t border-gray-700 text-gray-500 text-sm">
                    <p>&copy; 2024 Royal Restaurant. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    </div>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll effect to navigation
        window.addEventListener('scroll', function() {
            const nav = document.querySelector('nav');
            if (window.scrollY > 100) {
                nav.classList.add('bg-black');
                nav.classList.remove('bg-black/90');
            } else {
                nav.classList.add('bg-black/90');
                nav.classList.remove('bg-black');
            }
        });
    </script>
</body>
</html>`;

  fs.writeFileSync('./dist/public/index.html', htmlContent);

  console.log('Production build completed successfully!');
  console.log('Built files are in ./dist/public');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
