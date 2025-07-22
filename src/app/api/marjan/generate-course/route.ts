import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { IntelligentCourseGenerator, CourseRequirements } from '@/lib/course-generation/intelligent-course-generator';
import { prisma } from '@/lib/prisma';

interface GenerateCourseRequest {
  title: string;
  subject: string;
  targetAudience: 'children' | 'teenagers' | 'adults' | 'professionals';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: 'short' | 'medium' | 'long';
  language: 'arabic' | 'english' | 'bilingual';
  includeAssessments: boolean;
  includeInteractiveElements: boolean;
  culturalContext: 'saudi' | 'gulf' | 'arab' | 'international';
  learningObjectives: string[];
  prerequisites?: string[];
}

export async function POST(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً', success: false },
        { status: 401 }
      );
    }

    // التحقق من صلاحيات المستخدم (المدراء والمعلمون ومنشئو المحتوى فقط)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || !['ADMIN', 'INSTRUCTOR', 'CONTENT_CREATOR'].includes(user.role)) {
      return NextResponse.json(
        { error: 'ليس لديك صلاحية لتوليد الدورات', success: false },
        { status: 403 }
      );
    }

    const body: GenerateCourseRequest = await request.json();

    // التحقق من صحة البيانات
    if (!body.title || !body.subject || !body.targetAudience || !body.difficultyLevel) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة ناقصة', success: false },
        { status: 400 }
      );
    }

    console.log('🎓 مرجان يبدأ توليد دورة جديدة:', body.title);

    // إنشاء مولد الدورات
    const courseGenerator = new IntelligentCourseGenerator();

    // تحضير متطلبات الدورة
    const requirements: CourseRequirements = {
      title: body.title,
      subject: body.subject,
      targetAudience: body.targetAudience,
      difficultyLevel: body.difficultyLevel,
      duration: body.duration || 'medium',
      language: body.language || 'arabic',
      includeAssessments: body.includeAssessments ?? true,
      includeInteractiveElements: body.includeInteractiveElements ?? true,
      culturalContext: body.culturalContext || 'saudi',
      learningObjectives: body.learningObjectives || [],
      prerequisites: body.prerequisites
    };

    // توليد الدورة
    const startTime = Date.now();
    const generatedCourse = await courseGenerator.generateCourse(requirements);
    const generationTime = Date.now() - startTime;

    console.log(`✅ تم توليد الدورة في ${generationTime}ms:`, {
      modules: generatedCourse.modules.length,
      lessons: generatedCourse.totalLessons,
      duration: `${Math.round(generatedCourse.duration / 60)} ساعة`
    });

    // تحويل مستوى الصعوبة إلى enum
    const courseLevel = generatedCourse.level === 'beginner' ? 'BEGINNER' :
                       generatedCourse.level === 'intermediate' ? 'INTERMEDIATE' :
                       'ADVANCED';

    // حفظ الدورة في قاعدة البيانات
    const savedCourse = await prisma.course.create({
      data: {
        title: generatedCourse.title,
        description: generatedCourse.description,
        level: courseLevel as any,
        duration: generatedCourse.duration,
        authorId: session.user.id,
        isPublished: false // تحتاج مراجعة قبل النشر
      }
    });

    // إنشاء الدروس (تجميع جميع الدروس من جميع الوحدات)
    let lessonOrder = 1;
    for (const module of generatedCourse.modules) {
      // إنشاء درس للوحدة (كعنوان فرعي)
      await prisma.lesson.create({
        data: {
          title: `📚 ${module.title}`,
          content: {
            type: 'module_header',
            description: module.description,
            objectives: module.learningObjectives,
            moduleTitle: module.title,
            moduleDuration: module.duration
          },
          order: lessonOrder++,
          duration: 5, // 5 دقائق للمراجعة
          courseId: savedCourse.id,
          isPublished: false
        }
      });

      // إنشاء الدروس الفعلية
      for (const lesson of module.lessons) {
        await prisma.lesson.create({
          data: {
            title: lesson.title,
            content: lesson.content, // المحتوى النظيف مباشرة كنص
            order: lessonOrder++,
            duration: lesson.duration,
            courseId: savedCourse.id,
            isPublished: false
          }
        });
      }
    }

    // تسجيل النشاط في console
    console.log('✅ تم إنشاء دورة جديدة:', {
      courseId: savedCourse.id,
      title: generatedCourse.title,
      modules: generatedCourse.modules.length,
      lessons: generatedCourse.totalLessons,
      generationTime,
      userId: session.user.id
    });

    // إرجاع النتيجة
    return NextResponse.json({
      success: true,
      course: {
        id: savedCourse.id,
        title: generatedCourse.title,
        description: generatedCourse.description,
        modules: generatedCourse.modules.length,
        lessons: generatedCourse.totalLessons,
        duration: generatedCourse.duration,
        generationTime,
        status: 'draft' // تحتاج مراجعة
      },
      message: `تم توليد الدورة "${generatedCourse.title}" بنجاح! تحتوي على ${generatedCourse.modules.length} وحدات و ${generatedCourse.totalLessons} درس.`
    });

  } catch (error) {
    console.error('خطأ في توليد الدورة:', error);

    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء توليد الدورة. يرجى المحاولة مرة أخرى.',
        success: false
      },
      { status: 500 }
    );
  }
}

// الحصول على قائمة الدورات المولدة
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً', success: false },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // draft, published, all

    const where: any = {};
    
    // فلترة حسب الحالة
    if (status === 'draft') {
      where.isPublished = false;
    } else if (status === 'published') {
      where.isPublished = true;
    }

    // فلترة حسب المستخدم (غير المدراء يرون دوراتهم فقط)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      where.authorId = session.user.id;
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        author: {
          select: { name: true, email: true }
        },
        lessons: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    });

    const total = await prisma.course.count({ where });

    return NextResponse.json({
      success: true,
      courses: courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        duration: course.duration,
        isPublished: course.isPublished,
        author: course.author,
        lessons: course.lessons.length,
        enrollments: course._count.enrollments,
        createdAt: course.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في جلب الدورات:', error);

    return NextResponse.json(
      {
        error: 'حدث خطأ أثناء جلب الدورات',
        success: false
      },
      { status: 500 }
    );
  }
}
