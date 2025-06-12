import { PrismaClient, ChallengeSeverity, ChallengeStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function seedPilotData() {
  console.log('🌱 بدء إنشاء البيانات التجريبية...')

  try {
    // إنشاء مستخدم للشريك
    const partnerUser = await prisma.user.upsert({
      where: { email: 'partner@pilot-algiers.com' },
      update: {},
      create: {
        email: 'partner@pilot-algiers.com',
        name: 'عبد الرحمن بن علي الجزائري',
        password: 'hashed_password_here',
        role: 'ADMIN',
        isActive: true,
        phone: '+213551234567',
        location: 'الجزائر العاصمة، الجزائر',
        bio: 'مدير العقدة التجريبية في الجزائر',
        birthDate: new Date('1985-05-15'),
        occupation: 'مدير عقدة تعليمية'
      }
    })

    console.log('✅ تم إنشاء مستخدم الشريك')

    // إنشاء العقدة المحلية أولاً
    const localNode = await prisma.localNode.upsert({
      where: { id: 'pilot-algiers-001' },
      update: {},
      create: {
        id: 'pilot-algiers-001',
        name: 'العقدة التجريبية - الجزائر',
        slug: 'pilot-algiers-001',
        region: 'الجزائر العاصمة',
        country: 'DZ',
        language: 'ar',
        currency: 'DZD',
        timezone: 'Africa/Algiers',
        status: 'ACTIVE',
        databaseUrl: 'mysql://localhost:3306/pilot_algiers_db',
        apiEndpoint: 'https://algiers.fateh.edu/api',
        settings: {
          launchDate: new Date().toISOString(),
          targetUsers: 50,
          currentPhase: 'pilot',
          teamSize: 5,
          supportedLanguages: ['ar', 'fr', 'en'],
          localCurrency: 'DZD',
          timezone: 'Africa/Algiers'
        }
      }
    })

    console.log('✅ تم إنشاء العقدة المحلية')

    // إنشاء شريك العقدة
    const nodePartner = await prisma.nodePartner.upsert({
      where: {
        nodeId_userId: {
          nodeId: localNode.id,
          userId: partnerUser.id
        }
      },
      update: {},
      create: {
        nodeId: localNode.id,
        userId: partnerUser.id,
        role: 'OWNER',
        revenueShare: 70.00,
        status: 'ACTIVE',
        contractStartDate: new Date(),
        contractEndDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 years
        contractData: {
          businessName: 'مركز فتح التعليمي - الجزائر',
          contactInfo: {
            phone: '+213551234567',
            email: 'partner@pilot-algiers.com',
            address: 'الجزائر العاصمة، الجزائر',
            website: 'https://algiers.fateh.edu'
          },
          agreement: {
            signedDate: new Date().toISOString(),
            revenueShare: 70,
            duration: '2 years',
            terms: 'اتفاقية شراكة العقدة التجريبية'
          }
        }
      }
    })

    console.log('✅ تم إنشاء العقدة المحلية')

    // إنشاء مستخدمين تجريبيين
    const testUsers = []
    for (let i = 1; i <= 42; i++) {
      const user = await prisma.user.create({
        data: {
          email: `user${i}@pilot-test.com`,
          name: `مستخدم تجريبي ${i}`,
          password: 'hashed_password_here',
          role: 'STUDENT',
          isActive: true,
          localNodeId: localNode.id,
          phone: `+21355123${String(i).padStart(4, '0')}`,
          location: 'الجزائر العاصمة، الجزائر',
          birthDate: new Date(1990 + (i % 20), (i % 12), (i % 28) + 1),
          occupation: 'طالب'
        }
      })
      testUsers.push(user)
    }

    console.log('✅ تم إنشاء 42 مستخدم تجريبي')

    // إنشاء اشتراكات تجريبية
    const subscriptionPlans = [
      { name: 'البرمجة للمبتدئين', amount: 29, count: 12 },
      { name: 'التصميم الجرافيكي', amount: 39, count: 8 },
      { name: 'إدارة الأعمال', amount: 49, count: 6 },
      { name: 'التسويق الرقمي', amount: 35, count: 2 }
    ]

    let subscriptionIndex = 0
    for (const plan of subscriptionPlans) {
      for (let i = 0; i < plan.count; i++) {
        await prisma.subscription.create({
          data: {
            userId: testUsers[subscriptionIndex].id,
            planName: plan.name,
            amount: plan.amount,
            currency: 'USD',
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            metadata: {
              paymentMethod: 'credit_card',
              autoRenew: true,
              discountApplied: false
            }
          }
        })
        subscriptionIndex++
      }
    }

    console.log('✅ تم إنشاء 28 اشتراك تجريبي')

    // إنشاء تحديات تجريبية
    const challenges = [
      {
        title: 'بطء في التسجيل خلال ساعات الذروة',
        description: 'تم ملاحظة بطء في عملية تسجيل المستخدمين الجدد خلال ساعات الذروة (7-9 مساءً)',
        severity: ChallengeSeverity.MEDIUM,
        status: ChallengeStatus.IN_PROGRESS,
        assignee: 'محمد عبدالله الجزائري',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        tags: ['performance', 'registration', 'peak_hours']
      },
      {
        title: 'طلبات تخصيص إضافي للمحتوى المحلي',
        description: 'المستخدمون يطلبون المزيد من المحتوى المخصص للثقافة الجزائرية',
        severity: ChallengeSeverity.LOW,
        status: ChallengeStatus.OPEN,
        assignee: 'فاطمة بنت علي الجزائرية',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        tags: ['content', 'localization', 'user_feedback']
      },
      {
        title: 'تحسين واجهة الدفع للمستخدمين المحليين',
        description: 'تحسين تجربة الدفع لتتناسب مع طرق الدفع المحلية المفضلة',
        severity: ChallengeSeverity.HIGH,
        status: ChallengeStatus.RESOLVED,
        assignee: 'محمد عبدالله الجزائري',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ['payment', 'ui_ux', 'localization']
      }
    ]

    for (const challenge of challenges) {
      const createdChallenge = await prisma.pilotChallenge.create({
        data: {
          nodeId: localNode.id,
          ...challenge,
          metadata: {
            priority: challenge.severity,
            category: challenge.tags[0],
            reportedBy: 'system_monitoring'
          }
        }
      })

      // إضافة تعليق أولي
      await prisma.challengeComment.create({
        data: {
          challengeId: createdChallenge.id,
          author: 'النظام',
          content: `تم إنشاء التحدي تلقائياً. مستوى الخطورة: ${challenge.severity}`,
          type: 'system'
        }
      })
    }

    console.log('✅ تم إنشاء 3 تحديات تجريبية')

    // إنشاء مؤشرات أداء تجريبية (سنستخدم جدول منفصل)
    console.log('✅ تم تخطي إنشاء المؤشرات (سيتم إنشاؤها عبر APIs)')

    console.log('🎉 تم إنشاء جميع البيانات التجريبية بنجاح!')
    console.log(`📊 ملخص البيانات المُنشأة:`)
    console.log(`   - 1 عقدة محلية`)
    console.log(`   - 1 شريك`)
    console.log(`   - 42 مستخدم`)
    console.log(`   - 28 اشتراك`)
    console.log(`   - 3 تحديات`)

  } catch (error) {
    console.error('❌ خطأ في إنشاء البيانات التجريبية:', error)
    throw error
  }
}



// تشغيل السكريبت
seedPilotData()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
