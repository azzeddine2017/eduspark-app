// نظام الذاكرة التعليمية المتقدم - المرحلة الأولى
import { PrismaClient } from '@prisma/client';

// أنواع البيانات للذاكرة التعليمية
export interface ConversationContext {
  sessionId: string;
  recentInteractions: EducationalInteraction[];
  currentConcepts: string[];
  sessionGoals: string[];
  studentMood: string;
}

export interface LearningProgress {
  conceptsMastered: ConceptMastery[];
  recentPerformance: PerformanceMetric[];
  learningVelocity: number;
  retentionRate: number;
}

export interface StudentProfile {
  id: string;
  userId: string;
  learningStyle: LearningStyleProfile;
  preferences: LearningPreferences;
  culturalContext: string;
  interests: string[];
  strengths: string[];
  weaknesses: string[];
  profileCompleteness: number;
}

export interface ConceptMastery {
  conceptName: string;
  subject: string;
  masteryLevel: number;
  attemptsCount: number;
  successRate: number;
  lastPracticed: Date;
}

export interface EducationalInteraction {
  id: string;
  studentId: string;
  sessionId: string;
  question: string;
  response: string;
  methodology: string;
  success: number;
  concept: string;
  subject: string;
  difficulty: number;
  responseTime: number;
  timestamp: Date;
}

export interface LearningStyleProfile {
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
  confidence: number;
}

export interface LearningPreferences {
  pace: 'slow' | 'medium' | 'fast';
  feedback: 'immediate' | 'delayed';
  examples: 'many' | 'few';
  practice: 'repetitive' | 'varied';
}

export interface PerformanceMetric {
  date: Date;
  successRate: number;
  conceptsCovered: number;
  timeSpent: number;
  engagement: number;
}

export interface EducationalMemory {
  shortTermMemory: ConversationContext;
  mediumTermMemory: LearningProgress;
  longTermMemory: StudentProfile;
  conceptualMemory: Map<string, ConceptMastery>;
}

// مدير الذاكرة التعليمية الرئيسي
export class EducationalMemoryManager {
  private prisma: PrismaClient;
  
  constructor() {
    this.prisma = new PrismaClient();
  }

  // إنشاء أو جلب ملف الطالب
  async getOrCreateStudentProfile(userId: string): Promise<StudentProfile> {
    let profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        conceptMastery: true,
        educationalInteractions: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!profile) {
      profile = await this.createNewStudentProfile(userId);
    }

    return this.mapToStudentProfile(profile);
  }

  // إنشاء ملف طالب جديد
  private async createNewStudentProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return await this.prisma.studentProfile.create({
      data: {
        userId,
        culturalContext: 'arabic',
        interests: [],
        strengths: [],
        weaknesses: [],
        age: this.estimateAgeFromBirthDate(user.birthDate),
        educationLevel: this.estimateEducationLevel(user.occupation),
        profileCompleteness: 0.1
      },
      include: {
        conceptMastery: true,
        educationalInteractions: true
      }
    });
  }

  // تحديث الذاكرة قصيرة المدى (الجلسة الحالية)
  async updateShortTermMemory(
    sessionId: string, 
    interaction: Omit<EducationalInteraction, 'id' | 'timestamp'>
  ): Promise<void> {
    try {
      // حفظ التفاعل في قاعدة البيانات
      await this.prisma.educationalInteraction.create({
        data: {
          studentId: interaction.studentId,
          sessionId: sessionId,
          question: interaction.question,
          response: interaction.response,
          methodologyUsed: interaction.methodology,
          successIndicator: interaction.success,
          conceptAddressed: interaction.concept,
          subject: interaction.subject,
          difficultyLevel: interaction.difficulty,
          responseTimeSeconds: interaction.responseTime,
          timeOfDay: new Date().getHours(),
          deviceType: 'web' // يمكن تحسينه لاحقاً
        }
      });

      // تحديث جلسة التعلم
      await this.updateLearningSession(sessionId, interaction);

    } catch (error) {
      console.error('خطأ في تحديث الذاكرة قصيرة المدى:', error);
      throw error;
    }
  }

  // تحديث الذاكرة متوسطة المدى (التقدم الأسبوعي/الشهري)
  async updateMediumTermMemory(studentId: string): Promise<void> {
    try {
      const recentInteractions = await this.getRecentInteractions(studentId, 30); // آخر 30 يوم
      
      // تحليل التقدم وتحديث إتقان المفاهيم
      const concepts = this.extractConcepts(recentInteractions);
      
      for (const concept of concepts) {
        await this.updateConceptMastery(studentId, concept, recentInteractions);
      }

      // تحديث أنماط التعلم
      await this.updateLearningPatterns(studentId, recentInteractions);

    } catch (error) {
      console.error('خطأ في تحديث الذاكرة متوسطة المدى:', error);
      throw error;
    }
  }

  // تحديث الذاكرة طويلة المدى (الملف الشخصي الكامل)
  async updateLongTermMemory(studentId: string): Promise<void> {
    try {
      const allInteractions = await this.getAllInteractions(studentId);
      const learningPattern = await this.analyzeLearningPattern(allInteractions);
      
      await this.prisma.studentProfile.update({
        where: { id: studentId },
        data: {
          learningStyleVisual: learningPattern.visualPreference,
          learningStyleAuditory: learningPattern.auditoryPreference,
          learningStyleKinesthetic: learningPattern.kinestheticPreference,
          learningStyleReading: learningPattern.readingPreference,
          preferredPace: learningPattern.optimalPace,
          strengths: learningPattern.identifiedStrengths,
          weaknesses: learningPattern.identifiedWeaknesses,
          learningStyleConfidence: learningPattern.confidence,
          profileCompleteness: this.calculateProfileCompleteness(learningPattern),
          updatedAt: new Date()
        }
      });

    } catch (error) {
      console.error('خطأ في تحديث الذاكرة طويلة المدى:', error);
      throw error;
    }
  }

  // تحديث إتقان المفهوم
  private async updateConceptMastery(
    studentId: string, 
    concept: string, 
    interactions: EducationalInteraction[]
  ): Promise<void> {
    const conceptInteractions = interactions.filter(i => i.concept === concept);
    const successRate = this.calculateSuccessRate(conceptInteractions);
    const masteryLevel = this.calculateMasteryLevel(conceptInteractions);
    
    await this.prisma.conceptMastery.upsert({
      where: {
        studentId_conceptName_subject: {
          studentId: studentId,
          conceptName: concept,
          subject: conceptInteractions[0]?.subject || 'general'
        }
      },
      update: {
        masteryLevel: masteryLevel,
        attemptsCount: conceptInteractions.length,
        successRate: successRate,
        lastPracticed: new Date(),
        timeToMaster: this.calculateTimeToMaster(conceptInteractions),
        retentionRate: this.calculateRetentionRate(conceptInteractions)
      },
      create: {
        studentId: studentId,
        conceptName: concept,
        subject: conceptInteractions[0]?.subject || 'general',
        masteryLevel: masteryLevel,
        attemptsCount: conceptInteractions.length,
        successRate: successRate,
        lastPracticed: new Date(),
        firstEncountered: conceptInteractions[0]?.timestamp || new Date(),
        timeToMaster: this.calculateTimeToMaster(conceptInteractions)
      }
    });
  }

  // جلب التفاعلات الحديثة
  private async getRecentInteractions(studentId: string, days: number): Promise<EducationalInteraction[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const interactions = await this.prisma.educationalInteraction.findMany({
      where: {
        studentId: studentId,
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return interactions.map(this.mapToEducationalInteraction);
  }

  // جلب جميع التفاعلات
  private async getAllInteractions(studentId: string): Promise<EducationalInteraction[]> {
    const interactions = await this.prisma.educationalInteraction.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' }
    });

    return interactions.map(this.mapToEducationalInteraction);
  }

  // استخراج المفاهيم من التفاعلات
  private extractConcepts(interactions: EducationalInteraction[]): string[] {
    const concepts = new Set<string>();
    interactions.forEach(interaction => {
      if (interaction.concept) {
        concepts.add(interaction.concept);
      }
    });
    return Array.from(concepts);
  }

  // حساب معدل النجاح
  private calculateSuccessRate(interactions: EducationalInteraction[]): number {
    if (interactions.length === 0) return 0;
    
    const totalSuccess = interactions.reduce((sum, interaction) => sum + interaction.success, 0);
    return Number((totalSuccess / interactions.length).toFixed(2));
  }

  // حساب مستوى الإتقان
  private calculateMasteryLevel(interactions: EducationalInteraction[]): number {
    if (interactions.length === 0) return 0;
    
    const recentInteractions = interactions.slice(0, 5); // آخر 5 تفاعلات
    const avgSuccess = this.calculateSuccessRate(recentInteractions);
    const consistency = this.calculateConsistency(recentInteractions);
    
    return Math.min(100, Math.round((avgSuccess * 70 + consistency * 30) * 100));
  }

  // حساب الثبات في الأداء
  private calculateConsistency(interactions: EducationalInteraction[]): number {
    if (interactions.length < 2) return 0;
    
    const successRates = interactions.map(i => i.success);
    const mean = successRates.reduce((sum, rate) => sum + rate, 0) / successRates.length;
    const variance = successRates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) / successRates.length;
    
    return Math.max(0, 1 - Math.sqrt(variance));
  }

  // تقدير العمر من تاريخ الميلاد
  private estimateAgeFromBirthDate(birthDate: Date | null): number | null {
    if (!birthDate) return null;
    
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  }

  // تقدير المستوى التعليمي من المهنة
  private estimateEducationLevel(occupation: string | null): string {
    if (!occupation) return 'unknown';
    
    const occupation_lower = occupation.toLowerCase();
    
    if (occupation_lower.includes('طالب') || occupation_lower.includes('student')) {
      return 'student';
    } else if (occupation_lower.includes('دكتور') || occupation_lower.includes('doctor')) {
      return 'doctorate';
    } else if (occupation_lower.includes('مهندس') || occupation_lower.includes('engineer')) {
      return 'bachelor';
    }
    
    return 'unknown';
  }

  // تحويل البيانات إلى نموذج StudentProfile
  private mapToStudentProfile(profile: any): StudentProfile {
    return {
      id: profile.id,
      userId: profile.userId,
      learningStyle: {
        visual: profile.learningStyleVisual,
        auditory: profile.learningStyleAuditory,
        kinesthetic: profile.learningStyleKinesthetic,
        reading: profile.learningStyleReading,
        confidence: profile.learningStyleConfidence
      },
      preferences: {
        pace: profile.preferredPace,
        feedback: profile.preferredFeedback,
        examples: profile.preferredExamples,
        practice: profile.preferredPractice
      },
      culturalContext: profile.culturalContext,
      interests: Array.isArray(profile.interests) ? profile.interests : [],
      strengths: Array.isArray(profile.strengths) ? profile.strengths : [],
      weaknesses: Array.isArray(profile.weaknesses) ? profile.weaknesses : [],
      profileCompleteness: profile.profileCompleteness
    };
  }

  // تحويل البيانات إلى نموذج EducationalInteraction
  private mapToEducationalInteraction(interaction: any): EducationalInteraction {
    return {
      id: interaction.id,
      studentId: interaction.studentId,
      sessionId: interaction.sessionId,
      question: interaction.question,
      response: interaction.response,
      methodology: interaction.methodologyUsed,
      success: Number(interaction.successIndicator),
      concept: interaction.conceptAddressed || '',
      subject: interaction.subject || '',
      difficulty: interaction.difficultyLevel || 5,
      responseTime: interaction.responseTimeSeconds || 0,
      timestamp: interaction.createdAt
    };
  }

  // وظائف مساعدة إضافية (سيتم تطويرها في المراحل التالية)
  private async updateLearningSession(sessionId: string, interaction: any): Promise<void> {
    // تحديث أو إنشاء جلسة التعلم
    // سيتم تطوير هذه الوظيفة لاحقاً
  }

  private async updateLearningPatterns(studentId: string, interactions: EducationalInteraction[]): Promise<void> {
    // تحليل وتحديث أنماط التعلم
    // سيتم تطوير هذه الوظيفة لاحقاً
  }

  private async analyzeLearningPattern(interactions: EducationalInteraction[]): Promise<any> {
    // تحليل شامل لأنماط التعلم
    // سيتم تطوير هذه الوظيفة لاحقاً
    return {
      visualPreference: 25,
      auditoryPreference: 25,
      kinestheticPreference: 25,
      readingPreference: 25,
      optimalPace: 'medium',
      identifiedStrengths: [],
      identifiedWeaknesses: [],
      confidence: 0.5
    };
  }

  private calculateProfileCompleteness(pattern: any): number {
    // حساب مدى اكتمال الملف الشخصي
    return 0.5; // قيمة مؤقتة
  }

  private calculateTimeToMaster(interactions: EducationalInteraction[]): number {
    // حساب الوقت المطلوب لإتقان المفهوم
    return interactions.reduce((sum, i) => sum + i.responseTime, 0);
  }

  private calculateRetentionRate(interactions: EducationalInteraction[]): number {
    // حساب معدل الاحتفاظ بالمعلومات
    return 0.8; // قيمة مؤقتة
  }
}
