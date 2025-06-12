import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nodeId = searchParams.get('nodeId');

    // محاكاة بيانات التحليلات (يمكن استبدالها ببيانات حقيقية من قاعدة البيانات)
    const analytics = generateMockAnalytics(nodeId);

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('خطأ في جلب تحليلات الذكاء الاصطناعي:', error);
    
    return NextResponse.json(
      { error: 'حدث خطأ في جلب التحليلات' },
      { status: 500 }
    );
  }
}

function generateMockAnalytics(nodeId: string | null) {
  // بيانات تحليلية محاكاة للعرض التوضيحي
  const baseData = {
    totalQuestions: Math.floor(Math.random() * 500) + 100,
    satisfactionRate: Math.floor(Math.random() * 30) + 70, // 70-100%
    avgResponseTime: (Math.random() * 2 + 0.5).toFixed(1), // 0.5-2.5 ثانية
    topTopics: [
      { name: 'البرمجة', count: 45, percentage: 85 },
      { name: 'الرياضيات', count: 38, percentage: 72 },
      { name: 'العلوم', count: 32, percentage: 60 },
      { name: 'التاريخ', count: 28, percentage: 53 },
      { name: 'اللغة العربية', count: 25, percentage: 47 },
      { name: 'الفيزياء', count: 22, percentage: 42 },
      { name: 'الكيمياء', count: 18, percentage: 34 },
      { name: 'الأحياء', count: 15, percentage: 28 }
    ],
    weeklyUsage: [
      { day: 'السبت', questions: 45 },
      { day: 'الأحد', questions: 52 },
      { day: 'الاثنين', questions: 38 },
      { day: 'الثلاثاء', questions: 41 },
      { day: 'الأربعاء', questions: 48 },
      { day: 'الخميس', questions: 35 },
      { day: 'الجمعة', questions: 28 }
    ],
    responseTypes: [
      { type: 'شرح وتوضيح', count: 120, percentage: 40 },
      { type: 'توصيات', count: 90, percentage: 30 },
      { type: 'أمثلة عملية', count: 60, percentage: 20 },
      { type: 'تحليل', count: 30, percentage: 10 }
    ],
    userSatisfaction: {
      excellent: 65,
      good: 25,
      average: 8,
      poor: 2
    },
    popularFeatures: [
      { feature: 'الشرح التفاعلي', usage: 85 },
      { feature: 'التوصيات المخصصة', usage: 78 },
      { feature: 'الأمثلة المحلية', usage: 72 },
      { feature: 'تتبع التقدم', usage: 68 },
      { feature: 'التحليل الذكي', usage: 55 }
    ],
    languageDistribution: [
      { language: 'العربية', percentage: 85 },
      { language: 'الإنجليزية', percentage: 12 },
      { language: 'الفرنسية', percentage: 3 }
    ],
    timeDistribution: [
      { hour: '08:00', usage: 15 },
      { hour: '09:00', usage: 25 },
      { hour: '10:00', usage: 35 },
      { hour: '11:00', usage: 45 },
      { hour: '12:00', usage: 40 },
      { hour: '13:00', usage: 30 },
      { hour: '14:00', usage: 50 },
      { hour: '15:00', usage: 55 },
      { hour: '16:00', usage: 48 },
      { hour: '17:00', usage: 42 },
      { hour: '18:00', usage: 38 },
      { hour: '19:00', usage: 35 },
      { hour: '20:00', usage: 45 },
      { hour: '21:00', usage: 40 },
      { hour: '22:00', usage: 25 },
      { hour: '23:00', usage: 15 }
    ],
    improvements: [
      {
        area: 'سرعة الاستجابة',
        current: 1.2,
        target: 1.0,
        improvement: '+15%'
      },
      {
        area: 'دقة الإجابات',
        current: 87,
        target: 90,
        improvement: '+3%'
      },
      {
        area: 'التخصيص الثقافي',
        current: 78,
        target: 85,
        improvement: '+7%'
      }
    ],
    recentFeedback: [
      {
        rating: 5,
        comment: 'مساعد ممتاز، يفهم احتياجاتي التعليمية',
        date: '2025-01-15'
      },
      {
        rating: 4,
        comment: 'إجابات مفيدة لكن أحتاج أمثلة أكثر',
        date: '2025-01-14'
      },
      {
        rating: 5,
        comment: 'التخصيص المحلي رائع جداً',
        date: '2025-01-13'
      }
    ]
  };

  // تخصيص البيانات حسب العقدة إذا كانت متوفرة
  if (nodeId) {
    // يمكن هنا إضافة منطق لتخصيص البيانات حسب العقدة المحددة
    baseData.totalQuestions = Math.floor(baseData.totalQuestions * 0.8); // تقليل للعقدة المحلية
  }

  return baseData;
}
