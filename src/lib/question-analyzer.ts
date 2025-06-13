// نظام تحليل الأسئلة لمرجان المعلم الافتراضي
// Question Analysis System for Marjan Virtual Teacher

export interface QuestionAnalysis {
  type: QuestionType;
  subject: Subject;
  complexity: ComplexityLevel;
  intent: QuestionIntent;
  keywords: string[];
  suggestedApproach: TeachingApproach;
  requiresVisualAid: boolean;
  estimatedDifficulty: number; // 1-10
  socraticQuestions: string[];
}

export type QuestionType = 
  | 'factual'           // سؤال عن حقيقة أو معلومة
  | 'conceptual'        // سؤال عن مفهوم أو فكرة
  | 'procedural'        // سؤال عن كيفية عمل شيء
  | 'analytical'        // سؤال يتطلب تحليل
  | 'creative'          // سؤال يتطلب إبداع
  | 'problem_solving'   // سؤال عن حل مشكلة
  | 'comparison'        // سؤال مقارنة
  | 'explanation';      // طلب شرح

export type Subject = 
  | 'mathematics'
  | 'science'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'programming'
  | 'arabic'
  | 'history'
  | 'geography'
  | 'general';

export type ComplexityLevel = 'basic' | 'intermediate' | 'advanced';

export type QuestionIntent = 
  | 'learn_concept'     // يريد تعلم مفهوم جديد
  | 'clarify_doubt'     // يريد توضيح شك أو التباس
  | 'solve_problem'     // يريد حل مشكلة محددة
  | 'understand_how'    // يريد فهم كيفية عمل شيء
  | 'get_example'       // يريد أمثلة
  | 'check_answer'      // يريد التأكد من إجابة
  | 'explore_topic';    // يريد استكشاف موضوع

export type TeachingApproach = 
  | 'socratic_method'   // الطريقة السقراطية
  | 'direct_explanation' // الشرح المباشر
  | 'example_based'     // التعلم بالأمثلة
  | 'visual_demonstration' // العرض البصري
  | 'step_by_step'      // خطوة بخطوة
  | 'analogy_based';    // التعلم بالتشبيه

// كلمات مفتاحية لتحديد المواد
const SUBJECT_KEYWORDS = {
  mathematics: [
    'رياضيات', 'حساب', 'جمع', 'طرح', 'ضرب', 'قسمة', 'كسر', 'عدد', 'رقم',
    'معادلة', 'مثلث', 'مربع', 'دائرة', 'مساحة', 'محيط', 'حجم', 'زاوية',
    'جبر', 'هندسة', 'إحصاء', 'احتمال', 'تفاضل', 'تكامل', 'مصفوفة',
    'math', 'number', 'equation', 'triangle', 'circle', 'algebra'
  ],
  
  science: [
    'علوم', 'تجربة', 'مختبر', 'ذرة', 'جزيء', 'خلية', 'نبات', 'حيوان',
    'طاقة', 'قوة', 'حركة', 'سرعة', 'كتلة', 'وزن', 'حرارة', 'ضوء',
    'science', 'experiment', 'atom', 'molecule', 'cell', 'energy'
  ],
  
  physics: [
    'فيزياء', 'قوة', 'حركة', 'سرعة', 'تسارع', 'كتلة', 'طاقة', 'شغل',
    'كهرباء', 'مغناطيس', 'ضوء', 'صوت', 'موجة', 'تردد', 'جاذبية',
    'physics', 'force', 'motion', 'velocity', 'acceleration', 'gravity'
  ],
  
  chemistry: [
    'كيمياء', 'تفاعل', 'عنصر', 'مركب', 'ذرة', 'إلكترون', 'بروتون',
    'جدول دوري', 'حمض', 'قاعدة', 'ملح', 'أكسدة', 'اختزال',
    'chemistry', 'reaction', 'element', 'compound', 'periodic table'
  ],
  
  programming: [
    'برمجة', 'كود', 'برنامج', 'خوارزمية', 'متغير', 'دالة', 'حلقة',
    'شرط', 'مصفوفة', 'قائمة', 'كائن', 'فئة', 'وراثة', 'قاعدة بيانات',
    'programming', 'code', 'algorithm', 'variable', 'function', 'loop'
  ]
};

// كلمات مفتاحية لتحديد نوع السؤال
const QUESTION_TYPE_KEYWORDS = {
  factual: ['ما هو', 'ما هي', 'من هو', 'متى', 'أين', 'كم', 'what is', 'who is', 'when', 'where'],
  conceptual: ['لماذا', 'كيف يعمل', 'ما المقصود', 'اشرح', 'وضح', 'why', 'how does', 'explain'],
  procedural: ['كيف أفعل', 'كيف أحل', 'خطوات', 'طريقة', 'how to', 'steps', 'method'],
  analytical: ['قارن', 'حلل', 'ما الفرق', 'ما العلاقة', 'compare', 'analyze', 'difference'],
  problem_solving: ['حل', 'احسب', 'أوجد', 'solve', 'calculate', 'find'],
  explanation: ['اشرح لي', 'وضح لي', 'أريد أن أفهم', 'explain to me', 'help me understand']
};

// كلمات تدل على مستوى التعقيد
const COMPLEXITY_INDICATORS = {
  basic: ['بسيط', 'أساسي', 'مبتدئ', 'سهل', 'basic', 'simple', 'easy', 'beginner'],
  intermediate: ['متوسط', 'عادي', 'intermediate', 'medium', 'average'],
  advanced: ['متقدم', 'معقد', 'صعب', 'متخصص', 'advanced', 'complex', 'difficult', 'expert']
};

export class QuestionAnalyzer {
  
  /**
   * تحليل السؤال وإرجاع معلومات مفصلة عنه
   */
  analyzeQuestion(question: string): QuestionAnalysis {
    const normalizedQuestion = this.normalizeText(question);
    
    return {
      type: this.detectQuestionType(normalizedQuestion),
      subject: this.detectSubject(normalizedQuestion),
      complexity: this.detectComplexity(normalizedQuestion),
      intent: this.detectIntent(normalizedQuestion),
      keywords: this.extractKeywords(normalizedQuestion),
      suggestedApproach: this.suggestTeachingApproach(normalizedQuestion),
      requiresVisualAid: this.requiresVisualAid(normalizedQuestion),
      estimatedDifficulty: this.estimateDifficulty(normalizedQuestion),
      socraticQuestions: this.generateSocraticQuestions(normalizedQuestion)
    };
  }
  
  /**
   * تطبيع النص (إزالة علامات الترقيم، توحيد المسافات، إلخ)
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[؟?!.،,]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  /**
   * تحديد نوع السؤال
   */
  private detectQuestionType(question: string): QuestionType {
    for (const [type, keywords] of Object.entries(QUESTION_TYPE_KEYWORDS)) {
      if (keywords.some(keyword => question.includes(keyword))) {
        return type as QuestionType;
      }
    }
    
    // تحليل إضافي بناءً على بنية السؤال
    if (question.includes('حل') || question.includes('احسب')) {
      return 'problem_solving';
    }
    
    if (question.includes('لماذا') || question.includes('why')) {
      return 'conceptual';
    }
    
    return 'factual'; // افتراضي
  }
  
  /**
   * تحديد المادة الدراسية
   */
  private detectSubject(question: string): Subject {
    let maxMatches = 0;
    let detectedSubject: Subject = 'general';
    
    for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
      const matches = keywords.filter(keyword => question.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedSubject = subject as Subject;
      }
    }
    
    return detectedSubject;
  }
  
  /**
   * تحديد مستوى التعقيد
   */
  private detectComplexity(question: string): ComplexityLevel {
    for (const [level, indicators] of Object.entries(COMPLEXITY_INDICATORS)) {
      if (indicators.some(indicator => question.includes(indicator))) {
        return level as ComplexityLevel;
      }
    }
    
    // تحليل إضافي بناءً على طول السؤال ومعقدية المصطلحات
    const wordCount = question.split(' ').length;
    const hasComplexTerms = this.hasComplexTerms(question);
    
    if (wordCount > 15 || hasComplexTerms) {
      return 'advanced';
    } else if (wordCount > 8) {
      return 'intermediate';
    } else {
      return 'basic';
    }
  }
  
  /**
   * تحديد نية السؤال
   */
  private detectIntent(question: string): QuestionIntent {
    if (question.includes('مثال') || question.includes('example')) {
      return 'get_example';
    }
    
    if (question.includes('كيف') || question.includes('how')) {
      return 'understand_how';
    }
    
    if (question.includes('حل') || question.includes('solve')) {
      return 'solve_problem';
    }
    
    if (question.includes('لا أفهم') || question.includes('confused')) {
      return 'clarify_doubt';
    }
    
    if (question.includes('صحيح') || question.includes('correct')) {
      return 'check_answer';
    }
    
    return 'learn_concept'; // افتراضي
  }
  
  /**
   * اقتراح نهج التدريس المناسب
   */
  private suggestTeachingApproach(question: string): TeachingApproach {
    const questionType = this.detectQuestionType(question);
    const subject = this.detectSubject(question);
    
    // قواعد اختيار نهج التدريس
    if (questionType === 'factual') {
      return 'direct_explanation';
    }
    
    if (questionType === 'procedural' || questionType === 'problem_solving') {
      return 'step_by_step';
    }
    
    if (subject === 'mathematics' || subject === 'physics') {
      return 'visual_demonstration';
    }
    
    if (questionType === 'conceptual') {
      return 'socratic_method';
    }
    
    return 'example_based'; // افتراضي
  }
  
  /**
   * تحديد ما إذا كان السؤال يحتاج توضيح بصري
   */
  private requiresVisualAid(question: string): boolean {
    const visualKeywords = [
      'شكل', 'رسم', 'مخطط', 'صورة', 'مثلث', 'دائرة', 'مربع', 'خط',
      'رسم بياني', 'جدول', 'معادلة', 'دائرة كهربائية',
      'shape', 'draw', 'diagram', 'chart', 'graph', 'triangle', 'circle'
    ];
    
    return visualKeywords.some(keyword => question.includes(keyword));
  }
  
  /**
   * تقدير صعوبة السؤال (1-10)
   */
  private estimateDifficulty(question: string): number {
    let difficulty = 5; // متوسط
    
    const complexity = this.detectComplexity(question);
    const subject = this.detectSubject(question);
    const questionType = this.detectQuestionType(question);
    
    // تعديل بناءً على التعقيد
    if (complexity === 'basic') difficulty -= 2;
    if (complexity === 'advanced') difficulty += 2;
    
    // تعديل بناءً على المادة
    if (subject === 'mathematics' || subject === 'physics') difficulty += 1;
    if (subject === 'programming') difficulty += 1;
    
    // تعديل بناءً على نوع السؤال
    if (questionType === 'analytical' || questionType === 'creative') difficulty += 1;
    if (questionType === 'factual') difficulty -= 1;
    
    return Math.max(1, Math.min(10, difficulty));
  }
  
  /**
   * توليد أسئلة سقراطية توجيهية
   */
  private generateSocraticQuestions(question: string): string[] {
    const subject = this.detectSubject(question);
    const questionType = this.detectQuestionType(question);
    
    // أسئلة عامة للبداية
    const generalQuestions = [
      "ما الذي تعرفه بالفعل عن هذا الموضوع؟",
      "هل يمكنك إعطائي مثالاً من الحياة اليومية؟",
      "ما رأيك، لماذا يحدث هذا؟",
      "كيف تعتقد أن هذا يعمل؟"
    ];
    
    // أسئلة خاصة بالمادة
    const subjectSpecificQuestions = this.getSubjectSpecificQuestions(subject);
    
    return [...generalQuestions.slice(0, 2), ...subjectSpecificQuestions.slice(0, 2)];
  }
  
  /**
   * الحصول على أسئلة خاصة بالمادة
   */
  private getSubjectSpecificQuestions(subject: Subject): string[] {
    const questionBank: Record<Subject, string[]> = {
      mathematics: [
        "هل يمكنك تخمين النتيجة قبل أن نحسبها؟",
        "ما الأدوات التي نحتاجها لحل هذه المسألة؟",
        "هل هناك طريقة أخرى للوصول لنفس النتيجة؟"
      ],
      science: [
        "ماذا تتوقع أن يحدث إذا غيرنا هذا المتغير؟",
        "هل رأيت شيئاً مشابهاً في الطبيعة؟",
        "كيف يمكننا اختبار هذه الفكرة؟"
      ],
      physics: [
        "ما القوى التي تؤثر في هذه الحالة؟",
        "كيف يمكننا قياس هذه الظاهرة؟",
        "ما العلاقة بين هذين المتغيرين؟"
      ],
      chemistry: [
        "ما المواد المتفاعلة والناتجة في هذا التفاعل؟",
        "كيف يمكننا معرفة أن تفاعلاً كيميائياً قد حدث؟",
        "ما العوامل التي تؤثر على سرعة التفاعل؟"
      ],
      biology: [
        "كيف تتكيف الكائنات الحية مع بيئتها؟",
        "ما وظيفة هذا العضو أو النسيج؟",
        "كيف تحافظ الكائنات الحية على توازنها الداخلي؟"
      ],
      programming: [
        "كيف تحل هذه المشكلة في الحياة الواقعية؟",
        "ما الخطوات التي تحتاجها لتحقيق هذا الهدف؟",
        "ماذا لو أردنا تحسين هذا الحل؟"
      ],
      arabic: [
        "ما المعنى الذي يضيفه هذا التعبير؟",
        "كيف يؤثر السياق على فهم النص؟",
        "ما الصور البلاغية المستخدمة هنا؟"
      ],
      history: [
        "ما الأسباب التي أدت إلى هذا الحدث؟",
        "كيف أثر هذا الحدث على الأحداث اللاحقة؟",
        "ما الدروس التي يمكننا تعلمها من التاريخ؟"
      ],
      geography: [
        "كيف تؤثر الجغرافيا على حياة السكان؟",
        "ما العوامل التي تشكل هذه الظاهرة الطبيعية؟",
        "كيف يتفاعل الإنسان مع البيئة الجغرافية؟"
      ],
      general: [
        "ما رأيك في هذا الموضوع؟",
        "كيف يرتبط هذا بحياتك اليومية؟",
        "ما الأسئلة الأخرى التي تخطر ببالك؟"
      ]
    };

    return questionBank[subject] || questionBank.general;
  }
  
  /**
   * استخراج الكلمات المفتاحية
   */
  private extractKeywords(question: string): string[] {
    const words = question.split(' ');
    const keywords: string[] = [];
    
    // البحث عن كلمات مفتاحية في جميع المواد
    for (const subjectKeywords of Object.values(SUBJECT_KEYWORDS)) {
      for (const keyword of subjectKeywords) {
        if (words.some(word => word.includes(keyword) || keyword.includes(word))) {
          keywords.push(keyword);
        }
      }
    }
    
    return [...new Set(keywords)]; // إزالة التكرار
  }
  
  /**
   * فحص وجود مصطلحات معقدة
   */
  private hasComplexTerms(question: string): boolean {
    const complexTerms = [
      'تفاضل', 'تكامل', 'مصفوفة', 'خوارزمية', 'كوانتم', 'نسبية',
      'calculus', 'matrix', 'algorithm', 'quantum', 'relativity'
    ];
    
    return complexTerms.some(term => question.includes(term));
  }
}

// إنشاء instance واحد للاستخدام
export const questionAnalyzer = new QuestionAnalyzer();
