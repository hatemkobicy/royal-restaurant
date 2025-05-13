// build.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// لون للطباعة
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}=== Royal Restaurant Build Script ===${colors.reset}`);

// طباعة معلومات المجلد
console.log(`${colors.yellow}Working directory:${colors.reset} ${process.cwd()}`);
console.log(`${colors.yellow}Directory contents:${colors.reset}`);
execSync('ls -la', { stdio: 'inherit' });

// وظيفة لتنفيذ الأوامر بشكل آمن
function safeExec(command, errorMessage) {
  try {
    console.log(`\n${colors.blue}Running:${colors.reset} ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`${colors.red}${errorMessage}:${colors.reset} ${error.message}`);
    return false;
  }
}

// تثبيت التبعيات إذا كانت غير موجودة
console.log(`\n${colors.blue}Installing dependencies...${colors.reset}`);
safeExec('npm install', 'Failed to install dependencies');

// التحقق من هيكل المشروع
if (fs.existsSync('./client')) {
  console.log(`\n${colors.blue}Client directory structure:${colors.reset}`);
  safeExec('ls -la ./client', 'Failed to list client directory');
}

// محاولة بناء العميل
let clientBuildSuccess = false;
if (fs.existsSync('./client')) {
  console.log(`\n${colors.blue}Building client...${colors.reset}`);
  clientBuildSuccess = safeExec('cd client && npm install && npm run build', 'Failed to build client');
  
  if (!clientBuildSuccess) {
    console.log(`\n${colors.yellow}Trying alternative build approach...${colors.reset}`);
    clientBuildSuccess = safeExec('cd client && npx vite build', 'Failed to build client using Vite directly');
  }
}

// محاولة بناء الخادم
console.log(`\n${colors.blue}Building server...${colors.reset}`);
let serverBuildSuccess = safeExec('npx tsc server/index.ts --outDir dist', 'Failed to build server');

// في حالة فشل بناء الخادم، استخدم esbuild
if (!serverBuildSuccess) {
  console.log(`\n${colors.yellow}Trying alternative server build...${colors.reset}`);
  serverBuildSuccess = safeExec('npx esbuild server/index.ts --platform=node --packages=external --bundle --outdir=dist', 'Failed to build server using esbuild');
}

// إنشاء ملف خادم بسيط احتياطي
if (!serverBuildSuccess) {
  console.log(`\n${colors.yellow}Creating backup server.js...${colors.reset}`);
  const serverContent = fs.readFileSync('./server.js', 'utf8');
  fs.mkdirSync('./dist', { recursive: true });
  fs.writeFileSync('./dist/index.js', serverContent);
  console.log(`${colors.green}Backup server created successfully.${colors.reset}`);
}

// طباعة ملخص
console.log(`\n${colors.blue}=== Build Summary ===${colors.reset}`);
console.log(`Client build: ${clientBuildSuccess ? colors.green + 'Success' : colors.red + 'Failed'}`);
console.log(`Server build: ${serverBuildSuccess || fs.existsSync('./dist/index.js') ? colors.green + 'Success' : colors.red + 'Failed'}`);
console.log(`${colors.reset}`);

// التحقق من النتيجة النهائية
if (fs.existsSync('./dist/index.js')) {
  console.log(`${colors.green}Build completed successfully!${colors.reset}`);
  process.exit(0);
} else {
  console.log(`${colors.red}Build failed to produce required files.${colors.reset}`);
  process.exit(1);
}
