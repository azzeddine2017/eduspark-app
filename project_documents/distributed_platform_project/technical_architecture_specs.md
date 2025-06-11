# 🏗️ مواصفات البنية التقنية الموزعة
## مستند تفصيلي للمهمة T01.01

---

## 📋 **معلومات المهمة**

**رقم المهمة:** T01.01
**اسم المهمة:** تصميم البنية التقنية الموزعة
**الحالة:** قيد التنفيذ
**الأولوية:** عالية جداً
**المدة المقدرة:** 2 أسابيع
**المسؤول:** فريق التطوير التقني

---

## 🎯 **الأهداف المحددة**

### **الهدف الرئيسي:**
تصميم بنية تقنية قابلة للتوسع تدعم نظام العقد المحلية الموزعة مع ضمان الأداء والأمان

### **الأهداف الفرعية:**
1. **تصميم قاعدة البيانات الموزعة** - دعم 50+ عقدة محلية
2. **تصميم واجهات API** - تفاعل سلس بين العقد والمنصة المركزية
3. **تصميم نظام الأمان** - حماية البيانات والمعاملات
4. **تصميم نظام المراقبة** - تتبع الأداء والأخطاء

---

## 🏗️ **البنية التقنية المقترحة**

### **1. طبقة قاعدة البيانات (Database Layer)**

#### **قاعدة البيانات المركزية:**
```sql
-- جداول النظام المركزي
CREATE SCHEMA global_platform;

-- جدول العقد المحلية
CREATE TABLE global_platform.local_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  region VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  language VARCHAR(10) DEFAULT 'ar',
  currency VARCHAR(10) DEFAULT 'USD',
  timezone VARCHAR(50) DEFAULT 'UTC',
  status ENUM('active', 'inactive', 'pending', 'suspended') DEFAULT 'pending',
  database_url VARCHAR(500), -- رابط قاعدة البيانات المحلية
  api_endpoint VARCHAR(500), -- نقطة API للعقدة
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الشركاء العالمي
CREATE TABLE global_platform.global_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID REFERENCES global_platform.local_nodes(id),
  user_id UUID,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('owner', 'manager', 'instructor', 'support') NOT NULL,
  revenue_share DECIMAL(5,2) DEFAULT 0.00,
  status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
  contract_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المحتوى العالمي
CREATE TABLE global_platform.global_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_type ENUM('course', 'lesson', 'quiz', 'resource') NOT NULL,
  content_data JSONB NOT NULL,
  version VARCHAR(20) DEFAULT '1.0',
  is_distributable BOOLEAN DEFAULT true,
  target_languages TEXT[], -- اللغات المدعومة
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **قواعد البيانات المحلية:**
```sql
-- مخطط قاعدة البيانات لكل عقدة محلية
CREATE SCHEMA local_node;

-- جدول المستخدمين المحليين
CREATE TABLE local_node.local_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  global_user_id UUID, -- ربط مع النظام العالمي
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'instructor', 'admin') NOT NULL,
  profile_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول المحتوى المحلي
CREATE TABLE local_node.local_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  global_content_id UUID, -- ربط مع المحتوى العالمي
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content_data JSONB NOT NULL,
  is_customized BOOLEAN DEFAULT false,
  customization_data JSONB DEFAULT '{}',
  language VARCHAR(10) NOT NULL,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الإيرادات المحلية
CREATE TABLE local_node.local_revenues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revenue_type ENUM('subscription', 'course', 'consulting', 'workshop') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL,
  transaction_date DATE NOT NULL,
  user_id UUID REFERENCES local_node.local_users(id),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  synced_to_global BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **2. طبقة الخدمات (Services Layer)**

#### **خدمات النظام المركزي:**
```typescript
// services/global-platform.ts
export class GlobalPlatformService {
  // إدارة العقد المحلية
  async createNode(nodeData: CreateNodeInput): Promise<LocalNode> {
    // إنشاء عقدة محلية جديدة
    const node = await prisma.localNodes.create({
      data: {
        ...nodeData,
        databaseUrl: await this.createNodeDatabase(nodeData.slug),
        apiEndpoint: `https://${nodeData.slug}.fateh-platform.com`
      }
    });
    
    // إعداد قاعدة البيانات المحلية
    await this.setupNodeDatabase(node.id);
    
    // إنشاء حساب المدير الأول
    await this.createNodeAdmin(node.id, nodeData.adminEmail);
    
    return node;
  }

  // توزيع المحتوى العالمي
  async distributeContent(contentId: string, targetNodes?: string[]): Promise<void> {
    const content = await this.getGlobalContent(contentId);
    const nodes = targetNodes || await this.getAllActiveNodes();
    
    for (const nodeId of nodes) {
      await this.syncContentToNode(content, nodeId);
    }
  }

  // جمع الإحصائيات من العقد
  async collectNodeStatistics(): Promise<GlobalStatistics> {
    const nodes = await this.getAllActiveNodes();
    const statistics = {
      totalNodes: nodes.length,
      totalUsers: 0,
      totalRevenue: 0,
      nodeStatistics: []
    };

    for (const node of nodes) {
      const nodeStats = await this.getNodeStatistics(node.id);
      statistics.totalUsers += nodeStats.userCount;
      statistics.totalRevenue += nodeStats.revenue;
      statistics.nodeStatistics.push(nodeStats);
    }

    return statistics;
  }
}
```

#### **خدمات العقدة المحلية:**
```typescript
// services/local-node.ts
export class LocalNodeService {
  constructor(private nodeId: string) {}

  // مزامنة البيانات مع النظام المركزي
  async syncWithGlobal(): Promise<void> {
    // مزامنة المحتوى الجديد
    await this.syncGlobalContent();
    
    // إرسال الإحصائيات المحلية
    await this.sendStatisticsToGlobal();
    
    // مزامنة الإيرادات
    await this.syncRevenueData();
  }

  // إدارة المستخدمين المحليين
  async createLocalUser(userData: CreateUserInput): Promise<LocalUser> {
    const user = await this.localPrisma.localUsers.create({
      data: {
        ...userData,
        globalUserId: await this.createGlobalUserReference(userData)
      }
    });

    // إشعار النظام المركزي
    await this.notifyGlobalSystem('user_created', { userId: user.id });
    
    return user;
  }

  // تسجيل الإيرادات المحلية
  async recordRevenue(revenueData: RevenueInput): Promise<LocalRevenue> {
    const platformFee = this.calculatePlatformFee(revenueData.amount);
    
    const revenue = await this.localPrisma.localRevenues.create({
      data: {
        ...revenueData,
        platformFee,
        netAmount: revenueData.amount - platformFee
      }
    });

    // جدولة المزامنة مع النظام المركزي
    await this.scheduleGlobalSync('revenue', revenue.id);
    
    return revenue;
  }
}
```

### **3. طبقة واجهات API (API Layer)**

#### **واجهات API المركزية:**
```typescript
// api/global/nodes.ts
export default async function handler(req: NextRequest) {
  switch (req.method) {
    case 'GET':
      return await getNodes(req);
    case 'POST':
      return await createNode(req);
    case 'PUT':
      return await updateNode(req);
    case 'DELETE':
      return await deleteNode(req);
    default:
      return new Response('Method not allowed', { status: 405 });
  }
}

async function createNode(req: NextRequest) {
  try {
    const data = await req.json();
    const node = await globalPlatformService.createNode(data);
    
    return NextResponse.json({
      success: true,
      data: node,
      message: 'تم إنشاء العقدة المحلية بنجاح'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// api/global/content/distribute.ts
export async function POST(req: NextRequest) {
  try {
    const { contentId, targetNodes } = await req.json();
    
    await globalPlatformService.distributeContent(contentId, targetNodes);
    
    return NextResponse.json({
      success: true,
      message: 'تم توزيع المحتوى بنجاح'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

#### **واجهات API المحلية:**
```typescript
// api/local/sync.ts
export async function POST(req: NextRequest) {
  try {
    const nodeId = req.headers.get('x-node-id');
    const localNodeService = new LocalNodeService(nodeId);
    
    await localNodeService.syncWithGlobal();
    
    return NextResponse.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// api/local/revenue.ts
export async function POST(req: NextRequest) {
  try {
    const nodeId = req.headers.get('x-node-id');
    const revenueData = await req.json();
    
    const localNodeService = new LocalNodeService(nodeId);
    const revenue = await localNodeService.recordRevenue(revenueData);
    
    return NextResponse.json({
      success: true,
      data: revenue,
      message: 'تم تسجيل الإيراد بنجاح'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

### **4. نظام الأمان والمصادقة**

#### **مصادقة موزعة:**
```typescript
// lib/distributed-auth.ts
export class DistributedAuthService {
  // مصادقة عبر الشبكة العالمية
  async authenticateGlobalUser(token: string): Promise<GlobalUser | null> {
    try {
      const decoded = jwt.verify(token, process.env.GLOBAL_JWT_SECRET);
      const user = await this.getGlobalUser(decoded.userId);
      return user;
    } catch (error) {
      return null;
    }
  }

  // مصادقة محلية مع ربط عالمي
  async authenticateLocalUser(nodeId: string, credentials: LoginCredentials): Promise<AuthResult> {
    const localUser = await this.validateLocalCredentials(nodeId, credentials);
    
    if (localUser) {
      const globalToken = await this.generateGlobalToken(localUser.globalUserId);
      const localToken = await this.generateLocalToken(nodeId, localUser.id);
      
      return {
        success: true,
        globalToken,
        localToken,
        user: localUser
      };
    }
    
    return { success: false, error: 'بيانات الدخول غير صحيحة' };
  }

  // تفويض الصلاحيات الموزعة
  async authorizeAction(nodeId: string, userId: string, action: string): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(nodeId, userId);
    const requiredPermission = await this.getRequiredPermission(action);
    
    return userPermissions.includes(requiredPermission);
  }
}
```

---

## 🔧 **متطلبات التطوير**

### **التقنيات المطلوبة:**
- **Next.js 14+**: للواجهة الأمامية والخلفية
- **Prisma**: لإدارة قواعد البيانات
- **PostgreSQL**: قاعدة البيانات الرئيسية
- **Redis**: للتخزين المؤقت والجلسات
- **Docker**: لتوزيع العقد المحلية
- **JWT**: للمصادقة الموزعة

### **البنية التحتية:**
- **خوادم سحابية**: AWS أو Google Cloud
- **CDN**: لتوزيع المحتوى عالمياً
- **Load Balancers**: لتوزيع الأحمال
- **Monitoring**: لمراقبة الأداء والأخطاء

---

## 📊 **مؤشرات النجاح**

### **مؤشرات الأداء:**
- [ ] **سرعة الاستجابة**: أقل من 200ms للعمليات المحلية
- [ ] **وقت التشغيل**: 99.9% للنظام المركزي
- [ ] **قابلية التوسع**: دعم 100 عقدة محلية متزامنة
- [ ] **الأمان**: صفر اختراقات أمنية

### **مؤشرات الجودة:**
- [ ] **سهولة الاستخدام**: واجهات بديهية للشركاء
- [ ] **الموثوقية**: معدل أخطاء أقل من 0.1%
- [ ] **المرونة**: إضافة ميزات جديدة بسهولة
- [ ] **التوافق**: عمل سلس عبر جميع المتصفحات

---

**📅 تاريخ البدء:** يناير 2025
**📅 الموعد النهائي:** فبراير 2025
**👤 المسؤول:** فريق التطوير التقني
**🎯 النتيجة المتوقعة:** بنية تقنية قوية وقابلة للتوسع تدعم النمو العالمي
