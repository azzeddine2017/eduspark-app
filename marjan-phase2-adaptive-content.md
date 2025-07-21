# المرحلة الثانية: المحتوى التكيفي ونظام التوصيات الذكي
## 🎯 الهدف: تطوير مولدات المحتوى المخصص والتوصيات الذكية (4 أسابيع)

---

## 📋 المهام المطلوبة

### 1. **تطوير مولد المحتوى التكيفي**

#### أ. إنشاء قاعدة بيانات المحتوى التكيفي
```sql
-- جدول المحتوى التكيفي
CREATE TABLE adaptive_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type ENUM('example', 'analogy', 'story', 'exercise', 'explanation', 'visual_aid') NOT NULL,
  concept VARCHAR(200) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  difficulty_level INT CHECK (difficulty_level >= 1 AND difficulty_level <= 10),
  learning_style VARCHAR(50), -- visual, auditory, kinesthetic, reading
  cultural_context VARCHAR(100) DEFAULT 'arabic',
  age_group VARCHAR(50), -- child, teen, adult
  content_data JSONB NOT NULL,
  effectiveness_score DECIMAL(3,2) DEFAULT 0.50,
  usage_count INT DEFAULT 0,
  success_rate DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- جدول قوالب المحتوى
CREATE TABLE content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type VARCHAR(100) NOT NULL,
  subject VARCHAR(100),
  cultural_context VARCHAR(100),
  template_structure JSONB NOT NULL,
  variables TEXT[] DEFAULT '{}',
  usage_examples JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- جدول تقييم المحتوى
CREATE TABLE content_effectiveness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES adaptive_content(id) ON DELETE CASCADE,
  student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
  interaction_id UUID REFERENCES educational_interactions(id),
  effectiveness_rating DECIMAL(3,2) CHECK (effectiveness_rating >= 0.00 AND effectiveness_rating <= 1.00),
  engagement_level INT CHECK (engagement_level >= 1 AND engagement_level <= 5),
  comprehension_level INT CHECK (comprehension_level >= 1 AND comprehension_level <= 5),
  feedback_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- فهارس للأداء
CREATE INDEX idx_adaptive_content_concept ON adaptive_content(concept, subject);
CREATE INDEX idx_adaptive_content_style ON adaptive_content(learning_style, cultural_context);
CREATE INDEX idx_content_effectiveness_content ON content_effectiveness(content_id);
CREATE INDEX idx_content_effectiveness_student ON content_effectiveness(student_id);
```

#### ب. مولد الأمثلة المخصصة
```typescript
// src/lib/content/smart-example-generator.ts
export class SmartExampleGenerator {
  private prisma: PrismaClient;
  private aiModel: AIModel;
  
  async generateCustomExample(
    concept: string,
    studentProfile: StudentProfile,
    context: GenerationContext
  ): Promise<CustomExample> {
    
    // البحث عن أمثلة موجودة مناسبة
    const existingExample = await this.findSuitableExample(concept, studentProfile);
    if (existingExample && existingExample.effectivenessScore > 0.8) {
      return this.adaptExistingExample(existingExample, studentProfile);
    }
    
    // توليد مثال جديد
    const prompt = this.buildExamplePrompt(concept, studentProfile, context);
    const generatedContent = await this.aiModel.generate(prompt);
    
    // تقييم جودة المثال
    const qualityScore = await this.evaluateExampleQuality(generatedContent, concept);
    
    // حفظ المثال الجديد
    const savedExample = await this.saveGeneratedExample({
      concept,
      content: generatedContent,
      studentProfile,
      qualityScore
    });
    
    return {
      id: savedExample.id,
      content: generatedContent,
      type: 'example',
      personalizedFor: studentProfile.id,
      concept: concept,
      effectiveness: qualityScore,
      culturalRelevance: this.assessCulturalRelevance(generatedContent, studentProfile.culturalContext)
    };
  }
  
  private buildExamplePrompt(
    concept: string,
    profile: StudentProfile,
    context: GenerationContext
  ): string {
    const culturalElements = this.getCulturalElements(profile.culturalContext);
    const ageAppropriate = this.getAgeAppropriateLanguage(profile.age);
    const interests = profile.interests.slice(0, 3).join('، ');
    
    return `
أنشئ مثالاً تعليمياً واضحاً ومفصلاً لمفهوم "${concept}" مناسب لطالب:

📊 معلومات الطالب:
- العمر: ${profile.age} سنة
- المستوى التعليمي: ${profile.educationLevel}
- أسلوب التعلم المفضل: ${profile.preferredLearningStyle}
- الاهتمامات: ${interests}
- السياق الثقافي: ${profile.culturalContext}
- نقاط القوة: ${profile.strengths.join('، ')}

🎯 متطلبات المثال:
1. يجب أن يكون مرتبطاً بالحياة اليومية في ${culturalElements.region}
2. استخدم مفردات مناسبة لعمر ${profile.age} سنة
3. اربط المثال بإحدى اهتمامات الطالب: ${profile.interests[0]}
4. اجعل المثال ${profile.preferredLearningStyle === 'visual' ? 'بصرياً وقابلاً للتصور' : 
                   profile.preferredLearningStyle === 'auditory' ? 'قابلاً للشرح الصوتي' :
                   profile.preferredLearningStyle === 'kinesthetic' ? 'تفاعلياً وعملياً' : 'واضحاً ومكتوباً'}
5. استخدم عناصر ثقافية من ${culturalElements.traditions}

🌟 هيكل المثال المطلوب:
- مقدمة تربط بالحياة اليومية
- شرح المفهوم خطوة بخطوة
- تطبيق عملي يمكن للطالب تجربته
- خلاصة تربط المفهوم بفائدته العملية

اكتب المثال بأسلوب ودود ومشجع، واستخدم العربية الفصحى البسيطة.
    `;
  }
  
  private async evaluateExampleQuality(content: string, concept: string): Promise<number> {
    const evaluationPrompt = `
قيم جودة هذا المثال التعليمي لمفهوم "${concept}":

${content}

قيم المثال من 0.0 إلى 1.0 بناءً على:
1. الوضوح والبساطة (25%)
2. الصلة بالحياة اليومية (25%)
3. الدقة العلمية (25%)
4. القدرة على إثارة الاهتمام (25%)

أرجع فقط الرقم العشري للتقييم.
    `;
    
    const evaluation = await this.aiModel.generate(evaluationPrompt);
    return Math.max(0, Math.min(1, parseFloat(evaluation) || 0.5));
  }
}
```

#### ج. مولد القصص التعليمية
```typescript
// src/lib/content/story-generator.ts
export class EducationalStoryGenerator {
  
  async createLearningStory(
    lesson: string,
    studentProfile: StudentProfile,
    difficulty: number
  ): Promise<EducationalStory> {
    
    const storyElements = await this.gatherStoryElements(studentProfile);
    const storyStructure = await this.designStoryStructure(lesson, difficulty);
    
    const prompt = this.buildStoryPrompt(lesson, storyElements, storyStructure, studentProfile);
    const generatedStory = await this.aiModel.generate(prompt);
    
    const interactiveElements = await this.addInteractiveElements(generatedStory, lesson);
    const assessmentQuestions = await this.generateStoryQuestions(generatedStory, lesson);
    
    return {
      title: this.extractTitle(generatedStory),
      narrative: generatedStory,
      characters: storyElements.characters,
      setting: storyElements.setting,
      educationalObjectives: [lesson],
      interactiveElements: interactiveElements,
      assessmentQuestions: assessmentQuestions,
      difficulty: difficulty,
      estimatedDuration: this.estimateReadingTime(generatedStory)
    };
  }
  
  private buildStoryPrompt(
    lesson: string,
    elements: StoryElements,
    structure: StoryStructure,
    profile: StudentProfile
  ): string {
    return `
اكتب قصة تعليمية مشوقة لتعليم مفهوم "${lesson}" لطالب عمره ${profile.age} سنة.

🎭 عناصر القصة:
- الشخصيات: ${elements.characters.join('، ')}
- المكان: ${elements.setting}
- الثقافة: ${profile.culturalContext}
- الاهتمامات: ${profile.interests.join('، ')}

📖 هيكل القصة:
1. ${structure.opening} - تقديم المشكلة أو التحدي
2. ${structure.development} - استكشاف المفهوم من خلال أحداث القصة
3. ${structure.climax} - تطبيق المفهوم لحل المشكلة
4. ${structure.resolution} - الخلاصة والدرس المستفاد

🎯 متطلبات القصة:
- طولها 300-500 كلمة
- تتضمن حواراً طبيعياً
- تربط المفهوم بموقف حياتي
- تنتهي بسؤال يثير التفكير
- تستخدم مفردات مناسبة للعمر

اكتب القصة بأسلوب جذاب ومشوق يجعل التعلم ممتعاً.
    `;
  }
}
```

### 2. **نظام التوصيات الذكي**

#### أ. محرك التوصيات التعليمية
```typescript
// src/lib/recommendations/smart-recommendation-engine.ts
export class SmartRecommendationEngine {
  
  async generateLearningRecommendations(studentId: string): Promise<LearningRecommendations> {
    const studentProfile = await this.getStudentProfile(studentId);
    const progressData = await this.getProgressData(studentId);
    const learningPatterns = await this.analyzeLearningPatterns(studentId);
    
    return {
      nextConcepts: await this.recommendNextConcepts(studentProfile, progressData),
      reviewTopics: await this.identifyReviewNeeds(progressData),
      learningResources: await this.suggestResources(studentProfile, learningPatterns),
      studySchedule: await this.createOptimalSchedule(studentProfile, progressData),
      difficultyAdjustments: await this.suggestDifficultyChanges(learningPatterns),
      motivationalContent: await this.selectMotivationalContent(studentProfile)
    };
  }
  
  private async recommendNextConcepts(
    profile: StudentProfile,
    progress: ProgressData
  ): Promise<ConceptRecommendation[]> {
    
    // تحليل المفاهيم المتقنة والمفاهيم المطلوبة
    const masteredConcepts = progress.concepts.filter(c => c.masteryLevel >= 80);
    const prerequisiteMap = await this.getPrerequisiteMap();
    
    // العثور على المفاهيم التالية المناسبة
    const candidateConcepts = await this.findCandidateConcepts(masteredConcepts, prerequisiteMap);
    
    // ترتيب المفاهيم حسب الأولوية
    const rankedConcepts = await this.rankConceptsByPriority(candidateConcepts, profile);
    
    return rankedConcepts.slice(0, 5).map(concept => ({
      concept: concept.name,
      subject: concept.subject,
      difficulty: concept.difficulty,
      estimatedTime: concept.estimatedLearningTime,
      reasoning: concept.recommendationReason,
      prerequisites: concept.prerequisites,
      benefits: concept.learningBenefits
    }));
  }
  
  private async createOptimalSchedule(
    profile: StudentProfile,
    progress: ProgressData
  ): Promise<StudySchedule> {
    
    const optimalTimes = await this.identifyOptimalLearningTimes(profile.id);
    const reviewNeeds = await this.calculateReviewNeeds(progress);
    const newContent = await this.planNewContentIntroduction(progress);
    
    return {
      dailySchedule: await this.createDailySchedule(optimalTimes, reviewNeeds, newContent),
      weeklyGoals: await this.setWeeklyGoals(progress),
      reviewSchedule: await this.createReviewSchedule(reviewNeeds),
      breakRecommendations: await this.suggestOptimalBreaks(profile)
    };
  }
}
```

#### ب. نظام التخصيص الثقافي
```typescript
// src/lib/cultural/cultural-adaptation.ts
export class CulturalAdaptationEngine {
  
  async adaptContentToCulture(
    content: any,
    culturalContext: string,
    studentAge: number
  ): Promise<AdaptedContent> {
    
    const culturalElements = await this.getCulturalElements(culturalContext);
    const adaptationRules = await this.getAdaptationRules(culturalContext, studentAge);
    
    return {
      adaptedText: await this.adaptLanguageAndExamples(content.text, culturalElements),
      culturalReferences: await this.addCulturalReferences(content, culturalElements),
      localizedExamples: await this.localizeExamples(content.examples, culturalContext),
      appropriateImagery: await this.selectCulturallyAppropriateImages(content.topic, culturalContext),
      respectfulPresentation: await this.ensureRespectfulPresentation(content, adaptationRules)
    };
  }
  
  private async adaptLanguageAndExamples(text: string, cultural: CulturalElements): Promise<string> {
    const adaptationPrompt = `
قم بتكييف النص التالي ليناسب الثقافة ${cultural.name}:

النص الأصلي:
${text}

التكييف المطلوب:
1. استبدل الأمثلة الغربية بأمثلة من ${cultural.region}
2. استخدم أسماء وأماكن مألوفة في ${cultural.region}
3. اربط المفاهيم بالتقاليد والعادات المحلية
4. احترم القيم الثقافية والدينية
5. استخدم العربية الفصحى البسيطة

النص المكيف:
    `;
    
    return await this.aiModel.generate(adaptationPrompt);
  }
}
```

### 3. **تحسين اختيار المنهجيات**

#### أ. محسن اختيار المنهجيات
```typescript
// src/lib/methodology/enhanced-methodology-selector.ts
export class EnhancedMethodologySelector extends TeachingMethodologySelector {
  
  selectBestMethod(
    context: TeachingContext, 
    question: string,
    studentProfile: StudentProfile,
    historicalData: HistoricalPerformance
  ): EnhancedMethodologySelection {
    
    // الحصول على الاختيار الأساسي
    const baseSelection = super.selectBestMethod(context, question);
    
    // تحسين الاختيار بناءً على البيانات الشخصية
    const personalizedMethod = this.personalizeMethodology(
      baseSelection,
      studentProfile,
      historicalData
    );
    
    // إضافة تخصيصات إضافية
    const enhancements = this.addPersonalizedEnhancements(
      personalizedMethod,
      studentProfile,
      context
    );
    
    return {
      methodology: personalizedMethod,
      enhancements: enhancements,
      reasoning: this.explainSelection(personalizedMethod, studentProfile, context),
      expectedEffectiveness: this.predictEffectiveness(personalizedMethod, studentProfile),
      alternatives: this.suggestAlternatives(personalizedMethod, context),
      adaptations: this.suggestAdaptations(personalizedMethod, studentProfile)
    };
  }
  
  private personalizeMethodology(
    baseMethod: TeachingMethod,
    profile: StudentProfile,
    history: HistoricalPerformance
  ): TeachingMethod {
    
    // تحليل أداء الطالب مع كل منهجية
    const methodologyPerformance = history.methodologySuccess;
    
    // إذا كان لدى الطالب تفضيل واضح وأداء جيد
    if (methodologyPerformance[baseMethod] && methodologyPerformance[baseMethod].successRate > 0.8) {
      return baseMethod; // الاحتفاظ بالاختيار الأساسي
    }
    
    // البحث عن منهجية أفضل بناءً على التاريخ الشخصي
    const bestPersonalMethod = Object.entries(methodologyPerformance)
      .sort(([,a], [,b]) => b.successRate - a.successRate)[0];
    
    if (bestPersonalMethod && bestPersonalMethod[1].successRate > 0.7) {
      return bestPersonalMethod[0] as TeachingMethod;
    }
    
    return baseMethod;
  }
}
```

---

## 🎯 مخرجات المرحلة الثانية

### ✅ **النتائج المتوقعة:**
1. **مولدات محتوى ذكية** تنتج أمثلة وقصص مخصصة لكل طالب
2. **نظام توصيات متقدم** يقترح مسارات تعليمية مثلى
3. **تخصيص ثقافي عميق** يجعل المحتوى أكثر صلة وفعالية
4. **اختيار منهجيات محسن** بناءً على البيانات الشخصية

### 📊 **مؤشرات النجاح:**
- توليد محتوى مخصص بجودة عالية (>80%)
- زيادة مشاركة الطلاب بنسبة 40%
- تحسن في معدلات الفهم بنسبة 35%
- رضا الطلاب عن المحتوى المخصص >90%

---

**🚀 بعد هذه المرحلة، سيصبح مرجان قادراً على إنتاج محتوى تعليمي مخصص لكل طالب بشكل فردي!**
