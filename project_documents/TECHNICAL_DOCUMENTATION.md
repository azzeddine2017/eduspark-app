# الوثائق التقنية - منصة فتح للتعلّم الذكي 🛠️

## نظرة عامة تقنية

منصة فتح مبنية باستخدام أحدث التقنيات لضمان الأداء العالي والأمان والقابلية للتوسع.

## 🏗️ المعمارية العامة

### Frontend Architecture
```
Next.js 15 (App Router)
├── React 18
├── TypeScript
├── Tailwind CSS
└── React Hook Form + Zod
```

### Backend Architecture
```
Next.js API Routes
├── Prisma ORM
├── NextAuth.js
├── bcryptjs
└── Google Gemini AI
```

### Database Architecture
```
MySQL 8.0
├── Prisma Schema
├── Relations & Indexes
└── Migration System
```

## 🔧 التقنيات المستخدمة

### Frontend Technologies

#### Next.js 15
- **App Router**: نظام التوجيه الجديد
- **Server Components**: تحسين الأداء
- **Client Components**: التفاعل الديناميكي
- **API Routes**: خدمات Backend مدمجة

#### TypeScript
- **Type Safety**: أمان الأنواع
- **IntelliSense**: دعم IDE محسن
- **Compile-time Checks**: فحص الأخطاء مبكراً
- **Better Refactoring**: إعادة هيكلة آمنة

#### Tailwind CSS
- **Utility-first**: فئات CSS جاهزة
- **Responsive Design**: تصميم متجاوب
- **Dark Mode**: دعم الوضع المظلم
- **RTL Support**: دعم الكتابة من اليمين لليسار

#### React Hook Form + Zod
- **Form Validation**: التحقق من صحة النماذج
- **Type-safe Schemas**: مخططات آمنة
- **Performance**: أداء محسن
- **User Experience**: تجربة مستخدم أفضل

### Backend Technologies

#### Prisma ORM
- **Type-safe Database Access**: وصول آمن لقاعدة البيانات
- **Auto-generated Client**: عميل مولد تلقائياً
- **Migration System**: نظام ترحيل البيانات
- **Query Optimization**: تحسين الاستعلامات

#### NextAuth.js
- **Multiple Providers**: مقدمي خدمة متعددين
- **JWT Tokens**: رموز آمنة
- **Session Management**: إدارة الجلسات
- **Security**: أمان متقدم

#### bcryptjs
- **Password Hashing**: تشفير كلمات المرور
- **Salt Rounds**: جولات الملح للأمان
- **Secure Storage**: تخزين آمن

### AI Integration

#### Google Gemini 1.5 Flash
- **Natural Language Processing**: معالجة اللغة الطبيعية
- **Arabic Language Support**: دعم اللغة العربية
- **Fast Response**: استجابة سريعة
- **Cost-effective**: فعال من ناحية التكلفة

## 📊 قاعدة البيانات

### Schema Design

#### Core Tables
```sql
-- المستخدمون
User {
  id: String (Primary Key)
  email: String (Unique)
  name: String
  password: String (Hashed)
  role: UserRole (Enum)
  isActive: Boolean
  avatar: String?
  createdAt: DateTime
  updatedAt: DateTime
}

-- الدورات
Course {
  id: String (Primary Key)
  title: String
  description: Text
  content: JSON
  published: Boolean
  authorId: String (Foreign Key)
  createdAt: DateTime
  updatedAt: DateTime
}

-- الدروس
Lesson {
  id: String (Primary Key)
  title: String
  content: JSON
  courseId: String (Foreign Key)
  order: Int
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Holacracy Tables
```sql
-- الدوائر
Circle {
  id: String (Primary Key)
  name: String
  purpose: Text
  domain: Text?
  parentId: String? (Self Reference)
  isActive: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}

-- الأدوار
Role {
  id: String (Primary Key)
  name: String
  purpose: Text
  domain: Text?
  circleId: String (Foreign Key)
  isActive: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}

-- تعيين الأدوار
RoleAssignment {
  id: String (Primary Key)
  userId: String (Foreign Key)
  roleId: String (Foreign Key)
  startDate: DateTime
  endDate: DateTime?
  isActive: Boolean
  createdAt: DateTime
}

-- القرارات
Decision {
  id: String (Primary Key)
  title: String
  description: Text
  proposerId: String (Foreign Key)
  circleId: String? (Foreign Key)
  status: DecisionStatus (Enum)
  decidedAt: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Relationships
- **One-to-Many**: User → Courses, Course → Lessons
- **Many-to-Many**: User ↔ Courses (Enrollments)
- **Self-Reference**: Circle → Parent Circle
- **Hierarchical**: Circle → Roles → Assignments

### Indexes
```sql
-- Performance Indexes
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_course_author ON Course(authorId);
CREATE INDEX idx_lesson_course ON Lesson(courseId);
CREATE INDEX idx_enrollment_user_course ON Enrollment(userId, courseId);
CREATE INDEX idx_role_assignment_user ON RoleAssignment(userId);
```

## 🔐 الأمان والمصادقة

### Authentication Flow
1. **User Registration**: تسجيل المستخدم
2. **Password Hashing**: تشفير كلمة المرور
3. **Email Verification**: التحقق من البريد الإلكتروني
4. **Login Process**: عملية تسجيل الدخول
5. **JWT Token Generation**: إنتاج رمز JWT
6. **Session Management**: إدارة الجلسة

### Authorization System
```typescript
// نظام الصلاحيات
const PERMISSIONS = {
  ADMIN: {
    canManageUsers: true,
    canManageCourses: true,
    canManageHolacracy: true,
    // ... جميع الصلاحيات
  },
  CONTENT_CREATOR: {
    canCreateCourses: true,
    canEditOwnCourses: true,
    // ... صلاحيات محددة
  }
  // ... باقي الأدوار
}
```

### Security Measures
- **Password Hashing**: bcrypt مع salt rounds
- **JWT Tokens**: رموز آمنة مع انتهاء صلاحية
- **CSRF Protection**: حماية من CSRF
- **Input Validation**: التحقق من صحة المدخلات
- **SQL Injection Prevention**: منع حقن SQL
- **XSS Protection**: حماية من XSS

## 🚀 الأداء والتحسين

### Frontend Optimization
- **Code Splitting**: تقسيم الكود
- **Lazy Loading**: التحميل الكسول
- **Image Optimization**: تحسين الصور
- **Bundle Analysis**: تحليل الحزم

### Backend Optimization
- **Database Indexing**: فهرسة قاعدة البيانات
- **Query Optimization**: تحسين الاستعلامات
- **Caching Strategy**: استراتيجية التخزين المؤقت
- **API Rate Limiting**: تحديد معدل API

### Monitoring
```typescript
// مراقبة الأداء
const performanceMetrics = {
  responseTime: 'متوسط وقت الاستجابة',
  throughput: 'معدل المعالجة',
  errorRate: 'معدل الأخطاء',
  uptime: 'وقت التشغيل'
}
```

## 🔄 CI/CD والنشر

### Development Workflow
```bash
# التطوير المحلي
npm run dev

# الاختبار
npm run test
npm run build

# النشر
npm run start
```

### Environment Variables
```env
# قاعدة البيانات
DATABASE_URL="mysql://user:pass@localhost:3306/db"

# المصادقة
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# الذكاء الاصطناعي
GEMINI_API_KEY="your-gemini-api-key"

# البيئة
NODE_ENV="production"
```

## 📱 التوافق والاستجابة

### Browser Support
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Responsiveness
- **Breakpoints**: نقاط التوقف المتجاوبة
- **Touch Optimization**: تحسين اللمس
- **Performance**: أداء محسن للهواتف

### RTL Support
- **Arabic Interface**: واجهة عربية كاملة
- **Text Direction**: اتجاه النص
- **Layout Mirroring**: انعكاس التخطيط

## 🧪 الاختبار

### Testing Strategy
```typescript
// أنواع الاختبارات
const testTypes = {
  unit: 'اختبارات الوحدة',
  integration: 'اختبارات التكامل',
  e2e: 'اختبارات شاملة',
  performance: 'اختبارات الأداء'
}
```

### Test Files Structure
```
tests/
├── unit/           # اختبارات الوحدة
├── integration/    # اختبارات التكامل
├── e2e/           # اختبارات شاملة
└── fixtures/      # بيانات تجريبية
```

## 📊 المراقبة والتحليلات

### Logging System
```typescript
// نظام السجلات
const logLevels = {
  error: 'أخطاء النظام',
  warn: 'تحذيرات',
  info: 'معلومات عامة',
  debug: 'تفاصيل التطوير'
}
```

### Analytics Tracking
- **User Behavior**: سلوك المستخدمين
- **Performance Metrics**: مقاييس الأداء
- **Error Tracking**: تتبع الأخطاء
- **Usage Statistics**: إحصائيات الاستخدام

## 🔧 أدوات التطوير

### Development Tools
- **VS Code**: محرر الكود المفضل
- **Prettier**: تنسيق الكود
- **ESLint**: فحص جودة الكود
- **TypeScript**: فحص الأنواع

### Database Tools
- **Prisma Studio**: واجهة قاعدة البيانات
- **MySQL Workbench**: إدارة قاعدة البيانات
- **Database Migrations**: ترحيل البيانات

## 📚 الموارد والمراجع

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Best Practices
- **Code Organization**: تنظيم الكود
- **Component Design**: تصميم المكونات
- **State Management**: إدارة الحالة
- **Error Handling**: معالجة الأخطاء

---

**الوثائق التقنية لمنصة فتح - تقنيات حديثة لتعليم متطور** 🌟
