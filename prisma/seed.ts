import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 بدء إنشاء البيانات التجريبية...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fateh.com' },
    update: {},
    create: {
      email: 'admin@fateh.com',
      name: 'مدير المنصة',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ تم إنشاء المدير:', admin.email)

  // Create student user
  const studentPassword = await bcrypt.hash('student123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'student@fateh.com' },
    update: {},
    create: {
      email: 'student@fateh.com',
      name: 'طالب تجريبي',
      password: studentPassword,
      role: 'STUDENT',
    },
  })

  console.log('✅ تم إنشاء الطالب:', student.email)

  // Create course categories
  const programmingCategory = await prisma.courseCategory.upsert({
    where: { name: 'البرمجة' },
    update: {},
    create: {
      name: 'البرمجة',
      description: 'دورات تعليم البرمجة وتطوير البرمجيات',
      color: '#3B82F6',
    },
  })

  const aiCategory = await prisma.courseCategory.upsert({
    where: { name: 'الذكاء الاصطناعي' },
    update: {},
    create: {
      name: 'الذكاء الاصطناعي',
      description: 'دورات الذكاء الاصطناعي وتعلم الآلة',
      color: '#8B5CF6',
    },
  })

  console.log('✅ تم إنشاء فئات الدورات')

  // Create sample courses
  const course1 = await prisma.course.create({
    data: {
      title: 'مقدمة في البرمجة بـ JavaScript',
      description: 'تعلم أساسيات البرمجة باستخدام لغة JavaScript من الصفر حتى الاحتراف. هذه الدورة مصممة للمبتدئين الذين يريدون دخول عالم البرمجة.',
      level: 'BEGINNER',
      isPublished: true,
      authorId: admin.id,
      duration: 480, // 8 hours
      categories: {
        connect: { id: programmingCategory.id }
      }
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'أساسيات الذكاء الاصطناعي',
      description: 'اكتشف عالم الذكاء الاصطناعي وتعلم المفاهيم الأساسية وتطبيقاتها في الحياة العملية.',
      level: 'INTERMEDIATE',
      isPublished: true,
      authorId: admin.id,
      duration: 600, // 10 hours
      categories: {
        connect: { id: aiCategory.id }
      }
    },
  })

  console.log('✅ تم إنشاء الدورات التجريبية')

  // Create lessons for course 1
  const lessons1 = [
    {
      title: 'مقدمة في البرمجة',
      content: {
        blocks: [
          {
            type: 'text',
            data: '<h2>مرحباً بك في عالم البرمجة!</h2><p>في هذا الدرس سنتعرف على أساسيات البرمجة ولماذا تعتبر JavaScript لغة ممتازة للمبتدئين.</p><p>البرمجة هي فن كتابة التعليمات للحاسوب لحل المشاكل وإنجاز المهام. وJavaScript هي لغة برمجة قوية ومرنة تستخدم في تطوير المواقع والتطبيقات.</p>'
          }
        ]
      },
      order: 1,
      duration: 30,
    },
    {
      title: 'المتغيرات والأنواع',
      content: {
        blocks: [
          {
            type: 'text',
            data: '<h2>المتغيرات في JavaScript</h2><p>المتغيرات هي حاويات لتخزين البيانات. في JavaScript يمكننا إنشاء المتغيرات باستخدام let أو const أو var.</p><pre><code>let name = "أحمد";\nconst age = 25;\nvar city = "الرياض";</code></pre><p>الأنواع الأساسية في JavaScript تشمل: النصوص (String)، الأرقام (Number)، القيم المنطقية (Boolean).</p>'
          }
        ]
      },
      order: 2,
      duration: 45,
    },
    {
      title: 'الدوال والتحكم',
      content: {
        blocks: [
          {
            type: 'text',
            data: '<h2>الدوال في JavaScript</h2><p>الدوال هي كتل من الكود يمكن إعادة استخدامها. تساعدنا في تنظيم الكود وتجنب التكرار.</p><pre><code>function greet(name) {\n  return "مرحباً " + name;\n}\n\nconsole.log(greet("فاطمة"));</code></pre><p>كما يمكننا استخدام الشروط للتحكم في تدفق البرنامج:</p><pre><code>if (age >= 18) {\n  console.log("بالغ");\n} else {\n  console.log("قاصر");\n}</code></pre>'
          }
        ]
      },
      order: 3,
      duration: 60,
    }
  ]

  for (const lessonData of lessons1) {
    await prisma.lesson.create({
      data: {
        ...lessonData,
        courseId: course1.id,
        isPublished: true,
      },
    })
  }

  // Create lessons for course 2
  const lessons2 = [
    {
      title: 'ما هو الذكاء الاصطناعي؟',
      content: {
        blocks: [
          {
            type: 'text',
            data: '<h2>مقدمة في الذكاء الاصطناعي</h2><p>الذكاء الاصطناعي (AI) هو مجال في علوم الحاسوب يهدف إلى إنشاء أنظمة قادرة على أداء مهام تتطلب ذكاءً بشرياً.</p><p>يشمل الذكاء الاصطناعي عدة مجالات فرعية مثل:</p><ul><li>تعلم الآلة (Machine Learning)</li><li>معالجة اللغات الطبيعية (NLP)</li><li>الرؤية الحاسوبية (Computer Vision)</li><li>الروبوتات (Robotics)</li></ul>'
          }
        ]
      },
      order: 1,
      duration: 40,
    },
    {
      title: 'تعلم الآلة الأساسي',
      content: {
        blocks: [
          {
            type: 'text',
            data: '<h2>مقدمة في تعلم الآلة</h2><p>تعلم الآلة هو فرع من الذكاء الاصطناعي يمكّن الحاسوب من التعلم والتحسن من التجربة دون برمجة صريحة.</p><p>أنواع تعلم الآلة الرئيسية:</p><ul><li><strong>التعلم المُشرف عليه:</strong> التعلم من البيانات المُصنفة</li><li><strong>التعلم غير المُشرف عليه:</strong> اكتشاف الأنماط في البيانات</li><li><strong>التعلم المُعزز:</strong> التعلم من خلال التجربة والمكافآت</li></ul>'
          }
        ]
      },
      order: 2,
      duration: 50,
    }
  ]

  for (const lessonData of lessons2) {
    await prisma.lesson.create({
      data: {
        ...lessonData,
        courseId: course2.id,
        isPublished: true,
      },
    })
  }

  console.log('✅ تم إنشاء الدروس التجريبية')

  // Enroll student in course 1
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      progress: 33.33, // Completed 1 out of 3 lessons
    },
  })

  console.log('✅ تم تسجيل الطالب في الدورة الأولى')

  // إنشاء البيانات التجريبية للعقدة
  console.log('🏗️ إنشاء بيانات العقدة التجريبية...')

  // إنشاء العقدة المحلية
  const localNode = await prisma.localNode.upsert({
    where: { id: 'pilot-riyadh-001' },
    update: {},
    create: {
      id: 'pilot-riyadh-001',
      name: 'العقدة التجريبية - الرياض',
      slug: 'pilot-riyadh-001',
      region: 'الرياض',
      country: 'SA',
      language: 'ar',
      currency: 'SAR',
      timezone: 'Asia/Riyadh',
      status: 'ACTIVE',
      databaseUrl: 'mysql://localhost:3306/pilot_riyadh_db',
      apiEndpoint: 'https://riyadh.fateh.edu/api',
      settings: {
        launchDate: new Date().toISOString(),
        targetUsers: 50,
        currentPhase: 'pilot',
        teamSize: 5
      }
    }
  })

  console.log('✅ تم إنشاء العقدة المحلية')

  // ربط المدير بالعقدة
  await prisma.user.update({
    where: { id: admin.id },
    data: { localNodeId: localNode.id }
  })

  console.log('✅ تم ربط المدير بالعقدة التجريبية')

  console.log('🎉 تم إنشاء جميع البيانات التجريبية بنجاح!')
  console.log('\n📋 بيانات تسجيل الدخول:')
  console.log('المدير: admin@fateh.com / admin123')
  console.log('الطالب: student@fateh.com / student123')
  console.log('\n🏢 العقدة التجريبية:')
  console.log('المعرف: pilot-riyadh-001')
  console.log('الاسم: العقدة التجريبية - الرياض')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
