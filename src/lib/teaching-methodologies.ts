// منهجيات التدريس المتعددة لمرجان
// Multiple Teaching Methodologies for Marjan

export type TeachingMethod = 
  | 'socratic'           // الطريقة السقراطية
  | 'direct_instruction' // التعليم المباشر
  | 'worked_example'     // التعلم بالمثال المحلول
  | 'problem_based'      // التعلم القائم على المشكلات
  | 'narrative'          // التعلم السردي/القصصي
  | 'scaffolding'        // السقالات التعليمية
  | 'visual_demo'        // العرض البصري
  | 'analogy_based';     // التعلم بالتشبيه

export interface TeachingContext {
  studentLevel: 'beginner' | 'intermediate' | 'advanced';
  subject: string;
  questionType: 'factual' | 'conceptual' | 'procedural' | 'analytical';
  studentConfusion: 'none' | 'slight' | 'moderate' | 'high';
  previousAttempts: number;
  preferredStyle?: TeachingMethod;
}

export interface MethodologyResponse {
  method: TeachingMethod;
  response: string;
  reasoning: string;
  nextSteps?: string[];
  visualAids?: boolean;
  followUpQuestions?: string[];
}

export class TeachingMethodologySelector {
  
  /**
   * اختيار أفضل منهجية تدريس بناءً على السياق
   */
  selectBestMethod(context: TeachingContext, question: string): TeachingMethod {
    // إذا كان الطالب محدد تفضيله، نحترم ذلك
    if (context.preferredStyle) {
      return context.preferredStyle;
    }
    
    // تحليل السياق لاختيار أفضل منهجية
    const score = this.calculateMethodScores(context, question);
    
    // إرجاع المنهجية ذات أعلى نقاط
    return Object.entries(score).reduce((a, b) => 
      score[a[0] as TeachingMethod] > score[b[0] as TeachingMethod] ? a : b
    )[0] as TeachingMethod;
  }
  
  /**
   * حساب نقاط كل منهجية بناءً على السياق
   */
  private calculateMethodScores(context: TeachingContext, question: string): Record<TeachingMethod, number> {
    const scores: Record<TeachingMethod, number> = {
      socratic: 5,
      direct_instruction: 5,
      worked_example: 5,
      problem_based: 5,
      narrative: 5,
      scaffolding: 5,
      visual_demo: 5,
      analogy_based: 5
    };
    
    // تعديل النقاط بناءً على مستوى الطالب
    if (context.studentLevel === 'beginner') {
      scores.direct_instruction += 3;
      scores.worked_example += 2;
      scores.scaffolding += 2;
      scores.socratic -= 2;
      scores.problem_based -= 1;
    } else if (context.studentLevel === 'advanced') {
      scores.socratic += 3;
      scores.problem_based += 2;
      scores.direct_instruction -= 2;
    }
    
    // تعديل بناءً على نوع السؤال
    if (context.questionType === 'factual') {
      scores.direct_instruction += 3;
      scores.narrative += 1;
      scores.socratic -= 1;
    } else if (context.questionType === 'procedural') {
      scores.worked_example += 3;
      scores.scaffolding += 2;
      scores.visual_demo += 1;
    } else if (context.questionType === 'conceptual') {
      scores.socratic += 2;
      scores.analogy_based += 2;
      scores.narrative += 1;
    } else if (context.questionType === 'analytical') {
      scores.problem_based += 3;
      scores.socratic += 2;
    }
    
    // تعديل بناءً على مستوى الحيرة
    if (context.studentConfusion === 'high') {
      scores.direct_instruction += 2;
      scores.scaffolding += 2;
      scores.socratic -= 2;
      scores.problem_based -= 2;
    }
    
    // تعديل بناءً على المحاولات السابقة
    if (context.previousAttempts > 2) {
      scores.narrative += 2;
      scores.analogy_based += 2;
      scores.visual_demo += 1;
    }
    
    // تعديل بناءً على المادة
    if (context.subject.includes('math') || context.subject.includes('رياض')) {
      scores.worked_example += 2;
      scores.visual_demo += 1;
    } else if (context.subject.includes('history') || context.subject.includes('تاريخ')) {
      scores.narrative += 3;
      scores.problem_based += 1;
    } else if (context.subject.includes('programming') || context.subject.includes('برمج')) {
      scores.worked_example += 2;
      scores.scaffolding += 2;
    }
    
    return scores;
  }
  
  /**
   * تطبيق المنهجية المختارة وإنتاج الاستجابة
   */
  applyMethodology(
    method: TeachingMethod, 
    question: string, 
    context: TeachingContext
  ): MethodologyResponse {
    
    switch (method) {
      case 'direct_instruction':
        return this.applyDirectInstruction(question, context);
      
      case 'worked_example':
        return this.applyWorkedExample(question, context);
      
      case 'problem_based':
        return this.applyProblemBased(question, context);
      
      case 'narrative':
        return this.applyNarrative(question, context);
      
      case 'scaffolding':
        return this.applyScaffolding(question, context);
      
      case 'visual_demo':
        return this.applyVisualDemo(question, context);
      
      case 'analogy_based':
        return this.applyAnalogyBased(question, context);
      
      case 'socratic':
      default:
        return this.applySocratic(question, context);
    }
  }
  
  /**
   * تطبيق التعليم المباشر
   */
  private applyDirectInstruction(question: string, context: TeachingContext): MethodologyResponse {
    return {
      method: 'direct_instruction',
      response: `سأشرح لك هذا المفهوم بشكل مباشر وواضح. دعني أقسم الموضوع إلى نقاط أساسية:

1. التعريف الأساسي
2. المكونات الرئيسية  
3. الخصائص المهمة
4. أمثلة توضيحية

هذا النهج سيعطيك أساساً متيناً لفهم الموضوع.`,
      reasoning: 'اخترت التعليم المباشر لأنك تحتاج إلى أساس واضح ومنظم للموضوع',
      nextSteps: [
        'سأقدم لك التعريفات الأساسية',
        'ثم سنراجع الأمثلة معاً',
        'وأخيراً سأختبر فهمك بأسئلة بسيطة'
      ],
      visualAids: true
    };
  }
  
  /**
   * تطبيق التعلم بالمثال المحلول
   */
  private applyWorkedExample(question: string, context: TeachingContext): MethodologyResponse {
    return {
      method: 'worked_example',
      response: `ممتاز! سأحل لك مثالاً مشابهاً خطوة بخطوة، وأشرح لك عملية التفكير وراء كل خطوة.

🔍 **المثال:**
سأبدأ بمشكلة مشابهة لسؤالك وأحلها أمامك بالتفصيل.

📝 **الخطوات:**
1. أولاً، سأحدد المعطيات
2. ثانياً، سأختار الطريقة المناسبة
3. ثالثاً، سأطبق الخطوات بالترتيب
4. أخيراً، سأتحقق من صحة النتيجة

بعد أن أنتهي، ستحل أنت مثالاً مشابهاً بنفسك!`,
      reasoning: 'المثال المحلول مثالي لتعلم الخطوات الإجرائية والعمليات المنطقية',
      nextSteps: [
        'سأعرض المثال كاملاً',
        'ثم أعطيك مثالاً مشابهاً لتحله',
        'وسأوجهك إذا احتجت مساعدة'
      ],
      visualAids: true
    };
  }
  
  /**
   * تطبيق التعلم القائم على المشكلات
   */
  private applyProblemBased(question: string, context: TeachingContext): MethodologyResponse {
    return {
      method: 'problem_based',
      response: `رائع! بدلاً من أن أشرح لك النظرية مباشرة، دعني أطرح عليك مشكلة من الحياة الواقعية.

🎯 **التحدي:**
تخيل أنك تواجه هذا الموقف في الحياة الحقيقية...

هذه المشكلة ستجبرك على اكتشاف المفاهيم بنفسك، مما يجعل التعلم أعمق وأكثر ثباتاً.

💡 **هدفك:**
- حلل المشكلة
- ابحث عن المعلومات التي تحتاجها
- اقترح حلولاً ممكنة
- اختبر أفكارك

سأكون هنا لأوجهك عند الحاجة!`,
      reasoning: 'التعلم القائم على المشكلات يطور التفكير النقدي ويربط التعلم بالواقع',
      nextSteps: [
        'ستحلل المشكلة أولاً',
        'ثم تبحث عن المعلومات المطلوبة',
        'وأخيراً تقترح وتختبر الحلول'
      ],
      followUpQuestions: [
        'ما أول شيء تلاحظه في هذه المشكلة؟',
        'ما المعلومات التي تحتاجها لحلها؟',
        'ما الحلول الممكنة التي تخطر ببالك؟'
      ]
    };
  }
  
  /**
   * تطبيق التعلم السردي
   */
  private applyNarrative(question: string, context: TeachingContext): MethodologyResponse {
    return {
      method: 'narrative',
      response: `دعني أروي لك قصة تجعل هذا المفهوم أكثر وضوحاً وإثارة...

📖 **القصة:**
كان هناك مرة...

هذه القصة ستساعدك على فهم المفهوم من خلال سياق مثير ولا يُنسى. القصص تجعل المعلومات تلتصق في الذاكرة أكثر من الحقائق المجردة.

🎭 **الشخصيات:**
- البطل الذي يواجه التحدي
- المشكلة التي يجب حلها
- الدروس المستفادة

ستجد نفسك تتذكر هذا المفهوم كلما تذكرت القصة!`,
      reasoning: 'التعلم السردي يجعل المفاهيم المجردة أكثر حيوية وسهولة في التذكر',
      nextSteps: [
        'سأروي القصة كاملة',
        'ثم نستخرج المفاهيم الأساسية معاً',
        'وأخيراً نطبق ما تعلمناه على أمثلة أخرى'
      ]
    };
  }
  
  /**
   * تطبيق السقالات التعليمية
   */
  private applyScaffolding(question: string, context: TeachingContext): MethodologyResponse {
    return {
      method: 'scaffolding',
      response: `سأدعمك خطوة بخطوة حتى تصبح قادراً على التعامل مع هذا الموضوع بثقة.

🏗️ **خطة الدعم التدريجي:**

**المرحلة 1 - دعم كامل:**
سأقوم بكل شيء وأنت تراقب وتتعلم

**المرحلة 2 - دعم جزئي:**
سنعمل معاً، أنا أوجه وأنت تطبق

**المرحلة 3 - دعم قليل:**
ستعمل بنفسك مع بعض التوجيهات مني

**المرحلة 4 - استقلالية:**
ستتعامل مع المشاكل بنفسك بثقة تامة

هذا النهج يضمن عدم شعورك بالإحباط أو الضياع!`,
      reasoning: 'السقالات التعليمية تبني الثقة تدريجياً وتضمن إتقان كل مرحلة قبل الانتقال للتالية',
      nextSteps: [
        'نبدأ بالمرحلة الأولى مع دعم كامل',
        'ننتقل تدريجياً لمزيد من الاستقلالية',
        'نتأكد من إتقانك لكل مرحلة'
      ]
    };
  }
  
  /**
   * تطبيق العرض البصري
   */
  private applyVisualDemo(question: string, context: TeachingContext): MethodologyResponse {
    return {
      method: 'visual_demo',
      response: `الصورة تساوي ألف كلمة! سأوضح لك هذا المفهوم بصرياً.

🎨 **العرض البصري:**
- رسوم توضيحية تفاعلية
- مخططات ملونة ومنظمة  
- أمثلة مرئية متحركة
- مقارنات بصرية واضحة

👁️ **لماذا البصري فعال؟**
- يساعد على الفهم السريع
- يجعل المفاهيم المجردة ملموسة
- يناسب المتعلمين البصريين
- يسهل التذكر والاستدعاء

سأرسم وأوضح كل شيء على السبورة التفاعلية!`,
      reasoning: 'العرض البصري مثالي للمفاهيم المكانية والعلاقات المعقدة',
      nextSteps: [
        'سأرسم المفهوم خطوة بخطوة',
        'ثم نحلل الرسم معاً',
        'وأخيراً ستجرب الرسم بنفسك'
      ],
      visualAids: true
    };
  }
  
  /**
   * تطبيق التعلم بالتشبيه
   */
  private applyAnalogyBased(question: string, context: TeachingContext): MethodologyResponse {
    return {
      method: 'analogy_based',
      response: `دعني أشبه لك هذا المفهوم بشيء تعرفه جيداً من حياتك اليومية...

🔗 **التشبيه:**
هذا المفهوم مثل... [سأختار تشبيهاً مناسباً من حياتك]

🎯 **أوجه الشبه:**
- النقطة الأولى المشتركة
- النقطة الثانية المشتركة  
- النقطة الثالثة المشتركة

⚠️ **حدود التشبيه:**
مثل كل التشبيهات، هذا التشبيه له حدود...

التشبيهات تجعل المفاهيم الجديدة مألوفة وسهلة الفهم!`,
      reasoning: 'التشبيهات تربط المجهول بالمعلوم وتسهل استيعاب المفاهيم الجديدة',
      nextSteps: [
        'سأطور التشبيه بالتفصيل',
        'ثم نستكشف أوجه الشبه والاختلاف',
        'وأخيراً نطبق الفهم الجديد'
      ]
    };
  }
  
  /**
   * تطبيق الطريقة السقراطية
   */
  private applySocratic(question: string, context: TeachingContext): MethodologyResponse {
    return {
      method: 'socratic',
      response: `بدلاً من أن أعطيك الإجابة مباشرة، دعني أطرح عليك بعض الأسئلة التي ستقودك لاكتشاف الإجابة بنفسك.

🤔 **السؤال التوجيهي الأول:**
ما الذي تعرفه بالفعل عن هذا الموضوع؟

هذه الطريقة ستساعدك على:
- تطوير التفكير النقدي
- بناء فهم عميق ومستدام
- اكتشاف الإجابات بنفسك
- تقوية الثقة في قدراتك

كل سؤال سيقودك خطوة أقرب للحقيقة!`,
      reasoning: 'الطريقة السقراطية تطور التفكير المستقل والفهم العميق',
      followUpQuestions: [
        'ما الذي تعرفه بالفعل عن هذا؟',
        'هل يمكنك إعطائي مثالاً؟',
        'ما رأيك، لماذا يحدث هذا؟',
        'كيف يمكننا التأكد من صحة هذا؟'
      ]
    };
  }
}

// إنشاء instance للاستخدام
export const methodologySelector = new TeachingMethodologySelector();
