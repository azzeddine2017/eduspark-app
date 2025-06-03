import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedHolacracy() {
  console.log('🏛️ بدء إنشاء نظام الهولاكراسي...')

  // إنشاء الدوائر الرئيسية
  const generalCircle = await prisma.circle.create({
    data: {
      name: 'الدائرة العامة',
      purpose: 'تحقيق رؤية منصة فتح للتعلّم الذكي وتوفير تجربة تعليمية متميزة',
      domain: 'الإشراف العام على جميع عمليات المنصة والتوجه الاستراتيجي',
    },
  })

  const contentCircle = await prisma.circle.create({
    data: {
      name: 'دائرة المحتوى التعليمي',
      purpose: 'إنتاج وإدارة محتوى تعليمي عالي الجودة',
      domain: 'المحتوى التعليمي، المناهج، الدورات، الدروس',
      parentId: generalCircle.id,
    },
  })

  const technologyCircle = await prisma.circle.create({
    data: {
      name: 'دائرة التقنية والذكاء الاصطناعي',
      purpose: 'تطوير وصيانة المنصة التقنية وتحسين تجربة المستخدم',
      domain: 'التطوير التقني، الذكاء الاصطناعي، الأمان، الأداء',
      parentId: generalCircle.id,
    },
  })

  const communityCircle = await prisma.circle.create({
    data: {
      name: 'دائرة المجتمع والدعم',
      purpose: 'بناء مجتمع تعليمي نشط وتقديم الدعم للمتعلمين',
      domain: 'المجتمع، الدعم الفني، تجربة المستخدم، التواصل',
      parentId: generalCircle.id,
    },
  })

  const qualityCircle = await prisma.circle.create({
    data: {
      name: 'دائرة الجودة والتحليلات',
      purpose: 'ضمان جودة المحتوى والخدمات وتحليل الأداء',
      domain: 'ضمان الجودة، التحليلات، التقييم، التحسين المستمر',
      parentId: generalCircle.id,
    },
  })

  console.log('✅ تم إنشاء الدوائر الرئيسية')

  // إنشاء الأدوار في دائرة المحتوى
  const contentCreatorRole = await prisma.role.create({
    data: {
      name: 'منشئ المحتوى',
      purpose: 'إنتاج محتوى تعليمي عالي الجودة ومناسب للمتعلمين',
      domain: 'إنشاء الدورات والدروس، كتابة المحتوى، تصميم التمارين',
      circleId: contentCircle.id,
    },
  })

  const curriculumDesignerRole = await prisma.role.create({
    data: {
      name: 'مصمم المناهج',
      purpose: 'تصميم مسارات تعليمية متكاملة ومترابطة',
      domain: 'تصميم المناهج، تسلسل التعلم، أهداف التعلم',
      circleId: contentCircle.id,
    },
  })

  // إنشاء الأدوار في دائرة التقنية
  const aiSpecialistRole = await prisma.role.create({
    data: {
      name: 'أخصائي الذكاء الاصطناعي',
      purpose: 'تطوير وتحسين ميزات الذكاء الاصطناعي في المنصة',
      domain: 'تكامل LLM، تحسين الأداء، تطوير ميزات ذكية',
      circleId: technologyCircle.id,
    },
  })

  const developerRole = await prisma.role.create({
    data: {
      name: 'مطور المنصة',
      purpose: 'تطوير وصيانة الجوانب التقنية للمنصة',
      domain: 'البرمجة، قواعد البيانات، الأمان، الأداء',
      circleId: technologyCircle.id,
    },
  })

  // إنشاء الأدوار في دائرة المجتمع
  const mentorRole = await prisma.role.create({
    data: {
      name: 'موجه تعليمي',
      purpose: 'توجيه ومساعدة المتعلمين في رحلتهم التعليمية',
      domain: 'التوجيه، الإرشاد، حل المشاكل التعليمية',
      circleId: communityCircle.id,
    },
  })

  const supportSpecialistRole = await prisma.role.create({
    data: {
      name: 'أخصائي الدعم',
      purpose: 'تقديم الدعم الفني والتعليمي للمستخدمين',
      domain: 'الدعم الفني، حل المشاكل، التواصل مع المستخدمين',
      circleId: communityCircle.id,
    },
  })

  // إنشاء الأدوار في دائرة الجودة
  const qualityAssuranceRole = await prisma.role.create({
    data: {
      name: 'مراجع الجودة',
      purpose: 'مراجعة وضمان جودة المحتوى والخدمات',
      domain: 'مراجعة المحتوى، اختبار الجودة، التقييم',
      circleId: qualityCircle.id,
    },
  })

  const analyticsSpecialistRole = await prisma.role.create({
    data: {
      name: 'أخصائي التحليلات',
      purpose: 'تحليل البيانات وتقديم رؤى لتحسين المنصة',
      domain: 'تحليل البيانات، التقارير، مؤشرات الأداء',
      circleId: qualityCircle.id,
    },
  })

  console.log('✅ تم إنشاء الأدوار الأساسية')

  // إنشاء المسؤوليات لكل دور
  const accountabilities = [
    // منشئ المحتوى
    { roleId: contentCreatorRole.id, description: 'إنتاج محتوى تعليمي أصلي وعالي الجودة' },
    { roleId: contentCreatorRole.id, description: 'مراجعة وتحديث المحتوى الموجود بانتظام' },
    { roleId: contentCreatorRole.id, description: 'التعاون مع مصممي المناهج لضمان التكامل' },

    // مصمم المناهج
    { roleId: curriculumDesignerRole.id, description: 'تصميم مسارات تعليمية متدرجة ومترابطة' },
    { roleId: curriculumDesignerRole.id, description: 'تحديد أهداف التعلم لكل دورة ودرس' },
    { roleId: curriculumDesignerRole.id, description: 'ضمان التسلسل المنطقي للمحتوى التعليمي' },

    // أخصائي الذكاء الاصطناعي
    { roleId: aiSpecialistRole.id, description: 'تطوير وتحسين المساعد الذكي' },
    { roleId: aiSpecialistRole.id, description: 'تحسين دقة وجودة إجابات الذكاء الاصطناعي' },
    { roleId: aiSpecialistRole.id, description: 'مراقبة استخدام وتكلفة APIs الذكاء الاصطناعي' },

    // مطور المنصة
    { roleId: developerRole.id, description: 'تطوير ميزات جديدة للمنصة' },
    { roleId: developerRole.id, description: 'صيانة وتحسين الأداء التقني' },
    { roleId: developerRole.id, description: 'ضمان أمان المنصة وحماية البيانات' },

    // موجه تعليمي
    { roleId: mentorRole.id, description: 'تقديم التوجيه الشخصي للمتعلمين' },
    { roleId: mentorRole.id, description: 'مساعدة المتعلمين في وضع خطط تعليمية' },
    { roleId: mentorRole.id, description: 'تحفيز المتعلمين ودعمهم نفسياً' },

    // أخصائي الدعم
    { roleId: supportSpecialistRole.id, description: 'الرد على استفسارات المستخدمين بسرعة' },
    { roleId: supportSpecialistRole.id, description: 'حل المشاكل التقنية والتعليمية' },
    { roleId: supportSpecialistRole.id, description: 'توثيق المشاكل الشائعة وحلولها' },

    // مراجع الجودة
    { roleId: qualityAssuranceRole.id, description: 'مراجعة جودة المحتوى قبل النشر' },
    { roleId: qualityAssuranceRole.id, description: 'وضع معايير الجودة والالتزام بها' },
    { roleId: qualityAssuranceRole.id, description: 'اختبار الميزات الجديدة قبل الإطلاق' },

    // أخصائي التحليلات
    { roleId: analyticsSpecialistRole.id, description: 'تحليل سلوك المستخدمين وأنماط التعلم' },
    { roleId: analyticsSpecialistRole.id, description: 'إنتاج تقارير دورية عن أداء المنصة' },
    { roleId: analyticsSpecialistRole.id, description: 'تقديم توصيات للتحسين بناءً على البيانات' },
  ]

  for (const accountability of accountabilities) {
    await prisma.accountability.create({ data: accountability })
  }

  console.log('✅ تم إنشاء المسؤوليات')

  // الحصول على المستخدم الإداري الموجود
  const adminUser = await prisma.user.findFirst({
    where: { email: 'admin@fateh.com' }
  })

  if (adminUser) {
    // إضافة المدير إلى الدائرة العامة
    await prisma.circleMember.create({
      data: {
        userId: adminUser.id,
        circleId: generalCircle.id,
      }
    })

    // تعيين المدير في دور أخصائي الذكاء الاصطناعي كمثال
    await prisma.roleAssignment.create({
      data: {
        userId: adminUser.id,
        roleId: aiSpecialistRole.id,
      }
    })

    console.log('✅ تم تعيين المدير في النظام')
  }

  console.log('🎉 تم إنشاء نظام الهولاكراسي بنجاح!')
  console.log('\n📋 ملخص النظام:')
  console.log('- 5 دوائر رئيسية')
  console.log('- 8 أدوار متخصصة')
  console.log('- 24 مسؤولية محددة')
  console.log('- نظام إدارة مفتوح وشفاف')
}

seedHolacracy()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
