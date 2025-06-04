# دليل الإعداد السريع - منصة فتح للتعلّم الذكي 🚀

## 🔧 إصلاح المشاكل الحالية

### 1. إعداد متغيرات البيئة

```bash
# انسخ ملف .env.example إلى .env
cp .env.example .env
```

**املأ المتغيرات التالية في ملف `.env`:**

#### أ. قاعدة البيانات (مطلوب)
```env
DATABASE_URL="mysql://root:@localhost:3306/fateh_platform_db"
```

#### ب. NextAuth (مطلوب)
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="fateh-platform-secret-key-2025-very-secure-random-string"
```

#### ج. Gemini AI (مطلوب للمساعد الذكي)
1. اذهب إلى: https://makersuite.google.com/app/apikey
2. سجل الدخول بحساب Google
3. انقر على "Create API Key"
4. انسخ المفتاح وضعه في:
```env
GEMINI_API_KEY="your-actual-gemini-api-key-here"
```

#### د. Google OAuth (اختياري)
```env
# اتركها فارغة إذا لم تكن تريد استخدام تسجيل الدخول عبر Google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 2. إعداد قاعدة البيانات

```bash
# تأكد من تشغيل MySQL (XAMPP أو أي خادم آخر)
# ثم قم بتشغيل الأوامر التالية:

# إنشاء قاعدة البيانات وتطبيق المخطط
npm run db:push

# إنشاء البيانات التجريبية
npm run db:seed

# إنشاء بيانات نظام الهولاكراسي
npm run db:seed-holacracy
```

### 3. تشغيل المشروع

```bash
# تثبيت المكتبات (إذا لم تكن مثبتة)
npm install

# تشغيل الخادم التطويري
npm run dev
```

## 🔍 حل المشاكل الشائعة

### مشكلة: `[next-auth][warn][NEXTAUTH_URL]`
**الحل:** تأكد من وجود `NEXTAUTH_URL="http://localhost:3000"` في ملف `.env`

### مشكلة: `[next-auth][warn][NO_SECRET]`
**الحل:** تأكد من وجود `NEXTAUTH_SECRET` في ملف `.env`

### مشكلة: `JWT_SESSION_ERROR`
**الحل:** احذف ملفات الكوكيز من المتصفح أو استخدم نافذة خاصة

### مشكلة: Hydration Mismatch
**الحل:** تم إصلاحها في `ThemeProvider.tsx` - أعد تشغيل الخادم

### مشكلة: قاعدة البيانات لا تعمل
**الحل:** 
1. تأكد من تشغيل MySQL
2. تأكد من صحة `DATABASE_URL`
3. قم بتشغيل `npm run db:push`

## 🎯 بيانات تسجيل الدخول التجريبية

بعد تشغيل `npm run db:seed`:

**المدير:**
- البريد: `admin@fateh.com`
- كلمة المرور: `admin123`

**الطالب:**
- البريد: `student@fateh.com`
- كلمة المرور: `student123`

## 🌟 الخطوات التالية

1. **اختبر تسجيل الدخول** بالبيانات التجريبية
2. **جرب المساعد الذكي** (يحتاج مفتاح Gemini API)
3. **استكشف لوحة التحكم الإدارية** على `/admin`
4. **اقرأ الوثائق** في مجلد `project_documents/`

## 🆘 إذا واجهت مشاكل

1. تأكد من تشغيل MySQL
2. تأكد من صحة متغيرات البيئة
3. امسح cache المتصفح
4. أعد تشغيل الخادم التطويري
5. تحقق من console للأخطاء

## 📞 الدعم

إذا استمرت المشاكل، تحقق من:
- ملفات الـ logs في console
- إعدادات قاعدة البيانات
- صحة مفاتيح API
