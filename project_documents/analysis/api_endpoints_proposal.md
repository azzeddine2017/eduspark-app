# تصميم API الأولي المقترح لمشروع EduSpark

هذا المستند يقدم قائمة أولية بنقاط النهاية (API Endpoints) المقترحة لمشروع "منصة التعلّم الذكي EduSpark"، مع الإشارة إلى التقنيات المسؤولة عن إدارتها. سيتم تفصيل هذه النقاط لاحقًا لتشمل طرق HTTP (GET, POST, PUT, DELETE)، معلمات الطلب (Request Parameters)، وهياكل الاستجابة (Response Structures).

## 1. نقاط نهاية المصادقة (Auth Endpoints)

*   **المسؤول:** NextAuth.js
*   **النقاط المقترحة:**
    *   `/api/auth/signin`: لتسجيل الدخول.
    *   `/api/auth/signout`: لتسجيل الخروج.
    *   `/api/auth/callback/*`: لمعالجة ردود مزودي المصادقة (مثل Google).
    *   `/api/auth/session`: للحصول على معلومات الجلسة الحالية.
    *   `/api/auth/csrf`: للحصول على رمز CSRF.
    *   `/api/auth/register`: لتسجيل مستخدمين جدد (يمكن أن تكون نقطة نهاية مخصصة).
    *   `/api/auth/forgot-password`: لاستعادة كلمة المرور.

## 2. نقاط نهاية إدارة المستخدمين (Admin - User Management Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة المسؤول).
*   **النقاط المقترحة:**
    *   `GET /api/admin/users`: جلب قائمة بجميع المستخدمين.
    *   `GET /api/admin/users/[id]`: جلب تفاصيل مستخدم معين.
    *   `PUT /api/admin/users/[id]`: تعديل بيانات مستخدم (تفعيل/تعطيل، تغيير الدور).
    *   `DELETE /api/admin/users/[id]`: حذف مستخدم (يتطلب حذرًا).

## 3. نقاط نهاية الدورات التعليمية (Courses Endpoints)

### أ. نقاط نهاية الدورات العامة/للطلاب (Public/Student - Courses)

*   **المسؤول:** Next.js API Routes (يمكن الوصول إليها للطلاب المصادق عليهم، وبعضها قد يكون عامًا).
*   **النقاط المقترحة:**
    *   `GET /api/courses`: جلب قائمة بالدورات المتاحة (يمكن تصفيتها حسب حالة النشر).
    *   `GET /api/courses/[id]`: جلب تفاصيل دورة معينة ومحتواها (الدروس).

### ب. نقاط نهاية إدارة الدورات (Admin - Courses Management)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة المسؤول).
*   **النقاط المقترحة:**
    *   `POST /api/admin/courses`: إنشاء دورة جديدة.
    *   `PUT /api/admin/courses/[id]`: تعديل دورة موجودة.
    *   `DELETE /api/admin/courses/[id]`: حذف دورة.

## 4. نقاط نهاية إدارة الدروس (Admin - Lesson Management Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة المسؤول).
*   **النقاط المقترحة:**
    *   `POST /api/admin/courses/[courseId]/lessons`: إنشاء درس جديد لدورة معينة.
    *   `PUT /api/admin/lessons/[lessonId]`: تعديل درس موجود.
    *   `DELETE /api/admin/lessons/[lessonId]`: حذف درس.

## 5. نقاط نهاية تفاعل LLM (LLM Interaction Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة الطالب).
*   **النقاط المقترحة:**
    *   `POST /api/llm/chat`: لإرسال سؤال والحصول على إجابة من LLM (مع سياق الدرس).
    *   `POST /api/llm/summarize`: لتلخيص نص معين باستخدام LLM.
    *   `POST /api/llm/write-assist`: (اختياري) لمساعدة الكتابة.

## 6. نقاط نهاية تقدم الطلاب (Student Progress Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة الطالب).
*   **النقاط المقترحة:**
    *   `GET /api/student/progress`: جلب تقدم الطالب في جميع الدورات.
    *   `POST /api/student/progress/complete-lesson`: لتسجيل إكمال درس معين.
    *   `GET /api/student/progress/course/[courseId]`: جلب تقدم الطالب في دورة معينة.

## 7. نقاط نهاية تكوين LLM (Admin - LLM Configuration Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة المسؤول).
*   **النقاط المقترحة:**
    *   `PUT /api/admin/llm/config`: لتحديث مفتاح API للـ LLM.
    *   `GET /api/admin/llm/config`: لجلب تكوين LLM الحالي.
    *   `PUT /api/admin/llm/prompts`: (اختياري) لتعديل الأوامر (Prompts) الأساسية.

## 8. نقاط نهاية سجلات LLM والتحليلات (Admin - LLM Logs & Analytics Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة المسؤول).
*   **النقاط المقترحة:**
    *   `GET /api/admin/llm/logs`: (اختياري) جلب سجلات تفاعل LLM.
    *   `GET /api/admin/analytics/users`: (اختياري) جلب عدد المستخدمين المسجلين.
    *   `GET /api/admin/analytics/courses`: (اختياري) جلب عدد الدورات المنشورة.