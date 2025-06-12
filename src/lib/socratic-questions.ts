// مكتبة الأسئلة السقراطية التوجيهية لمرجان
// Socratic Questions Library for Marjan Virtual Teacher

export interface SocraticQuestionSet {
  concept: string;
  subject: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  guidingQuestions: string[];
  analogies: string[];
  realWorldExamples: string[];
  commonMisconceptions: string[];
  visualAids: string[];
}

export interface ConceptMapping {
  [key: string]: SocraticQuestionSet;
}

// بنك الأسئلة السقراطية للرياضيات
export const MATHEMATICS_CONCEPTS: ConceptMapping = {
  fractions: {
    concept: "الكسور",
    subject: "mathematics",
    difficulty: "basic",
    guidingQuestions: [
      "لو كان لديك بيتزا وأردت تقسيمها بينك وبين أخيك، كيف ستقسمها؟",
      "إذا أكلت نصف التفاحة، كم تبقى منها؟",
      "ماذا يعني أن نقول 'ربع الساعة'؟",
      "لو كان لديك 4 قطع حلوى وأعطيت صديقك قطعة واحدة، أي جزء أعطيته؟",
      "كيف يمكنك تمثيل النصف بالأرقام؟"
    ],
    analogies: [
      "الكسر مثل قطعة من الكعكة - الرقم السفلي يخبرنا كم قطعة قُسمت الكعكة إليها، والرقم العلوي يخبرنا كم قطعة أخذنا",
      "فكر في الكسر كعنوان منزل - الرقم العلوي هو رقم المنزل، والرقم السفلي هو رقم الشارع",
      "الكسر مثل تقسيم المال - لو كان معك 10 ريالات وقسمتها على 5 أشخاص، كل شخص يأخذ 2 ريال"
    ],
    realWorldExamples: [
      "عندما نقول 'نصف كوب من الدقيق' في الطبخ",
      "عندما نقول 'ربع ساعة' للوقت",
      "عندما نقسم الفاتورة في المطعم على عدد الأشخاص",
      "عندما نقول 'ثلث الطريق' في السفر"
    ],
    commonMisconceptions: [
      "الاعتقاد أن الكسر الأكبر هو الذي له رقم أكبر في الأسفل",
      "عدم فهم أن 1/2 = 2/4 = 3/6",
      "الخلط بين جمع الكسور وضربها"
    ],
    visualAids: [
      "رسم دوائر مقسمة إلى أجزاء",
      "رسم مستطيلات مظللة",
      "استخدام قطع الفاكهة أو البيتزا"
    ]
  },

  pythagoras: {
    concept: "نظرية فيثاغورس",
    subject: "mathematics",
    difficulty: "intermediate",
    guidingQuestions: [
      "إذا كان لديك مثلث قائم الزاوية، أي ضلع تعتقد أنه الأطول؟",
      "لماذا تعتقد أن الضلع المقابل للزاوية القائمة هو الأطول؟",
      "لو كان لديك سلم مائل على الحائط، كيف تحسب طول السلم؟",
      "ما العلاقة بين أضلاع المثلث القائم الزاوية؟",
      "كيف يمكن أن نتأكد من أن المثلث قائم الزاوية؟"
    ],
    analogies: [
      "فكر في المثلث القائم كزاوية غرفة - الحائطان هما الضلعان القائمان، والقطر هو الوتر",
      "مثل سلم مائل على الحائط - المسافة من الحائط والارتفاع والسلم نفسه",
      "كالمشي في المدينة - يمكنك المشي شرقاً ثم شمالاً، أو المشي مباشرة قطرياً"
    ],
    realWorldExamples: [
      "حساب طول السلم المطلوب للوصول لنافذة في الطابق الثاني",
      "تحديد المسافة المباشرة بين نقطتين على الخريطة",
      "حساب قطر شاشة التلفزيون من العرض والارتفاع"
    ],
    commonMisconceptions: [
      "الاعتقاد أن النظرية تعمل مع جميع المثلثات",
      "الخلط بين الوتر والأضلاع الأخرى",
      "عدم فهم أن النظرية تتطلب تربيع الأطوال"
    ],
    visualAids: [
      "رسم مثلث قائم الزاوية مع تسمية الأضلاع",
      "رسم مربعات على كل ضلع لتوضيح التربيع",
      "استخدام شبكة مربعات لحساب المساحات"
    ]
  }
};

// بنك الأسئلة السقراطية للفيزياء
export const PHYSICS_CONCEPTS: ConceptMapping = {
  ohms_law: {
    concept: "قانون أوم",
    subject: "physics",
    difficulty: "intermediate",
    guidingQuestions: [
      "لو كان لديك مصباح وزدت قوة البطارية، ماذا تتوقع أن يحدث لإضاءة المصباح؟",
      "إذا كانت الإضاءة الأقوى تعني تياراً أكبر، ما العلاقة بين قوة البطارية والتيار؟",
      "ماذا لو أضفنا مقاومة أكبر للدائرة؟ كيف سيؤثر ذلك على التيار؟",
      "لماذا تحتاج الأجهزة القوية لكابلات أسمك؟",
      "كيف يمكن أن نتحكم في شدة الإضاءة؟"
    ],
    analogies: [
      "فكر في الكهرباء كالماء في الأنابيب - الجهد مثل ضغط الماء، والتيار مثل كمية الماء المتدفقة، والمقاومة مثل ضيق الأنبوب",
      "مثل الطريق السريع - الجهد كالسرعة المسموحة، والتيار كعدد السيارات، والمقاومة كالازدحام",
      "كالنهر - الجهد كانحدار النهر، والتيار كسرعة الماء، والمقاومة كالصخور في النهر"
    ],
    realWorldExamples: [
      "عندما تخفت إضاءة المصباح في البيت بسبب انخفاض الجهد",
      "لماذا تسخن الأسلاك عند مرور تيار كبير",
      "كيف يعمل منظم الإضاءة (الديمر) في المنزل"
    ],
    commonMisconceptions: [
      "الاعتقاد أن المقاومة تنتج الكهرباء",
      "عدم فهم الفرق بين الجهد والتيار",
      "الاعتقاد أن زيادة المقاومة تزيد التيار"
    ],
    visualAids: [
      "رسم دائرة كهربائية بسيطة",
      "رسم مخطط يوضح العلاقة بين V, I, R",
      "استخدام ألوان مختلفة للجهد والتيار والمقاومة"
    ]
  },

  gravity: {
    concept: "الجاذبية",
    subject: "physics",
    difficulty: "basic",
    guidingQuestions: [
      "لماذا تسقط التفاحة لأسفل وليس لأعلى؟",
      "ماذا يحدث عندما تقفز في الهواء؟",
      "لماذا لا تطير الأشياء في الهواء؟",
      "هل تعتقد أن الجاذبية تؤثر على جميع الأشياء بنفس الطريقة؟",
      "لماذا يسقط الحجر أسرع من الريشة في الهواء؟"
    ],
    analogies: [
      "الجاذبية مثل مغناطيس خفي يجذب كل شيء نحو الأرض",
      "مثل يد خفية تسحب الأشياء لأسفل باستمرار",
      "كالمصعد الذي ينزل - كل شيء يتحرك نحو الأسفل"
    ],
    realWorldExamples: [
      "سقوط المطر من السحب",
      "تدحرج الكرة من أعلى التل",
      "سقوط الأوراق من الشجر في الخريف"
    ],
    commonMisconceptions: [
      "الاعتقاد أن الأشياء الثقيلة تسقط أسرع دائماً",
      "عدم فهم أن الجاذبية تعمل في الفضاء أيضاً",
      "الاعتقاد أن الجاذبية تحتاج هواء لتعمل"
    ],
    visualAids: [
      "رسم الأرض مع أسهم تشير نحو المركز",
      "رسم أشياء مختلفة تسقط",
      "مخطط يوضح مسار الأجسام الساقطة"
    ]
  }
};

// بنك الأسئلة السقراطية للبرمجة
export const PROGRAMMING_CONCEPTS: ConceptMapping = {
  variables: {
    concept: "المتغيرات",
    subject: "programming",
    difficulty: "basic",
    guidingQuestions: [
      "لو أردت أن تتذكر اسم صديقك، أين ستكتبه؟",
      "كيف تحتفظ بالمعلومات المهمة في حياتك اليومية؟",
      "ماذا لو أردت تغيير اسم صديقك المحفوظ؟",
      "كيف تنظم أغراضك في المنزل؟ هل تضع كل شيء في مكان محدد؟",
      "ما الفرق بين صندوق مكتوب عليه 'كتب' وصندوق مكتوب عليه 'ملابس'؟"
    ],
    analogies: [
      "المتغير مثل صندوق له اسم - يمكنك وضع شيء بداخله وتغييره لاحقاً",
      "مثل جيب في ملابسك - له اسم (جيب القميص) ويمكنك وضع أشياء مختلفة فيه",
      "كالملصق على البرطمان - الملصق هو اسم المتغير والمحتوى هو القيمة"
    ],
    realWorldExamples: [
      "حفظ رقم هاتف صديق في الهاتف تحت اسمه",
      "كتابة قائمة التسوق وتعديلها حسب الحاجة",
      "حفظ المال في محفظة مكتوب عليها 'مصروف الجيب'"
    ],
    commonMisconceptions: [
      "الاعتقاد أن المتغير والقيمة شيء واحد",
      "عدم فهم أن المتغير يمكن أن يحتوي قيماً مختلفة",
      "الخلط بين اسم المتغير وقيمته"
    ],
    visualAids: [
      "رسم صناديق بأسماء مختلفة",
      "مخطط يوضح المتغير كحاوية",
      "جدول يوضح أسماء المتغيرات وقيمها"
    ]
  },

  loops: {
    concept: "الحلقات التكرارية",
    subject: "programming",
    difficulty: "intermediate",
    guidingQuestions: [
      "كيف تغسل أسنانك كل يوم؟ هل تكرر نفس الخطوات؟",
      "ماذا لو أردت أن تعد من 1 إلى 100؟ هل ستكتب كل رقم بشكل منفصل؟",
      "كيف تقوم بطي الملابس؟ هل تكرر نفس العملية لكل قطعة؟",
      "ما الذي يجعلك تتوقف عن العد؟",
      "كيف يمكن للكمبيوتر أن يعرف متى يتوقف عن التكرار؟"
    ],
    analogies: [
      "الحلقة مثل أغنية مكررة - تعيد نفس اللحن حتى تقرر إيقافها",
      "مثل المشي في دائرة - تكرر نفس المسار حتى تقرر الخروج",
      "كالغسالة - تكرر دورة الغسيل حتى تنتهي من البرنامج المحدد"
    ],
    realWorldExamples: [
      "عد الأغنام للنوم",
      "تكرار التمارين الرياضية",
      "قراءة صفحات الكتاب واحدة تلو الأخرى"
    ],
    commonMisconceptions: [
      "عدم فهم أهمية شرط التوقف",
      "الاعتقاد أن الحلقة تعمل إلى ما لا نهاية",
      "الخلط بين أنواع الحلقات المختلفة"
    ],
    visualAids: [
      "رسم دائرة مع أسهم تشير للتكرار",
      "مخطط تدفق يوضح الحلقة",
      "جدول يوضح قيم المتغير في كل تكرار"
    ]
  }
};

// دالة للحصول على أسئلة سقراطية حسب المفهوم
export function getSocraticQuestions(
  concept: string, 
  subject: string = 'general',
  difficulty: 'basic' | 'intermediate' | 'advanced' = 'basic'
): SocraticQuestionSet | null {
  
  // البحث في المفاهيم حسب المادة
  const conceptMappings = {
    mathematics: MATHEMATICS_CONCEPTS,
    physics: PHYSICS_CONCEPTS,
    programming: PROGRAMMING_CONCEPTS
  };
  
  const subjectConcepts = conceptMappings[subject as keyof typeof conceptMappings];
  if (subjectConcepts && subjectConcepts[concept]) {
    return subjectConcepts[concept];
  }
  
  // البحث في جميع المفاهيم
  for (const mapping of Object.values(conceptMappings)) {
    if (mapping[concept]) {
      return mapping[concept];
    }
  }
  
  return null;
}

// دالة لتوليد أسئلة سقراطية عامة
export function generateGenericSocraticQuestions(topic: string): string[] {
  return [
    `ما الذي تعرفه بالفعل عن ${topic}؟`,
    `هل يمكنك إعطائي مثالاً من الحياة اليومية عن ${topic}؟`,
    `لماذا تعتقد أن ${topic} مهم؟`,
    `كيف تعتقد أن ${topic} يعمل؟`,
    `ما الذي يثير فضولك حول ${topic}؟`
  ];
}

// دالة للحصول على تشبيه مناسب
export function getAnalogy(concept: string, subject: string): string | null {
  const questionSet = getSocraticQuestions(concept, subject);
  if (questionSet && questionSet.analogies.length > 0) {
    return questionSet.analogies[Math.floor(Math.random() * questionSet.analogies.length)];
  }
  return null;
}

// دالة للحصول على مثال من الحياة الواقعية
export function getRealWorldExample(concept: string, subject: string): string | null {
  const questionSet = getSocraticQuestions(concept, subject);
  if (questionSet && questionSet.realWorldExamples.length > 0) {
    return questionSet.realWorldExamples[Math.floor(Math.random() * questionSet.realWorldExamples.length)];
  }
  return null;
}

// دالة للحصول على سؤال توجيهي عشوائي
export function getRandomGuidingQuestion(concept: string, subject: string): string | null {
  const questionSet = getSocraticQuestions(concept, subject);
  if (questionSet && questionSet.guidingQuestions.length > 0) {
    return questionSet.guidingQuestions[Math.floor(Math.random() * questionSet.guidingQuestions.length)];
  }
  return null;
}
