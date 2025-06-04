#!/usr/bin/env node

/**
 * فحص إعداد منصة فتح للتعلّم الذكي
 * يتحقق من وجود جميع المتغيرات المطلوبة والإعدادات الأساسية
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 فحص إعداد منصة فتح للتعلّم الذكي...\n');

// فحص ملف .env
function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ ملف .env غير موجود');
    console.log('💡 قم بتشغيل: cp .env.example .env\n');
    return false;
  }
  
  console.log('✅ ملف .env موجود');
  
  // قراءة محتوى ملف .env
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    if (line.includes('=') && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      envVars[key] = value.replace(/"/g, '');
    }
  });
  
  // فحص المتغيرات المطلوبة
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];
  
  const optionalVars = [
    'GEMINI_API_KEY',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];
  
  let allRequired = true;
  
  console.log('\n📋 فحص المتغيرات المطلوبة:');
  requiredVars.forEach(varName => {
    if (envVars[varName] && envVars[varName].length > 0) {
      console.log(`✅ ${varName}: موجود`);
    } else {
      console.log(`❌ ${varName}: مفقود أو فارغ`);
      allRequired = false;
    }
  });
  
  console.log('\n📋 فحص المتغيرات الاختيارية:');
  optionalVars.forEach(varName => {
    if (envVars[varName] && envVars[varName].length > 0) {
      console.log(`✅ ${varName}: موجود`);
    } else {
      console.log(`⚠️  ${varName}: غير مُعرّف (اختياري)`);
    }
  });
  
  return allRequired;
}

// فحص ملفات المشروع الأساسية
function checkProjectFiles() {
  console.log('\n📁 فحص ملفات المشروع:');
  
  const requiredFiles = [
    'package.json',
    'prisma/schema.prisma',
    'src/app/layout.tsx',
    'src/lib/auth.ts',
    'src/lib/prisma.ts'
  ];
  
  let allFilesExist = true;
  
  requiredFiles.forEach(filePath => {
    if (fs.existsSync(path.join(process.cwd(), filePath))) {
      console.log(`✅ ${filePath}: موجود`);
    } else {
      console.log(`❌ ${filePath}: مفقود`);
      allFilesExist = false;
    }
  });
  
  return allFilesExist;
}

// فحص node_modules
function checkDependencies() {
  console.log('\n📦 فحص التبعيات:');
  
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');
  
  if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ node_modules: موجود');
    return true;
  } else {
    console.log('❌ node_modules: مفقود');
    console.log('💡 قم بتشغيل: npm install');
    return false;
  }
}

// تشغيل الفحوصات
async function runChecks() {
  const envOk = checkEnvFile();
  const filesOk = checkProjectFiles();
  const depsOk = checkDependencies();
  
  console.log('\n' + '='.repeat(50));
  
  if (envOk && filesOk && depsOk) {
    console.log('🎉 الإعداد مكتمل! يمكنك تشغيل المشروع الآن');
    console.log('💡 قم بتشغيل: npm run dev');
  } else {
    console.log('⚠️  الإعداد غير مكتمل. يرجى إصلاح المشاكل أعلاه');
    console.log('📖 راجع ملف SETUP_GUIDE.md للمساعدة');
  }
  
  console.log('\n🔗 روابط مفيدة:');
  console.log('- Gemini API: https://makersuite.google.com/app/apikey');
  console.log('- الوثائق: ./project_documents/');
  console.log('- دليل الإعداد: ./SETUP_GUIDE.md');
}

runChecks().catch(console.error);
