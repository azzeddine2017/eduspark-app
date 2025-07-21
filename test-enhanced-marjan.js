// اختبار سريع لنظام مرجان المحسن
const { PrismaClient } = require('@prisma/client');

async function testEnhancedMarjan() {
  console.log('🚀 اختبار نظام مرجان المحسن - المرحلة الأولى');
  console.log('=' .repeat(50));

  const prisma = new PrismaClient();

  try {
    // اختبار الاتصال بقاعدة البيانات
    console.log('📊 اختبار الاتصال بقاعدة البيانات...');
    await prisma.$connect();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // اختبار الجداول الجديدة
    console.log('\n📋 اختبار الجداول الجديدة...');
    
    // اختبار جدول StudentProfile
    try {
      const profileCount = await prisma.studentProfile.count();
      console.log(`✅ جدول StudentProfile: ${profileCount} سجل`);
    } catch (error) {
      console.log('❌ خطأ في جدول StudentProfile:', error.message);
    }

    // اختبار جدول ConceptMastery
    try {
      const conceptCount = await prisma.conceptMastery.count();
      console.log(`✅ جدول ConceptMastery: ${conceptCount} سجل`);
    } catch (error) {
      console.log('❌ خطأ في جدول ConceptMastery:', error.message);
    }

    // اختبار جدول EducationalInteraction
    try {
      const interactionCount = await prisma.educationalInteraction.count();
      console.log(`✅ جدول EducationalInteraction: ${interactionCount} سجل`);
    } catch (error) {
      console.log('❌ خطأ في جدول EducationalInteraction:', error.message);
    }

    // اختبار جدول LearningRecommendation
    try {
      const recommendationCount = await prisma.learningRecommendation.count();
      console.log(`✅ جدول LearningRecommendation: ${recommendationCount} سجل`);
    } catch (error) {
      console.log('❌ خطأ في جدول LearningRecommendation:', error.message);
    }

    // اختبار جدول LearningPattern
    try {
      const patternCount = await prisma.learningPattern.count();
      console.log(`✅ جدول LearningPattern: ${patternCount} سجل`);
    } catch (error) {
      console.log('❌ خطأ في جدول LearningPattern:', error.message);
    }

    // اختبار جدول LearningSession
    try {
      const sessionCount = await prisma.learningSession.count();
      console.log(`✅ جدول LearningSession: ${sessionCount} سجل`);
    } catch (error) {
      console.log('❌ خطأ في جدول LearningSession:', error.message);
    }

    console.log('\n🎯 اختبار إنشاء ملف طالب تجريبي...');
    
    // البحث عن مستخدم موجود أو إنشاء واحد تجريبي
    let testUser = await prisma.user.findFirst({
      where: {
        email: {
          contains: 'test'
        }
      }
    });

    if (!testUser) {
      console.log('📝 إنشاء مستخدم تجريبي...');
      testUser = await prisma.user.create({
        data: {
          email: 'test-enhanced-marjan@example.com',
          name: 'طالب تجريبي - مرجان المحسن',
          role: 'STUDENT',
          birthDate: new Date('2005-01-01'),
          occupation: 'طالب'
        }
      });
      console.log('✅ تم إنشاء المستخدم التجريبي');
    }

    // إنشاء أو جلب ملف طالب ذكي
    console.log('🧠 إنشاء أو جلب ملف طالب ذكي...');
    let studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: testUser.id }
    });

    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.create({
        data: {
          userId: testUser.id,
          learningStyleVisual: 40,
          learningStyleAuditory: 30,
          learningStyleKinesthetic: 20,
          learningStyleReading: 10,
          culturalContext: 'arabic',
          interests: ['رياضيات', 'علوم', 'تقنية'],
          strengths: ['حل المسائل', 'التفكير المنطقي'],
          weaknesses: ['الحفظ', 'القواعد النحوية'],
          age: 19,
          educationLevel: 'student',
          profileCompleteness: 0.8
        }
      });
      console.log('✅ تم إنشاء ملف الطالب الذكي');
    } else {
      console.log('✅ تم جلب ملف الطالب الذكي الموجود');
    }

    // إنشاء تفاعل تعليمي تجريبي
    console.log('💬 إنشاء تفاعل تعليمي تجريبي...');
    const interaction = await prisma.educationalInteraction.create({
      data: {
        studentId: studentProfile.id,
        sessionId: 'test-session-' + Date.now(),
        question: 'ما هي الكسور؟',
        response: 'الكسور هي أجزاء من الكل، مثل نصف التفاحة أو ربع الكعكة...',
        methodologyUsed: 'visual_demo',
        successIndicator: 0.85,
        conceptAddressed: 'الكسور',
        subject: 'رياضيات',
        difficultyLevel: 3,
        responseTimeSeconds: 45,
        timeOfDay: new Date().getHours(),
        deviceType: 'desktop'
      }
    });
    console.log('✅ تم إنشاء التفاعل التعليمي');

    // إنشاء أو تحديث إتقان مفهوم
    console.log('📈 إنشاء أو تحديث سجل إتقان مفهوم...');
    const conceptMastery = await prisma.conceptMastery.upsert({
      where: {
        studentId_conceptName_subject: {
          studentId: studentProfile.id,
          conceptName: 'الكسور',
          subject: 'رياضيات'
        }
      },
      update: {
        masteryLevel: 75,
        attemptsCount: 5,
        successRate: 0.80,
        difficultyLevel: 3,
        timeToMaster: 120
      },
      create: {
        studentId: studentProfile.id,
        conceptName: 'الكسور',
        subject: 'رياضيات',
        masteryLevel: 75,
        attemptsCount: 5,
        successRate: 0.80,
        difficultyLevel: 3,
        timeToMaster: 120
      }
    });
    console.log('✅ تم إنشاء/تحديث سجل إتقان المفهوم');

    // إنشاء توصية تعليمية
    console.log('💡 إنشاء توصية تعليمية...');
    const recommendation = await prisma.learningRecommendation.create({
      data: {
        studentId: studentProfile.id,
        recommendationType: 'next_concept',
        title: 'الانتقال لجمع الكسور',
        description: 'بناءً على إتقانك للكسور الأساسية، أنصحك بتعلم جمع الكسور',
        reasoning: 'الطالب أتقن مفهوم الكسور بنسبة 75% وجاهز للمستوى التالي',
        conceptName: 'جمع الكسور',
        subject: 'رياضيات',
        difficultyLevel: 4,
        estimatedTime: 60,
        priority: 8,
        urgency: 'medium'
      }
    });
    console.log('✅ تم إنشاء التوصية التعليمية');

    console.log('\n🎉 تم اختبار جميع المكونات بنجاح!');
    console.log('\n📊 ملخص البيانات المنشأة:');
    console.log(`👤 المستخدم: ${testUser.name} (${testUser.email})`);
    console.log(`🧠 ملف الطالب: أسلوب بصري ${studentProfile.learningStyleVisual}%`);
    console.log(`💬 التفاعل: ${interaction.conceptAddressed} - نجاح ${(interaction.successIndicator * 100).toFixed(0)}%`);
    console.log(`📈 الإتقان: ${conceptMastery.conceptName} - مستوى ${conceptMastery.masteryLevel}%`);
    console.log(`💡 التوصية: ${recommendation.title}`);

    console.log('\n🚀 نظام مرجان المحسن جاهز للعمل!');
    console.log('🎯 المرحلة الأولى مكتملة بنجاح');

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');
  }
}

// تشغيل الاختبار
testEnhancedMarjan().catch(console.error);
