# تصميم API المفصل لمشروع EduSpark

هذا المستند يقدم تفصيلاً لنقاط النهاية (API Endpoints) لمشروع "منصة التعلّم الذكي EduSpark"، بما في ذلك طرق HTTP، معلمات الطلب (Request Parameters)، وهياكل الاستجابة (Response Structures) المتوقعة.

## 1. نقاط نهاية المصادقة (Auth Endpoints)

*   **المسؤول:** NextAuth.js (مع نقاط نهاية مخصصة للتسجيل واستعادة كلمة المرور)
*   **النقاط:**
    *   `POST /api/auth/register`
        *   **الوصف:** تسجيل مستخدم جديد.
        *   **الطلب:**
            ```json
            {
              "name": "string",
              "email": "string (email format)",
              "password": "string (min 8 chars)"
            }
            ```
        *   **الاستجابة (نجاح 201):**
            ```json
            {
              "message": "User registered successfully",
              "userId": "string"
            }
            ```
        *   **الاستجابة (خطأ 400/409):**
            ```json
            {
              "error": "string"
            }
            ```
    *   `POST /api/auth/signin`
        *   **الوصف:** تسجيل دخول المستخدم.
        *   **الطلب:**
            ```json
            {
              "email": "string",
              "password": "string"
            }
            ```
        *   **الاستجابة (نجاح 200):** (تُدار بواسطة NextAuth.js، عادةً ما تعيد توجيه أو جلسة)
            ```json
            {
              "user": {
                "id": "string",
                "email": "string",
                "name": "string",
                "role": "STUDENT | ADMIN"
              }
            }
            ```
        *   **الاستجابة (خطأ 401):**
            ```json
            {
              "error": "Invalid credentials"
            }
            ```
    *   `GET /api/auth/session`
        *   **الوصف:** جلب معلومات الجلسة الحالية للمستخدم.
        *   **الطلب:** لا يوجد.
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "user": {
                "id": "string",
                "email": "string",
                "name": "string",
                "role": "STUDENT | ADMIN"
              },
              "expires": "string (ISO date)"
            }
            ```
        *   **الاستجابة (خطأ 401):**
            ```json
            {
              "error": "Unauthorized"
            }
            ```
    *   `POST /api/auth/forgot-password`
        *   **الوصف:** طلب إعادة تعيين كلمة المرور.
        *   **الطلب:**
            ```json
            {
              "email": "string"
            }
            ```
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "message": "Password reset link sent to email"
            }
            ```

## 2. نقاط نهاية إدارة المستخدمين (Admin - User Management Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة المسؤول).
*   **النقاط:**
    *   `GET /api/admin/users`
        *   **الوصف:** جلب قائمة بجميع المستخدمين.
        *   **الطلب:** (اختياري) `?role=STUDENT|ADMIN`, `?page=int`, `?limit=int`
        *   **الاستجابة (نجاح 200):**
            ```json
            [
              {
                "id": "string",
                "name": "string",
                "email": "string",
                "role": "STUDENT | ADMIN",
                "createdAt": "ISO date"
              }
            ]
            ```
    *   `GET /api/admin/users/[id]`
        *   **الوصف:** جلب تفاصيل مستخدم معين.
        *   **الطلب:** لا يوجد (ID في المسار).
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "id": "string",
              "name": "string",
              "email": "string",
              "role": "STUDENT | ADMIN",
              "createdAt": "ISO date",
              "updatedAt": "ISO date"
            }
            ```
        *   **الاستجابة (خطأ 404):**
            ```json
            {
              "error": "User not found"
            }
            ```
    *   `PUT /api/admin/users/[id]`
        *   **الوصف:** تعديل بيانات مستخدم (تفعيل/تعطيل، تغيير الدور).
        *   **الطلب:**
            ```json
            {
              "name": "string (optional)",
              "email": "string (optional)",
              "role": "STUDENT | ADMIN (optional)"
            }
            ```
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "message": "User updated successfully",
              "user": { ...updated user object... }
            }
            ```
        *   **الاستجابة (خطأ 400/404):**
            ```json
            {
              "error": "string"
            }
            ```
    *   `DELETE /api/admin/users/[id]`
        *   **الوصف:** حذف مستخدم.
        *   **الطلب:** لا يوجد (ID في المسار).
        *   **الاستجابة (نجاح 204):** لا يوجد محتوى.
        *   **الاستجابة (خطأ 404):**
            ```json
            {
              "error": "User not found"
            }
            ```

## 3. نقاط نهاية الدورات التعليمية (Courses Endpoints)

### أ. نقاط نهاية الدورات العامة/للطلاب (Public/Student - Courses)

*   **المسؤول:** Next.js API Routes (يمكن الوصول إليها للطلاب المصادق عليهم، وبعضها قد يكون عامًا).
*   **النقاط:**
    *   `GET /api/courses`
        *   **الوصف:** جلب قائمة بالدورات المتاحة والمنشورة.
        *   **الطلب:** (اختياري) `?page=int`, `?limit=int`, `?search=string`
        *   **الاستجابة (نجاح 200):**
            ```json
            [
              {
                "id": "string",
                "title": "string",
                "description": "string",
                "authorName": "string",
                "published": true,
                "lessonsCount": "int"
              }
            ]
            ```
    *   `GET /api/courses/[id]`
        *   **الوصف:** جلب تفاصيل دورة معينة ومحتواها (الدروس).
        *   **الطلب:** لا يوجد (ID في المسار).
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "id": "string",
              "title": "string",
              "description": "string",
              "published": true,
              "author": { "id": "string", "name": "string" },
              "lessons": [
                {
                  "id": "string",
                  "title": "string",
                  "order": "int"
                }
              ]
            }
            ```
        *   **الاستجابة (خطأ 404):**
            ```json
            {
              "error": "Course not found"
            }
            ```

### ب. نقاط نهاية إدارة الدورات (Admin - Courses Management)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة المسؤول).
*   **النقاط:**
    *   `POST /api/admin/courses`
        *   **الوصف:** إنشاء دورة جديدة.
        *   **الطلب:**
            ```json
            {
              "title": "string",
              "description": "string (optional)",
              "published": "boolean (optional, default false)"
            }
            ```
        *   **الاستجابة (نجاح 201):**
            ```json
            {
              "message": "Course created successfully",
              "course": { ...new course object... }
            }
            ```
    *   `PUT /api/admin/courses/[id]`
        *   **الوصف:** تعديل دورة موجودة.
        *   **الطلب:**
            ```json
            {
              "title": "string (optional)",
              "description": "string (optional)",
              "published": "boolean (optional)"
            }
            ```
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "message": "Course updated successfully",
              "course": { ...updated course object... }
            }
            ```
    *   `DELETE /api/admin/courses/[id]`
        *   **الوصف:** حذف دورة.
        *   **الطلب:** لا يوجد (ID في المسار).
        *   **الاستجابة (نجاح 204):** لا يوجد محتوى.

## 4. نقاط نهاية إدارة الدروس (Admin - Lesson Management Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة المسؤول).
*   **النقاط:**
    *   `POST /api/admin/courses/[courseId]/lessons`
        *   **الوصف:** إنشاء درس جديد لدورة معينة.
        *   **الطلب:**
            ```json
            {
              "title": "string",
              "content": "string (rich text, e.g., HTML/Markdown)",
              "order": "int (optional, will be auto-assigned if not provided)"
            }
            ```
        *   **الاستجابة (نجاح 201):**
            ```json
            {
              "message": "Lesson created successfully",
              "lesson": { ...new lesson object... }
            }
            ```
    *   `PUT /api/admin/lessons/[lessonId]`
        *   **الوصف:** تعديل درس موجود.
        *   **الطلب:**
            ```json
            {
              "title": "string (optional)",
              "content": "string (optional)",
              "order": "int (optional)"
            }
            ```
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "message": "Lesson updated successfully",
              "lesson": { ...updated lesson object... }
            }
            ```
    *   `DELETE /api/admin/lessons/[lessonId]`
        *   **الوصف:** حذف درس.
        *   **الطلب:** لا يوجد (ID في المسار).
        *   **الاستجابة (نجاح 204):** لا يوجد محتوى.

## 5. نقاط نهاية تفاعل LLM (LLM Interaction Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة الطالب).
*   **النقاط:**
    *   `POST /api/llm/chat`
        *   **الوصف:** إرسال سؤال والحصول على إجابة من LLM مع سياق الدرس.
        *   **الطلب:**
            ```json
            {
              "lessonId": "string", // ID of the current lesson for context
              "question": "string"
            }
            ```
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "response": "string (LLM's answer)"
            }
            ```
        *   **الاستجابة (خطأ 400/500):**
            ```json
            {
              "error": "string"
            }
            ```
    *   `POST /api/llm/summarize`
        *   **الوصف:** تلخيص نص معين باستخدام LLM.
        *   **الطلب:**
            ```json
            {
              "text": "string",
              "lessonId": "string (optional, for context logging)"
            }
            ```
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "summary": "string (LLM's summary)"
            }
            ```
    *   `POST /api/llm/write-assist` (اختياري)
        *   **الوصف:** مساعدة الطلاب في صياغة إجابات أو مقالات قصيرة.
        *   **الطلب:**
            ```json
            {
              "prompt": "string", // User's initial text/request
              "lessonId": "string (optional, for context logging)"
            }
            ```
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "assistedText": "string (LLM's generated text)"
            }
            ```

## 6. نقاط نهاية تقدم الطلاب (Student Progress Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة الطالب).
*   **النقاط:**
    *   `GET /api/student/progress`
        *   **الوصف:** جلب تقدم الطالب في جميع الدورات.
        *   **الطلب:** لا يوجد.
        *   **الاستجابة (نجاح 200):**
            ```json
            [
              {
                "courseId": "string",
                "courseTitle": "string",
                "progress": "json (e.g., { 'completedLessons': ['id1', 'id2'] })",
                "totalLessons": "int",
                "completedLessonsCount": "int"
              }
            ]
            ```
    *   `POST /api/student/progress/complete-lesson`
        *   **الوصف:** لتسجيل إكمال درس معين.
        *   **الطلب:**
            ```json
            {
              "lessonId": "string",
              "courseId": "string"
            }
            ```
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "message": "Lesson marked as complete",
              "progress": { ...updated progress object... }
            }
            ```
        *   **الاستجابة (خطأ 400/404):**
            ```json
            {
              "error": "string"
            }
            ```
    *   `GET /api/student/progress/course/[courseId]`
        *   **الوصف:** جلب تقدم الطالب في دورة معينة.
        *   **الطلب:** لا يوجد (ID في المسار).
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "courseId": "string",
              "courseTitle": "string",
              "progress": "json",
              "totalLessons": "int",
              "completedLessonsCount": "int"
            }
            ```

## 7. نقاط نهاية تكوين LLM (Admin - LLM Configuration Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة المسؤول).
*   **النقاط:**
    *   `PUT /api/admin/llm/config`
        *   **الوصف:** لتحديث مفتاح API للـ LLM.
        *   **الطلب:**
            ```json
            {
              "openAIApiKey": "string"
            }
            ```
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "message": "LLM configuration updated"
            }
            ```
    *   `GET /api/admin/llm/config`
        *   **الوصف:** لجلب تكوين LLM الحالي (بدون عرض المفتاح).
        *   **الطلب:** لا يوجد.
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "configured": "boolean" // true if API key is set
            }
            ```
    *   `PUT /api/admin/llm/prompts` (اختياري)
        *   **الوصف:** لتعديل الأوامر (Prompts) الأساسية المستخدمة في تفاعلات الطلاب.
        *   **الطلب:**
            ```json
            {
              "chatPromptTemplate": "string",
              "summarizePromptTemplate": "string"
            }
            ```
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "message": "LLM prompts updated"
            }
            ```

## 8. نقاط نهاية سجلات LLM والتحليلات (Admin - LLM Logs & Analytics Endpoints)

*   **المسؤول:** Next.js API Routes (يتطلب مصادقة المسؤول).
*   **النقاط:**
    *   `GET /api/admin/llm/logs` (اختياري)
        *   **الوصف:** جلب سجلات تفاعل LLM.
        *   **الطلب:** (اختياري) `?userId=string`, `?lessonId=string`, `?page=int`, `?limit=int`
        *   **الاستجابة (نجاح 200):**
            ```json
            [
              {
                "id": "string",
                "userId": "string",
                "userName": "string",
                "prompt": "string",
                "response": "string",
                "lessonId": "string (optional)",
                "lessonTitle": "string (optional)",
                "timestamp": "ISO date",
                "cost": "float (optional)"
              }
            ]
            ```
    *   `GET /api/admin/analytics/users` (اختياري)
        *   **الوصف:** جلب عدد المستخدمين المسجلين.
        *   **الطلب:** لا يوجد.
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "totalUsers": "int",
              "studentsCount": "int",
              "adminsCount": "int"
            }
            ```
    *   `GET /api/admin/analytics/courses` (اختياري)
        *   **الوصف:** جلب عدد الدورات المنشورة.
        *   **الطلب:** لا يوجد.
        *   **الاستجابة (نجاح 200):**
            ```json
            {
              "totalCourses": "int",
              "publishedCourses": "int",
              "draftCourses": "int"
            }