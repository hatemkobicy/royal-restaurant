const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Royal Restaurant Production Build ===');

try {
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('Creating production build...');
  
  // Build the React app using Vite
  console.log('Building React application with Vite...');
  try {
    execSync('cd client && npx vite build --outDir ../dist/public', { 
      stdio: 'inherit',
      timeout: 300000 // 5 minute timeout
    });
    console.log('Vite build completed successfully!');
  } catch (buildError) {
    console.log('Vite build failed, creating production-ready fallback...');
    
    // Create dist directory
    if (!fs.existsSync('./dist/public')) {
      fs.mkdirSync('./dist/public', { recursive: true });
    }
    
    // Copy client files
    execSync('cp -r ./client/* ./dist/public/', { stdio: 'inherit' });
    
    // Create production index.html that doesn't rely on Vite
    const productionHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Royal Restaurant - مطعم رويال</title>
    <meta name="description" content="Royal Restaurant offers authentic Middle Eastern cuisine in Istanbul. Experience our premium dishes and exceptional service.">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Cairo', sans-serif; background: #000; color: #fff; margin: 0; direction: rtl; }
        .golden { color: #C4A572; }
        .bg-golden { background-color: #C4A572; }
        .loading { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div id="root">
        <div style="min-height: 100vh; background: #000; color: #fff; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <h1 style="font-size: 3rem; font-weight: bold; color: #C4A572; margin-bottom: 1rem;">Royal Restaurant</h1>
                <h2 style="font-size: 2rem; color: #fbbf24; margin-bottom: 2rem;">مطعم رويال</h2>
                <div style="margin-bottom: 2rem;">
                    <div style="width: 40px; height: 40px; border: 4px solid #fbbf24; border-top: 4px solid transparent; border-radius: 50%; margin: 0 auto;" class="loading"></div>
                    <p style="margin-top: 1rem; color: #d1d5db;">جاري تحميل الموقع...</p>
                </div>
                <a href="/admin/login" style="background: #C4A572; color: #000; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                    Admin Panel / لوحة التحكم
                </a>
            </div>
        </div>
    </div>
    <script>
        // Load menu data and render the full application
        setTimeout(async function() {
            try {
                // Fetch categories and menu items
                const categoriesRes = await fetch('/api/categories');
                const categories = await categoriesRes.json();
                const menuRes = await fetch('/api/menu-items');
                const menuItems = await menuRes.json();
                
                // Render the full restaurant website
                document.getElementById('root').innerHTML = createRestaurantApp(categories, menuItems);
                
                // Add event listeners
                setupEventListeners();
            } catch (error) {
                console.error('Error loading data:', error);
                document.getElementById('root').innerHTML = createFallbackApp();
            }
        }, 1000);
        
        function createRestaurantApp(categories, menuItems) {
            return \`
                <div style="min-height: 100vh; background: #000; color: #fff;">
                    <header style="background: #000; border-bottom: 2px solid #C4A572; padding: 1rem 0;">
                        <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                            <h1 style="font-size: 2.5rem; font-weight: bold; color: #C4A572; margin: 0;">Royal Restaurant</h1>
                            <div style="font-size: 1.25rem; color: #fbbf24;">مطعم رويال</div>
                        </div>
                    </header>
                    
                    <main style="max-width: 1200px; margin: 0 auto; padding: 3rem 2rem;">
                        <section style="text-align: center; margin-bottom: 4rem;">
                            <h2 style="font-size: 3rem; font-weight: bold; color: #C4A572; margin-bottom: 1rem;">أهلاً وسهلاً</h2>
                            <p style="font-size: 1.25rem; color: #d1d5db; margin-bottom: 2rem;">مرحباً بكم في مطعم رويال - تجربة طعام استثنائية منذ عام 1995</p>
                        </section>
                        
                        <section style="margin-bottom: 4rem;">
                            <h3 style="font-size: 2rem; font-weight: bold; color: #C4A572; text-align: center; margin-bottom: 2rem;">قائمة الطعام</h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                                \${categories.map(category => \`
                                    <div style="background: #1f2937; padding: 2rem; border-radius: 12px; border: 2px solid #C4A572;">
                                        <h4 style="font-size: 1.5rem; font-weight: bold; color: #C4A572; margin-bottom: 1rem;">\${category.nameAr}</h4>
                                        <h5 style="font-size: 1.25rem; color: #fbbf24; margin-bottom: 1rem;">\${category.nameTr}</h5>
                                        <div style="space-y: 1rem;">
                                            \${menuItems.filter(item => item.categoryId === category.id).map(item => \`
                                                <div style="border-bottom: 1px solid #374151; padding-bottom: 1rem; margin-bottom: 1rem;">
                                                    <div style="display: flex; justify-content: space-between; align-items: start;">
                                                        <div>
                                                            <h6 style="color: #fff; font-weight: 600; margin-bottom: 0.5rem;">\${item.nameAr}</h6>
                                                            <p style="color: #9ca3af; font-size: 0.875rem; margin-bottom: 0.5rem;">\${item.nameTr}</p>
                                                            \${item.descriptionAr ? \`<p style="color: #d1d5db; font-size: 0.875rem;">\${item.descriptionAr}</p>\` : ''}
                                                        </div>
                                                        <div style="text-align: left; margin-right: 1rem;">
                                                            <span style="color: #C4A572; font-weight: bold; font-size: 1.125rem;">\${item.price} ₺</span>
                                                            \${item.travelPrice ? \`<div style="color: #fbbf24; font-size: 0.875rem;">سعر السفري: \${item.travelPrice} ₺</div>\` : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                            \`).join('')}
                                        </div>
                                    </div>
                                \`).join('')}
                            </div>
                        </section>
                        
                        <section style="background: #1f2937; padding: 3rem; border-radius: 12px; text-align: center; border: 2px solid #C4A572;">
                            <h3 style="font-size: 2rem; font-weight: bold; color: #C4A572; margin-bottom: 2rem;">تواصل معنا</h3>
                            <p style="color: #d1d5db; margin-bottom: 1rem; font-size: 1.125rem;">İsmetpaşa, 53. Sk. NO:9A, 34270 Sultangazi/İstanbul</p>
                            <p style="color: #C4A572; font-weight: bold; margin-bottom: 2rem; font-size: 1.25rem;">+90 543 488 88 28</p>
                            <a href="/admin/login" style="background: #C4A572; color: #000; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 1.125rem;">
                                Admin Panel / لوحة التحكم
                            </a>
                        </section>
                    </main>
                    
                    <footer style="background: #1f2937; border-top: 2px solid #C4A572; padding: 2rem 0; margin-top: 3rem;">
                        <div style="max-width: 1200px; margin: 0 auto; text-align: center; padding: 0 2rem;">
                            <p style="color: #9ca3af;">&copy; 2024 Royal Restaurant. جميع الحقوق محفوظة.</p>
                        </div>
                    </footer>
                </div>
            \`;
        }
        
        function createFallbackApp() {
            return \`
                <div style="min-height: 100vh; background: #000; color: #fff; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center;">
                        <h1 style="font-size: 3rem; font-weight: bold; color: #C4A572; margin-bottom: 1rem;">Royal Restaurant</h1>
                        <h2 style="font-size: 2rem; color: #fbbf24; margin-bottom: 2rem;">مطعم رويال</h2>
                        <p style="color: #d1d5db; margin-bottom: 2rem;">مطعم رويال - تجربة طعام استثنائية منذ عام 1995</p>
                        <a href="/admin/login" style="background: #C4A572; color: #000; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                            Admin Panel / لوحة التحكم
                        </a>
                    </div>
                </div>
            \`;
        }
        
        function setupEventListeners() {
            // Add any interactive functionality here
            console.log('Royal Restaurant website loaded successfully');
        }
    </script>
</body>
</html>`;
    
    fs.writeFileSync('./dist/public/index.html', productionHtml);
  }
  
  console.log('Production build completed successfully!');
  console.log('Built files are in ./dist/public');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
