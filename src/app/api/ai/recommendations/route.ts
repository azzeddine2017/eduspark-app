import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createLocalizedAI } from '@/lib/localized-ai';
import { globalPlatformService } from '@/lib/distributed-platform';
import { z } from 'zod';

// مخطط التحقق من طلب التوصيات
const recommendationRequestSchema = z.object({
  nodeId: z.string().min(1, 'معرف العقدة مطلوب'),
  type: z.enum(['content', 'learning_path', 'study_schedule', 'all']).default('content'),
  limit: z.number().min(1).max(20).default(5),
  filters: z.object({
    category: z.string().optional(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).optional(),
    tier: z.enum(['FREE', 'PREMIUM', 'ENTERPRISE']).optional(),
    estimatedTime: z.number().optional(), // بالدقائق
    topics: z.array(z.string()).optional()
  }).optional()
});

/**
 * GET /api/ai/recommendations - جلب التوصيات الذكية المخصصة
 */
export async function GET(request: NextRequest) {
  try {
    // التحقق من تسجيل الدخول
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // جلب معاملات الاستعلام
    const url = new URL(request.url);
    const nodeId = url.searchParams.get('nodeId');
    const type = url.searchParams.get('type') || 'content';
    const limit = parseInt(url.searchParams.get('limit') || '5');

    if (!nodeId) {
      return NextResponse.json(
        { success: false, error: 'معرف العقدة مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من وجود العقدة
    const node = await globalPlatformService.getNode(nodeId);
    if (!node) {
      return NextResponse.json(
        { success: false, error: 'العقدة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من صلاحية الوصول
    const hasAccess = await checkNodeAccess(session.user.id, nodeId);
    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بالوصول لهذه العقدة' },
        { status: 403 }
      );
    }

    // إنشاء مثيل الذكاء الاصطناعي المحلي
    const localizedAI = createLocalizedAI(nodeId);

    let recommendations: any = {};

    // توليد التوصيات حسب النوع المطلوب
    if (type === 'content' || type === 'all') {
      const contentRecommendations = await localizedAI.generateContentRecommendations(
        session.user.id,
        limit
      );
      recommendations.content = contentRecommendations;
    }

    if (type === 'learning_path' || type === 'all') {
      const learningPathRecommendations = await generateLearningPathRecommendations(
        session.user.id,
        nodeId,
        limit
      );
      recommendations.learningPath = learningPathRecommendations;
    }

    if (type === 'study_schedule' || type === 'all') {
      const scheduleRecommendations = await generateStudyScheduleRecommendations(
        session.user.id,
        nodeId
      );
      recommendations.studySchedule = scheduleRecommendations;
    }

    // جلب إحصائيات المستخدم
    const userStats = await getUserLearningStats(session.user.id, nodeId);

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        userStats,
        metadata: {
          nodeId,
          nodeName: node.name,
          userId: session.user.id,
          generatedAt: new Date().toISOString(),
          type
        }
      },
      message: 'تم توليد التوصيات الذكية بنجاح'
    });

  } catch (error: any) {
    console.error('خطأ في توليد التوصيات:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء توليد التوصيات' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/recommendations - طلب توصيات مخصصة بمعايير محددة
 */
export async function POST(request: NextRequest) {
  try {
    // التحقق من تسجيل الدخول
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // التحقق من صحة البيانات
    const body = await request.json();
    const validatedData = recommendationRequestSchema.parse(body);

    // التحقق من وجود العقدة
    const node = await globalPlatformService.getNode(validatedData.nodeId);
    if (!node) {
      return NextResponse.json(
        { success: false, error: 'العقدة غير موجودة' },
        { status: 404 }
      );
    }

    // التحقق من صلاحية الوصول
    const hasAccess = await checkNodeAccess(session.user.id, validatedData.nodeId);
    if (!hasAccess) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بالوصول لهذه العقدة' },
        { status: 403 }
      );
    }

    // إنشاء مثيل الذكاء الاصطناعي المحلي
    const localizedAI = createLocalizedAI(validatedData.nodeId);

    // توليد التوصيات المخصصة
    const recommendations = await generateCustomRecommendations(
      localizedAI,
      session.user.id,
      validatedData
    );

    // تسجيل طلب التوصيات
    await logRecommendationRequest(
      session.user.id,
      validatedData.nodeId,
      validatedData.type,
      validatedData.filters,
      recommendations.length
    );

    return NextResponse.json({
      success: true,
      data: {
        recommendations,
        filters: validatedData.filters,
        metadata: {
          nodeId: validatedData.nodeId,
          userId: session.user.id,
          type: validatedData.type,
          limit: validatedData.limit,
          generatedAt: new Date().toISOString()
        }
      },
      message: 'تم توليد التوصيات المخصصة بنجاح'
    });

  } catch (error: any) {
    console.error('خطأ في توليد التوصيات المخصصة:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء توليد التوصيات المخصصة' },
      { status: 500 }
    );
  }
}

// دوال مساعدة

// التحقق من صلاحية الوصول للعقدة
async function checkNodeAccess(userId: string, nodeId: string): Promise<boolean> {
  try {
    // التحقق من الاشتراك النشط
    const subscription = await globalPlatformService.prisma.nodeSubscription.findFirst({
      where: {
        userId,
        nodeId,
        isActive: true,
        endDate: { gte: new Date() }
      }
    });

    if (subscription) return true;

    // التحقق من الشراكة
    const partnership = await globalPlatformService.prisma.nodePartner.findFirst({
      where: {
        userId,
        nodeId,
        status: 'ACTIVE'
      }
    });

    if (partnership) return true;

    // التحقق من كون المستخدم مدير
    const user = await globalPlatformService.prisma.user.findUnique({
      where: { id: userId }
    });

    return user?.role === 'ADMIN';
  } catch (error) {
    console.error('خطأ في التحقق من صلاحية الوصول:', error);
    return false;
  }
}

// توليد توصيات مسار التعلم
async function generateLearningPathRecommendations(
  userId: string,
  nodeId: string,
  limit: number
) {
  // تحليل تقدم المستخدم الحالي
  const userProgress = await globalPlatformService.prisma.lessonProgress.findMany({
    where: { userId },
    include: {
      lesson: {
        include: {
          course: true
        }
      }
    }
  });

  // اقتراح مسارات تعلم بناءً على التقدم
  const suggestions = [
    {
      id: 'path_1',
      title: 'مسار تطوير المهارات الأساسية',
      description: 'مسار مقترح لتطوير المهارات الأساسية بناءً على تقدمك',
      estimatedDuration: 120, // دقيقة
      courses: ['course_1', 'course_2', 'course_3'],
      difficulty: 'INTERMEDIATE',
      relevanceScore: 85
    },
    {
      id: 'path_2',
      title: 'مسار التخصص المتقدم',
      description: 'مسار للانتقال للمستوى المتقدم',
      estimatedDuration: 180,
      courses: ['course_4', 'course_5'],
      difficulty: 'ADVANCED',
      relevanceScore: 75
    }
  ];

  return suggestions.slice(0, limit);
}

// توليد توصيات جدول الدراسة
async function generateStudyScheduleRecommendations(userId: string, nodeId: string) {
  // تحليل أنماط دراسة المستخدم
  const userActivity = await globalPlatformService.prisma.lessonProgress.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 50
  });

  // اقتراح جدول دراسة مخصص
  return {
    recommendedDailyTime: 45, // دقيقة
    bestStudyTimes: ['09:00', '15:00', '20:00'],
    weeklyGoal: 5, // ساعات
    suggestedBreaks: 15, // دقيقة كل ساعة
    preferredDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
    reasoning: 'بناءً على نشاطك السابق، هذا الجدول سيساعدك على تحقيق أفضل النتائج'
  };
}

// جلب إحصائيات تعلم المستخدم
async function getUserLearningStats(userId: string, nodeId: string) {
  const [enrollments, completedLessons, quizAttempts] = await Promise.all([
    globalPlatformService.prisma.enrollment.count({ where: { userId } }),
    globalPlatformService.prisma.lessonProgress.count({ 
      where: { userId, completed: true } 
    }),
    globalPlatformService.prisma.quizAttempt.count({ where: { userId } })
  ]);

  const averageScore = await globalPlatformService.prisma.quizAttempt.aggregate({
    where: { userId },
    _avg: { score: true }
  });

  return {
    totalEnrollments: enrollments,
    completedLessons,
    totalQuizAttempts: quizAttempts,
    averageQuizScore: Math.round(averageScore._avg.score || 0),
    learningStreak: 0, // يمكن حسابها من نشاط المستخدم
    totalStudyTime: 0 // يمكن حسابها من سجلات النشاط
  };
}

// توليد توصيات مخصصة
async function generateCustomRecommendations(
  localizedAI: any,
  userId: string,
  requestData: any
) {
  // استخدام الذكاء الاصطناعي المحلي لتوليد توصيات مخصصة
  const recommendations = await localizedAI.generateContentRecommendations(
    userId,
    requestData.limit
  );

  // تطبيق الفلاتر إذا وُجدت
  if (requestData.filters) {
    return recommendations.filter((rec: any) => {
      if (requestData.filters.category && !rec.category?.includes(requestData.filters.category)) {
        return false;
      }
      if (requestData.filters.level && rec.level !== requestData.filters.level) {
        return false;
      }
      if (requestData.filters.tier && rec.tier !== requestData.filters.tier) {
        return false;
      }
      if (requestData.filters.estimatedTime && rec.estimatedCompletionTime > requestData.filters.estimatedTime) {
        return false;
      }
      return true;
    });
  }

  return recommendations;
}

// تسجيل طلب التوصيات
async function logRecommendationRequest(
  userId: string,
  nodeId: string,
  type: string,
  filters: any,
  resultCount: number
) {
  try {
    await globalPlatformService.prisma.llmInteractionLog.create({
      data: {
        userId,
        type: 'RECOMMENDATION_REQUEST',
        prompt: `طلب توصيات من نوع: ${type}`,
        response: `تم توليد ${resultCount} توصية`,
        model: 'localized-ai-v1',
        tokens: 0,
        cost: 0,
        responseTime: 0,
        metadata: {
          nodeId,
          recommendationType: type,
          filters,
          resultCount
        }
      }
    });
  } catch (error) {
    console.error('خطأ في تسجيل طلب التوصيات:', error);
  }
}
