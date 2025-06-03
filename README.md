# منصة فتح للتعلّم الذكي

منصة تعليمية ذكية تفتح لك أبواب المعرفة بتقنيات الذكاء الاصطناعي المتطورة

## 🚀 الميزات الرئيسية

- **مساعد ذكي تفاعلي**: احصل على إجابات فورية لأسئلتك من مساعد ذكي متطور
- **أدوات تلخيص النصوص**: لخص النصوص الطويلة بذكاء
- **تتبع التقدم**: راقب تقدمك في التعلم مع إحصائيات مفصلة
- **واجهة عربية**: دعم كامل للغة العربية مع RTL
- **إدارة شاملة**: لوحة تحكم متقدمة للمسؤولين

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API
- **Styling**: Tailwind CSS مع دعم RTL

## 📋 متطلبات التشغيل

- Node.js 18+
- PostgreSQL 14+
- حساب OpenAI API

## ⚡ التثبيت والتشغيل

### 1. تثبيت المكتبات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
انسخ ملف `.env.example` إلى `.env` وأضف القيم المطلوبة:

```bash
cp .env.example .env
```

املأ المتغيرات التالية في ملف `.env`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fateh_platform_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (اختياري)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"
```

### 3. إعداد قاعدة البيانات
```bash
# إنشاء قاعدة البيانات وتطبيق المخطط
npm run db:push

# إنشاء البيانات التجريبية
npm run db:seed
```

### 4. تشغيل المشروع
```bash
npm run dev
```

المشروع سيعمل على: http://localhost:3000

## 👥 بيانات تسجيل الدخول التجريبية

بعد تشغيل `npm run db:seed`:

**المدير:**
- البريد الإلكتروني: `admin@fateh.com`
- كلمة المرور: `admin123`

**الطالب:**
- البريد الإلكتروني: `student@fateh.com`
- كلمة المرور: `student123`

## 🔧 أوامر مفيدة

```bash
# تطوير
npm run dev              # تشغيل الخادم التطويري
npm run build           # بناء المشروع للإنتاج
npm run start           # تشغيل المشروع المبني

# قاعدة البيانات
npm run db:generate     # توليد عميل Prisma
npm run db:push         # تطبيق المخطط على قاعدة البيانات
npm run db:migrate      # إنشاء وتطبيق migration
npm run db:studio       # فتح Prisma Studio
npm run db:seed         # إنشاء البيانات التجريبية

# جودة الكود
npm run lint            # فحص الكود
```

## 🌟 الميزات المتقدمة

### المساعد الذكي
- دعم السياق من محتوى الدرس
- حدود استخدام يومية (10 للطلاب، 50 للمسؤولين)
- تسجيل التفاعلات وتتبع التكلفة

### أداة تلخيص النصوص
- ثلاثة مستويات للتلخيص (قصير، متوسط، طويل)
- إحصائيات الضغط والتوفير
- دعم النصوص العربية

### نظام الأدوار
- **طالب**: الوصول للدورات والمساعد الذكي
- **مسؤول**: إدارة كاملة للمحتوى والمستخدمين

## 🔒 الأمان

- تشفير كلمات المرور باستخدام bcrypt
- حماية APIs بنظام JWT
- تأمين مفاتيح API في متغيرات البيئة
- تطبيق مبدأ الصلاحيات الأدنى

---

**منصة فتح للتعلّم الذكي** - افتح آفاق التعلّم مع الذكاء الاصطناعي 🚀
