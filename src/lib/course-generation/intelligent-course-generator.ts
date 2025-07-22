// مولد الدورات الذكي - مرجان
// يولد دورات تعليمية شاملة ومتنوعة تلقائياً

export interface CourseRequirements {
  title: string;
  subject: string;
  targetAudience: 'children' | 'teenagers' | 'adults' | 'professionals';
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: 'short' | 'medium' | 'long'; // 1-3 hours, 4-8 hours, 9+ hours
  language: 'arabic' | 'english' | 'bilingual';
  includeAssessments: boolean;
  includeInteractiveElements: boolean;
  culturalContext: 'saudi' | 'gulf' | 'arab' | 'international';
  learningObjectives: string[];
  prerequisites?: string[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  lessons: CourseLesson[];
  assessment?: CourseAssessment;
  learningObjectives: string[];
}

export interface CourseLesson {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive' | 'quiz' | 'exercise';
  duration: number; // minutes
  examples: string[];
  activities: LearningActivity[];
  resources: string[];
}

export interface LearningActivity {
  id: string;
  type: 'discussion' | 'exercise' | 'project' | 'quiz' | 'reflection';
  title: string;
  description: string;
  instructions: string[];
  estimatedTime: number;
  difficulty: number; // 1-10
}

export interface CourseAssessment {
  id: string;
  type: 'quiz' | 'assignment' | 'project' | 'exam';
  title: string;
  questions: AssessmentQuestion[];
  passingScore: number;
  timeLimit?: number;
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface GeneratedCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  duration: number; // total minutes
  modules: CourseModule[];
  totalLessons: number;
  totalAssessments: number;
  learningPath: string[];
  prerequisites: string[];
  outcomes: string[];
  metadata: {
    generatedAt: Date;
    generatedBy: 'marjan';
    version: string;
    culturalContext: string;
    targetAudience: string;
  };
}

export class IntelligentCourseGenerator {
  private subjectTemplates: Map<string, any> = new Map();
  private culturalContexts: Map<string, any> = new Map();
  private difficultyProgression: Map<string, any> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeCulturalContexts();
    this.initializeDifficultyProgression();
  }

  // توليد دورة كاملة بناءً على المتطلبات
  async generateCourse(requirements: CourseRequirements): Promise<GeneratedCourse> {
    console.log('🎓 مرجان يولد دورة جديدة:', requirements.title);

    // 1. تحليل المتطلبات وإنشاء الهيكل الأساسي
    const courseStructure = this.createCourseStructure(requirements);

    // 2. توليد المحتوى لكل وحدة
    const modules = await this.generateModules(courseStructure, requirements);

    // 3. إنشاء التقييمات
    const assessments = requirements.includeAssessments 
      ? await this.generateAssessments(modules, requirements)
      : [];

    // 4. تطوير مسار التعلم
    const learningPath = this.createLearningPath(modules);

    // 5. إنشاء الدورة النهائية
    const course: GeneratedCourse = {
      id: `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: requirements.title,
      description: this.generateCourseDescription(requirements),
      subject: requirements.subject,
      level: requirements.difficultyLevel,
      duration: this.calculateTotalDuration(modules),
      modules,
      totalLessons: modules.reduce((total, module) => total + module.lessons.length, 0),
      totalAssessments: assessments.length,
      learningPath,
      prerequisites: requirements.prerequisites || [],
      outcomes: this.generateLearningOutcomes(requirements),
      metadata: {
        generatedAt: new Date(),
        generatedBy: 'marjan',
        version: '1.0.0',
        culturalContext: requirements.culturalContext,
        targetAudience: requirements.targetAudience
      }
    };

    console.log('✅ تم توليد الدورة بنجاح:', {
      modules: course.modules.length,
      lessons: course.totalLessons,
      duration: `${Math.round(course.duration / 60)} ساعة`
    });

    return course;
  }

  // إنشاء هيكل الدورة الأساسي
  private createCourseStructure(requirements: CourseRequirements): any {
    const template = this.subjectTemplates.get(requirements.subject) || this.getDefaultTemplate();
    const cultural = this.culturalContexts.get(requirements.culturalContext) || {};
    const difficulty = this.difficultyProgression.get(requirements.difficultyLevel) || {};

    return {
      moduleCount: this.determineModuleCount(requirements.duration),
      lessonsPerModule: this.determineLessonsPerModule(requirements.duration),
      template,
      cultural,
      difficulty
    };
  }

  // توليد الوحدات التعليمية
  private async generateModules(structure: any, requirements: CourseRequirements): Promise<CourseModule[]> {
    const modules: CourseModule[] = [];

    for (let i = 0; i < structure.moduleCount; i++) {
      const module = await this.generateSingleModule(i, structure, requirements);
      modules.push(module);
    }

    return modules;
  }

  // توليد وحدة واحدة
  private async generateSingleModule(index: number, structure: any, requirements: CourseRequirements): Promise<CourseModule> {
    const moduleTitle = this.generateModuleTitle(index, requirements.subject, requirements.culturalContext);
    const lessons = await this.generateLessons(structure.lessonsPerModule, requirements, index);

    return {
      id: `module_${index + 1}`,
      title: moduleTitle,
      description: this.generateModuleDescription(moduleTitle, requirements),
      duration: lessons.reduce((total, lesson) => total + lesson.duration, 0),
      lessons,
      learningObjectives: this.generateModuleObjectives(moduleTitle, requirements)
    };
  }

  // توليد الدروس
  private async generateLessons(count: number, requirements: CourseRequirements, moduleIndex: number): Promise<CourseLesson[]> {
    const lessons: CourseLesson[] = [];

    for (let i = 0; i < count; i++) {
      const lesson = await this.generateSingleLesson(i, moduleIndex, requirements);
      lessons.push(lesson);
    }

    return lessons;
  }

  // توليد درس واحد
  private async generateSingleLesson(lessonIndex: number, moduleIndex: number, requirements: CourseRequirements): Promise<CourseLesson> {
    const lessonTitle = this.generateLessonTitle(lessonIndex, moduleIndex, requirements.subject);
    const content = await this.generateLessonContent(lessonTitle, requirements);
    const examples = this.generateCulturalExamples(lessonTitle, requirements.culturalContext);
    const activities = this.generateLearningActivities(lessonTitle, requirements);

    return {
      id: `lesson_${moduleIndex + 1}_${lessonIndex + 1}`,
      title: lessonTitle,
      content,
      type: this.determineLessonType(lessonIndex, requirements),
      duration: this.calculateLessonDuration(content, activities),
      examples,
      activities,
      resources: this.generateResources(lessonTitle, requirements.culturalContext)
    };
  }

  // تهيئة قوالب المواد
  private initializeTemplates(): void {
    this.subjectTemplates.set('mathematics', {
      modules: ['الأساسيات', 'العمليات', 'التطبيقات', 'حل المشكلات'],
      concepts: ['الأرقام', 'الجمع', 'الطرح', 'الضرب', 'القسمة'],
      examples: ['التسوق', 'الطبخ', 'البناء', 'التجارة']
    });

    this.subjectTemplates.set('science', {
      modules: ['المفاهيم الأساسية', 'التجارب', 'التطبيقات', 'الاكتشافات'],
      concepts: ['الملاحظة', 'الفرضية', 'التجربة', 'النتائج'],
      examples: ['الطبيعة', 'المنزل', 'المختبر', 'الحياة اليومية']
    });

    this.subjectTemplates.set('language', {
      modules: ['القراءة', 'الكتابة', 'المحادثة', 'القواعد'],
      concepts: ['الحروف', 'الكلمات', 'الجمل', 'النصوص'],
      examples: ['القصص', 'الشعر', 'الحوار', 'الرسائل']
    });
  }

  // تهيئة السياقات الثقافية
  private initializeCulturalContexts(): void {
    this.culturalContexts.set('saudi', {
      examples: ['الحج', 'العمرة', 'التمر', 'الجمال', 'الصحراء'],
      values: ['الكرم', 'الضيافة', 'الأسرة', 'التقاليد'],
      places: ['مكة', 'المدينة', 'الرياض', 'جدة', 'الدمام']
    });

    this.culturalContexts.set('gulf', {
      examples: ['النفط', 'اللؤلؤ', 'الصيد', 'التجارة', 'البحر'],
      values: ['التجارة', 'البحر', 'التراث', 'الحداثة'],
      places: ['الخليج', 'الكويت', 'الإمارات', 'قطر', 'البحرين']
    });

    this.culturalContexts.set('arab', {
      examples: ['التاريخ', 'الحضارة', 'الأدب', 'الفن', 'العلوم'],
      values: ['العلم', 'الأدب', 'التاريخ', 'الحضارة'],
      places: ['بغداد', 'القاهرة', 'دمشق', 'قرطبة', 'الأندلس']
    });
  }

  // تهيئة تدرج الصعوبة
  private initializeDifficultyProgression(): void {
    this.difficultyProgression.set('beginner', {
      complexity: 1,
      vocabulary: 'simple',
      examples: 'basic',
      activities: 'guided'
    });

    this.difficultyProgression.set('intermediate', {
      complexity: 2,
      vocabulary: 'moderate',
      examples: 'practical',
      activities: 'semi-independent'
    });

    this.difficultyProgression.set('advanced', {
      complexity: 3,
      vocabulary: 'complex',
      examples: 'sophisticated',
      activities: 'independent'
    });
  }

  // دوال مساعدة لتوليد المحتوى
  private determineModuleCount(duration: string): number {
    switch (duration) {
      case 'short': return 3;
      case 'medium': return 5;
      case 'long': return 8;
      default: return 4;
    }
  }

  private determineLessonsPerModule(duration: string): number {
    switch (duration) {
      case 'short': return 3;
      case 'medium': return 4;
      case 'long': return 6;
      default: return 4;
    }
  }

  private getDefaultTemplate(): any {
    return {
      modules: ['مقدمة', 'الأساسيات', 'التطبيق', 'الخلاصة'],
      concepts: ['المفاهيم', 'الممارسة', 'التطبيق', 'التقييم'],
      examples: ['أمثلة بسيطة', 'أمثلة متوسطة', 'أمثلة متقدمة']
    };
  }

  private generateCourseDescription(requirements: CourseRequirements): string {
    return `دورة شاملة في ${requirements.subject} مصممة خصيصاً للمستوى ${requirements.difficultyLevel}.
    تتضمن هذه الدورة محتوى تفاعلي وأمثلة من البيئة ${requirements.culturalContext}
    لضمان تجربة تعلم فعالة ومناسبة ثقافياً.`;
  }

  private generateLearningOutcomes(requirements: CourseRequirements): string[] {
    const outcomes = [
      `فهم المفاهيم الأساسية في ${requirements.subject}`,
      `تطبيق المعرفة المكتسبة في مواقف عملية`,
      `تطوير مهارات التفكير النقدي والتحليلي`,
      `القدرة على حل المشكلات بطريقة إبداعية`
    ];

    if (requirements.includeAssessments) {
      outcomes.push('اجتياز التقييمات بنجاح وإثبات الكفاءة');
    }

    return outcomes;
  }

  private calculateTotalDuration(modules: CourseModule[]): number {
    return modules.reduce((total, module) => total + module.duration, 0);
  }

  private createLearningPath(modules: CourseModule[]): string[] {
    return modules.map(module => module.id);
  }

  private generateModuleTitle(index: number, subject: string, cultural: string): string {
    const template = this.subjectTemplates.get(subject);
    if (template && template.modules[index]) {
      return `الوحدة ${index + 1}: ${template.modules[index]}`;
    }
    return `الوحدة ${index + 1}: أساسيات ${subject}`;
  }

  private generateModuleDescription(title: string, requirements: CourseRequirements): string {
    return `${title} - وحدة تعليمية شاملة تغطي المفاهيم الأساسية مع أمثلة عملية من البيئة ${requirements.culturalContext}.`;
  }

  private generateModuleObjectives(title: string, requirements: CourseRequirements): string[] {
    return [
      `فهم المفاهيم الأساسية في ${title}`,
      `تطبيق المعرفة في مواقف عملية`,
      `تطوير مهارات حل المشكلات`
    ];
  }

  private generateLessonTitle(lessonIndex: number, moduleIndex: number, subject: string): string {
    const template = this.subjectTemplates.get(subject);
    if (template && template.concepts[lessonIndex]) {
      return `الدرس ${lessonIndex + 1}: ${template.concepts[lessonIndex]}`;
    }
    return `الدرس ${lessonIndex + 1}: مفاهيم أساسية`;
  }

  private async generateLessonContent(title: string, requirements: CourseRequirements): Promise<string> {
    const cultural = this.culturalContexts.get(requirements.culturalContext) || {};
    const difficulty = this.difficultyProgression.get(requirements.difficultyLevel) || {};

    // توليد محتوى منظم وواضح
    const content = this.generateStructuredContent(title, requirements, cultural, difficulty);

    return content;
  }

  private generateStructuredContent(title: string, requirements: CourseRequirements, cultural: any, difficulty: any): string {
    const examples = cultural.examples || ['مثال عام'];
    const places = cultural.places || ['مكان عام'];

    // محتوى مخصص حسب المادة
    let specificContent = '';

    switch (requirements.subject) {
      case 'mathematics':
        specificContent = this.generateMathContent(title, examples, difficulty);
        break;
      case 'science':
        specificContent = this.generateScienceContent(title, examples, difficulty);
        break;
      case 'language':
        specificContent = this.generateLanguageContent(title, examples, difficulty);
        break;
      case 'history':
        specificContent = this.generateHistoryContent(title, places, difficulty);
        break;
      default:
        specificContent = this.generateGeneralContent(title, examples, difficulty);
    }

    // إنشاء محتوى نظيف ومنظم
    const cleanTitle = title.replace(/الدرس \d+: /, '');

    const content = `${cleanTitle}

🎯 أهداف الدرس:
${this.generateLearningObjectives(title, requirements)}

📚 المحتوى الأساسي:
${specificContent}

💡 أمثلة تطبيقية:
${this.generatePracticalExamples(title, cultural, requirements)}

🔍 أنشطة تفاعلية:
${this.generateInteractiveActivities(title, requirements)}

📝 ملخص الدرس:
${this.generateLessonSummary(title, requirements)}

🎯 التقييم الذاتي:
${this.generateSelfAssessment(title, requirements)}`;

    return content;
  }

  private generateMathContent(title: string, examples: string[], difficulty: any): string {
    const level = difficulty.complexity || 1;

    if (title.includes('الأرقام') || title.includes('الأعداد')) {
      return `مقدمة في عالم الأرقام

الأرقام هي لغة الكون، وهي الأساس الذي تقوم عليه جميع العلوم والتقنيات الحديثة. في هذا الدرس، سنتعرف على الأرقام وأهميتها في حياتنا اليومية.

🔢 ما هي الأرقام؟

الأرقام هي رموز رياضية نستخدمها للتعبير عن الكميات والقيم. النظام العربي للأرقام الذي نستخدمه اليوم هو:

0 - 1 - 2 - 3 - 4 - 5 - 6 - 7 - 8 - 9

هل تعلم؟ هذا النظام العشري اخترعه العلماء العرب والمسلمون، وانتشر في العالم كله!

📊 أنواع الأعداد

1. الأعداد الطبيعية
هي الأعداد التي نستخدمها في العد: 1، 2، 3، 4، 5...
مثال: عدد الطلاب في الفصل، عدد أيام الأسبوع

2. العدد صفر (0)
اختراع عربي عظيم غير مجرى التاريخ! يمثل "لا شيء" ولكنه مهم جداً في الرياضيات.

3. الأعداد الزوجية والفردية
- زوجية: 2، 4، 6، 8، 10... (تقبل القسمة على 2)
- فردية: 1، 3، 5، 7، 9... (لا تقبل القسمة على 2)

🌍 الأرقام في حياتنا اليومية

في المنزل:
- عدد أفراد العائلة
- ساعات النوم (8 ساعات)
- درجة حرارة المكيف (24 درجة)

في المدرسة:
- عدد الحصص (6 حصص)
- الدرجات والعلامات
- رقم الفصل والمقعد

في المجتمع:
- أسعار السلع (10 ريال)
- أرقام الهواتف
- عناوين المنازل

🎯 تطبيقات عملية

التمرين الأول: اعد الأشياء من حولك
- كم قلماً في حقيبتك؟
- كم كتاباً على المكتب؟
- كم نافذة في الغرفة؟

التمرين الثاني: اكتشف النمط
- 2، 4، 6، 8، ؟
- 1، 3، 5، 7، ؟

💡 خلاصة الدرس

الأرقام ليست مجرد رموز، بل هي أدوات قوية تساعدنا على:
- فهم العالم من حولنا
- حل المشكلات اليومية
- التواصل بدقة
- بناء المستقبل`;
    }

    if (title.includes('الجمع') || title.includes('الإضافة')) {
      return `## تعلم عملية الجمع

الجمع هو أول العمليات الحسابية التي نتعلمها، وهو أساس الرياضيات.

### 🧮 مفهوم الجمع

الجمع يعني **ضم** أو **إضافة** كميات مختلفة للحصول على المجموع الكلي.

**الرمز:** نستخدم إشارة (+) للجمع

**المثال الأساسي:**
3 + 2 = 5

### 📝 خطوات الجمع

#### 1. الجمع البسيط (الأرقام الصغيرة)
- 2 + 1 = 3
- 4 + 3 = 7
- 5 + 4 = 9

#### 2. الجمع باستخدام الأصابع
استخدم أصابعك للعد:
- ارفع 3 أصابع
- أضف 2 أصابع أخرى
- اعد المجموع = 5 أصابع

#### 3. الجمع على خط الأعداد
ارسم خطاً وضع عليه الأرقام من 0 إلى 10، ثم تحرك عليه للجمع.

### 🎯 أمثلة من الحياة اليومية

**في السوق:**
- اشتريت 3 تفاحات + 2 تفاحة = 5 تفاحات

**في المدرسة:**
- حضر 15 طالباً + 10 طلاب = 25 طالباً

**في البيت:**
- 4 كؤوس + 3 كؤوس = 7 كؤوس

### 🏆 تمارين تطبيقية

**المستوى الأول:**
- 1 + 1 = ؟
- 2 + 3 = ؟
- 4 + 2 = ؟

**المستوى الثاني:**
- 5 + 4 = ؟
- 6 + 3 = ؟
- 7 + 2 = ؟

### 💡 نصائح للنجاح

1. **ابدأ بالأرقام الصغيرة**
2. **استخدم الأدوات المساعدة** (أصابع، مكعبات)
3. **مارس يومياً** ولو لدقائق قليلة
4. **اربط الجمع بالحياة اليومية**`;
    }

    return `## ${title}

### 🎯 أهداف التعلم
بنهاية هذا الدرس ستكون قادراً على:
- فهم المفاهيم الأساسية في ${title}
- تطبيق ما تعلمته في مواقف حقيقية
- حل المسائل المتعلقة بالموضوع

### 📚 المحتوى الأساسي

#### المفهوم الرئيسي
${title} هو موضوع مهم في الرياضيات يساعدنا على فهم وحل العديد من المشكلات اليومية.

#### الخطوات الأساسية
1. **التعرف على المفهوم**
2. **فهم القوانين والقواعد**
3. **التطبيق العملي**
4. **حل التمارين**

### 🌟 أمثلة تطبيقية
- مثال من الحياة اليومية
- تطبيق في البيئة المحلية
- استخدام في المهن المختلفة

### 🎯 تمارين ومسائل
مجموعة متنوعة من التمارين لتعزيز الفهم وتطوير المهارات.

### 📝 ملخص الدرس
النقاط المهمة التي يجب تذكرها من هذا الدرس.`;
  }

  private generateScienceContent(title: string, examples: string[], difficulty: any): string {
    return `### ${title}

**الملاحظة والاستكشاف:**
العلم يبدأ بالملاحظة والتساؤل. دعنا نستكشف هذا الموضوع معاً!

**المفاهيم العلمية:**
- التعريفات والمصطلحات
- الظواهر الطبيعية
- القوانين العلمية

**التجارب والأنشطة:**
- تجارب بسيطة يمكن تطبيقها
- ملاحظات من البيئة المحيطة
- استنتاجات علمية

**التطبيقات في الحياة:**
- كيف نرى هذا المفهوم في حياتنا اليومية
- أمثلة من الطبيعة والتكنولوجيا
- فوائد فهم هذا المفهوم`;
  }

  private generateLanguageContent(title: string, examples: string[], difficulty: any): string {
    if (title.includes('الحروف') || title.includes('الأبجدية')) {
      return `تعلم الحروف العربية

اللغة العربية تحتوي على 28 حرفاً جميلاً، كل حرف له شكل وصوت مميز.

🔤 الحروف الأبجدية العربية

الحروف بالترتيب الأبجدي:
أ - ب - ت - ث - ج - ح - خ - د - ذ - ر - ز - س - ش - ص - ض - ط - ظ - ع - غ - ف - ق - ك - ل - م - ن - هـ - و - ي

📝 أشكال الحروف

كل حرف عربي له أربعة أشكال حسب موقعه في الكلمة:

حرف الباء (ب) مثلاً:
- في بداية الكلمة: بـ (مثل: بيت)
- في وسط الكلمة: ـبـ (مثل: كتاب)
- في نهاية الكلمة: ـب (مثل: كتب)
- منفصل: ب

🎵 أصوات الحروف

الحروف القصيرة (الحركات):
- الفتحة: َ (صوت "أ" قصير)
- الضمة: ُ (صوت "أو" قصير)
- الكسرة: ِ (صوت "إي" قصير)

الحروف الطويلة:
- الألف: ا (مثل: باب)
- الواو: و (مثل: نور)
- الياء: ي (مثل: بيت)

🏠 الحروف في البيت

دعنا نتعلم الحروف من خلال أشياء نراها كل يوم:

- أ: أسرة، أب، أم
- ب: بيت، باب، بطانية
- ت: تلفاز، تفاح، تمر
- ث: ثلاجة، ثوب، ثعلب
- ج: جدة، جد، جوال

### ✍️ كتابة الحروف

**نصائح للكتابة الجميلة:**
1. **ابدأ من اليمين**: العربية تُكتب من اليمين لليسار
2. **اتبع الاتجاه**: كل حرف له طريقة كتابة محددة
3. **تدرب يومياً**: الممارسة تجعل الكتابة أجمل
4. **استخدم القلم الصحيح**: قلم رصاص أو قلم حبر

### 🎯 تمارين الحروف

**التمرين الأول: التعرف على الحروف**
- انظر حولك واكتب أسماء الأشياء
- ابحث عن الحروف في كل كلمة
- اقرأ الحروف بصوت عالٍ

**التمرين الثاني: كتابة الحروف**
- اكتب كل حرف 10 مرات
- اكتب كلمات تبدأ بكل حرف
- ارسم الحروف في الهواء بإصبعك

### 🎮 ألعاب الحروف

**لعبة البحث عن الحروف:**
- ابحث عن حرف معين في الغرفة
- اعد كم مرة تجد هذا الحرف
- اكتب قائمة بالكلمات التي وجدتها

**لعبة تكوين الكلمات:**
- استخدم حروف اسمك لتكوين كلمات جديدة
- اطلب من الأسرة المشاركة
- من يكون أكثر الكلمات يفوز!

### 💡 نصائح للحفظ

1. **اربط كل حرف بصورة**: أ = أسد، ب = بطة
2. **استخدم الأغاني**: هناك أغاني جميلة للحروف
3. **اكتب في الرمل**: أو على الزجاج المبخر
4. **العب مع الأصدقاء**: التعلم أمتع مع الآخرين

### 🌟 الهدف النهائي

بنهاية تعلم الحروف ستكون قادراً على:
- **قراءة** أي كلمة عربية
- **كتابة** أفكارك بوضوح
- **فهم** النصوص والقصص
- **التواصل** بثقة أكبر`;
    }

    if (title.includes('القراءة')) {
      return `## فن القراءة العربية

القراءة هي مفتاح المعرفة وبوابة الثقافة. دعنا نتعلم كيف نقرأ بطلاقة وفهم.

### 📖 خطوات القراءة الصحيحة

#### 1. التحضير للقراءة
- **اجلس في مكان مريح** ومضاء جيداً
- **أمسك الكتاب بالطريقة الصحيحة**
- **ابدأ من اليمين** واقرأ نحو اليسار

#### 2. قراءة الحروف
- **تعرف على كل حرف** في الكلمة
- **اربط الحروف معاً** لتكوين مقاطع
- **اقرأ المقاطع** لتكوين الكلمة كاملة

#### 3. فهم المعنى
- **فكر في معنى كل كلمة**
- **اربط الكلمات** لفهم الجملة
- **تخيل ما تقرأه** في ذهنك

### 🎯 أنواع القراءة

#### القراءة الصامتة
- قراءة بالعينين فقط
- أسرع من القراءة الجهرية
- مفيدة للفهم والاستيعاب

#### القراءة الجهرية
- قراءة بصوت مسموع
- تحسن النطق والتجويد
- مفيدة للحفظ والتذكر

### 📚 نصائح لقراءة أفضل

1. **ابدأ بالكتب السهلة** ثم تدرج للأصعب
2. **اقرأ كل يوم** ولو لدقائق قليلة
3. **استخدم إصبعك** لتتبع السطور
4. **توقف عند الكلمات الصعبة** واسأل عن معناها
5. **أعد قراءة الجمل المهمة** لفهمها أكثر

### 🌟 فوائد القراءة

- **تزيد المفردات** وتحسن اللغة
- **تنمي الخيال** والإبداع
- **تعلم معلومات جديدة** عن العالم
- **تحسن التركيز** والانتباه
- **تجعلك أكثر ثقافة** ومعرفة`;
    }

    return `### ${title}

**أساسيات اللغة العربية:**
اللغة العربية لغة القرآن الكريم، وهي من أجمل لغات العالم وأغناها.

**المهارات اللغوية الأساسية:**
- **القراءة**: فهم النصوص وتحليلها
- **الكتابة**: التعبير بوضوح وجمال
- **المحادثة**: التواصل الفعال
- **الاستماع**: فهم المسموع والتفاعل معه

**التطبيق العملي:**
- كتابة نصوص إبداعية
- قراءة وتحليل النصوص
- المحادثة والحوار
- تطوير المهارات اللغوية`;
  }

  private generateHistoryContent(title: string, places: string[], difficulty: any): string {
    return `### ${title}

**رحلة عبر التاريخ:**
التاريخ هو ذاكرة الأمم وخزانة تجاربها. دعنا نتعلم من الماضي لنبني المستقبل.

**الأحداث التاريخية:**
- الأسباب والدوافع
- سير الأحداث
- النتائج والتأثيرات

**الشخصيات التاريخية:**
- القادة والمفكرون
- العلماء والمخترعون
- الأبطال والرواد

**الدروس المستفادة:**
- العبر والحكم
- التطبيق في الحاضر
- بناء المستقبل

**الأماكن التاريخية:**
- المواقع الأثرية
- المدن التاريخية
- المعالم الحضارية`;
  }

  private generateGeneralContent(title: string, examples: string[], difficulty: any): string {
    return `### ${title}

**مقدمة الموضوع:**
موضوع شيق ومفيد يساعدنا على فهم العالم من حولنا بشكل أفضل.

**المحاور الرئيسية:**
- التعريف والمفاهيم الأساسية
- الأهمية والفوائد
- التطبيقات العملية

**الأنشطة التعليمية:**
- تمارين تطبيقية
- مناقشات جماعية
- مشاريع عملية

**الخلاصة:**
ملخص للنقاط المهمة والدروس المستفادة من هذا الموضوع.`;
  }

  private generateCulturalExamples(title: string, cultural: string): string[] {
    const context = this.culturalContexts.get(cultural) || {};
    const examples = context.examples || ['مثال عام'];

    return examples.slice(0, 3).map((example: string) =>
      `مثال من ${cultural}: كيفية تطبيق ${title} في ${example}`
    );
  }

  private generateLearningActivities(title: string, requirements: CourseRequirements): LearningActivity[] {
    const activities: LearningActivity[] = [
      {
        id: `activity_${Date.now()}_1`,
        type: 'exercise',
        title: `تمرين تطبيقي: ${title}`,
        description: `تمرين عملي لتطبيق مفاهيم ${title}`,
        instructions: [
          'اقرأ المفهوم بعناية',
          'حلل الأمثلة المعطاة',
          'طبق المفهوم على مثال جديد'
        ],
        estimatedTime: 15,
        difficulty: requirements.difficultyLevel === 'beginner' ? 3 :
                   requirements.difficultyLevel === 'intermediate' ? 5 : 7
      }
    ];

    if (requirements.includeInteractiveElements) {
      activities.push({
        id: `activity_${Date.now()}_2`,
        type: 'discussion',
        title: `مناقشة: تطبيقات ${title}`,
        description: `مناقشة جماعية حول تطبيقات ${title} في الحياة اليومية`,
        instructions: [
          'شارك تجربتك الشخصية',
          'اطرح أسئلة على الزملاء',
          'ناقش التحديات والحلول'
        ],
        estimatedTime: 20,
        difficulty: 4
      });
    }

    return activities;
  }

  private determineLessonType(index: number, requirements: CourseRequirements): 'text' | 'video' | 'interactive' | 'quiz' | 'exercise' {
    if (requirements.includeInteractiveElements && index % 3 === 0) {
      return 'interactive';
    }
    if (index % 4 === 3) {
      return 'quiz';
    }
    return index % 2 === 0 ? 'text' : 'exercise';
  }

  private calculateLessonDuration(content: string, activities: LearningActivity[]): number {
    const contentDuration = Math.max(10, Math.floor(content.length / 50)); // تقدير بناءً على طول المحتوى
    const activitiesDuration = activities.reduce((total, activity) => total + activity.estimatedTime, 0);
    return contentDuration + activitiesDuration;
  }

  private generateResources(title: string, cultural: string): string[] {
    return [
      `مرجع أساسي: ${title}`,
      `مصادر إضافية من التراث ${cultural}`,
      'روابط لمواد تعليمية تكميلية',
      'أدوات تفاعلية للممارسة'
    ];
  }

  private async generateAssessments(modules: CourseModule[], requirements: CourseRequirements): Promise<CourseAssessment[]> {
    const assessments: CourseAssessment[] = [];

    for (const module of modules) {
      const assessment: CourseAssessment = {
        id: `assessment_${module.id}`,
        type: 'quiz',
        title: `تقييم ${module.title}`,
        questions: await this.generateAssessmentQuestions(module, requirements),
        passingScore: 70,
        timeLimit: 30
      };
      assessments.push(assessment);
    }

    return assessments;
  }

  private generateLearningObjectives(title: string, requirements: CourseRequirements): string {
    const cleanTitle = title.replace(/الدرس \d+: /, '');
    const culturalContext = requirements.culturalContext === 'arab' ? 'العربية' : requirements.culturalContext;

    return `- فهم المفاهيم الأساسية في ${cleanTitle}
- تطبيق المعرفة المكتسبة في مواقف عملية
- تطوير مهارات التفكير النقدي والتحليلي
- ربط الموضوع بالحياة اليومية والثقافة ${culturalContext}`;
  }

  private generatePracticalExamples(title: string, cultural: any, requirements: CourseRequirements): string {
    const cleanTitle = title.replace(/الدرس \d+: /, '');
    const examples = cultural.examples || ['الحياة اليومية'];
    const places = cultural.places || ['المنطقة المحلية'];

    if (cleanTitle.includes('الحروف')) {
      return `مثال ١: الحروف في أسماء الأطفال
- اكتب اسمك بالحروف العربية
- اعد الحروف في اسمك
- ابحث عن أصدقاء أسماؤهم تبدأ بنفس الحرف

مثال ٢: الحروف في البيت
- ابحث عن الأشياء التي تبدأ بحرف الباء
- اكتب قائمة بها: بيت، باب، بطانية
- ارسم الأشياء واكتب أسماءها`;
    }

    return `مثال ١: تطبيق ${cleanTitle} في ${examples[0] || 'الحياة اليومية'}
- شرح مفصل للمثال
- خطوات التطبيق
- النتائج المتوقعة

مثال ٢: استخدام ${cleanTitle} في ${places[0] || 'البيئة المحلية'}
- السياق والخلفية
- طريقة التطبيق
- الفوائد المحققة`;
  }

  private generateInteractiveActivities(title: string, requirements: CourseRequirements): string {
    const cleanTitle = title.replace(/الدرس \d+: /, '');

    if (!requirements.includeInteractiveElements) {
      return 'تمارين تطبيقية للممارسة الذاتية.';
    }

    if (cleanTitle.includes('الحروف')) {
      return `نشاط ١: لعبة الحروف المخفية
- اختر حرفاً من الأبجدية
- ابحث عن 5 أشياء في الغرفة تبدأ بهذا الحرف
- اكتب أسماءها واقرأها بصوت عالٍ

نشاط ٢: كتابة الحروف في الهواء
- ارسم الحروف في الهواء بإصبعك
- اطلب من صديق أن يخمن الحرف
- تبادلوا الأدوار واستمتعوا

نشاط ٣: قصة الحروف
- اختر 3 حروف مختلفة
- اخترع قصة قصيرة تحتوي على كلمات تبدأ بهذه الحروف
- ارسم صوراً للقصة`;
    }

    return `نشاط ١: التطبيق العملي
- جرب تطبيق مفاهيم ${cleanTitle} في موقف حقيقي
- سجل ملاحظاتك وتجربتك
- شارك النتائج مع زملائك

نشاط ٢: المناقشة الجماعية
- ناقش مع زملائك أهمية ${cleanTitle}
- اطرح أسئلة واستفسارات
- تبادل الخبرات والتجارب

نشاط ٣: المشروع الإبداعي
- أنشئ مشروعاً يطبق مفاهيم ${cleanTitle}
- استخدم إبداعك وخيالك
- اعرض مشروعك على الآخرين`;
  }

  private generateLessonSummary(title: string, requirements: CourseRequirements): string {
    return `في هذا الدرس تعلمنا عن ${title} وأهميته في حياتنا.

**النقاط الرئيسية:**
- المفاهيم الأساسية والتعريفات
- التطبيقات العملية في الحياة اليومية
- الأمثلة من البيئة ${requirements.culturalContext}
- الأنشطة التفاعلية والتطبيقية

**ما تعلمناه:**
- كيفية فهم وتطبيق المفاهيم
- ربط النظرية بالتطبيق العملي
- تطوير مهارات التفكير النقدي`;
  }

  private generateSelfAssessment(title: string, requirements: CourseRequirements): string {
    return `**اختبر فهمك:**

١. هل تستطيع شرح المفاهيم الأساسية في ${title}؟
٢. هل يمكنك تطبيق ما تعلمته في موقف عملي؟
٣. هل تفهم العلاقة بين ${title} والحياة اليومية؟
٤. هل تشعر بالثقة في استخدام هذه المعرفة؟

**إذا أجبت بـ "نعم" على معظم الأسئلة، فأنت على الطريق الصحيح! 🎉**
**إذا كانت إجابتك "لا" على بعض الأسئلة، راجع المحتوى مرة أخرى أو اطلب المساعدة.**`;
  }

  private async generateAssessmentQuestions(module: CourseModule, requirements: CourseRequirements): Promise<AssessmentQuestion[]> {
    const questions: AssessmentQuestion[] = [];

    for (let i = 0; i < 5; i++) {
      questions.push({
        id: `question_${module.id}_${i + 1}`,
        type: 'multiple_choice',
        question: `سؤال حول ${module.title} - ${i + 1}`,
        options: [
          'الخيار الأول',
          'الخيار الثاني (الصحيح)',
          'الخيار الثالث',
          'الخيار الرابع'
        ],
        correctAnswer: 'الخيار الثاني (الصحيح)',
        explanation: `الإجابة الصحيحة هي الخيار الثاني لأنه يتماشى مع مفاهيم ${module.title}`,
        points: 2
      });
    }

    return questions;
  }
}
