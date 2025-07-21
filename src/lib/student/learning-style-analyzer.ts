// محلل أسلوب التعلم المتقدم - المرحلة الأولى
import { PrismaClient } from '@prisma/client';
import { EducationalInteraction, LearningStyleProfile } from '../memory/educational-memory';

export interface LearningStyleAnalysis {
  visualPreference: number;
  auditoryPreference: number;
  kinestheticPreference: number;
  readingPreference: number;
  optimalPace: 'slow' | 'medium' | 'fast';
  preferredMethodologies: MethodologyPreference[];
  confidence: number;
  recommendations: string[];
}

export interface MethodologyPreference {
  methodology: string;
  successRate: number;
  totalUsage: number;
  preference: number;
}

export interface StudentState {
  motivation: number;
  fatigue: number;
  confidence: number;
  frustration: number;
  focus: number;
}

export interface TimePattern {
  hour: number;
  successRate: number;
  engagementLevel: number;
  responseTime: number;
}

export class LearningStyleAnalyzer {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // تحليل أسلوب التعلم الشامل
  async analyzeLearningStyle(studentId: string): Promise<LearningStyleAnalysis> {
    const interactions = await this.getStudentInteractions(studentId);
    
    if (interactions.length < 5) {
      return this.getDefaultLearningStyle();
    }

    const visualPref = this.calculateVisualPreference(interactions);
    const auditoryPref = this.calculateAuditoryPreference(interactions);
    const kinestheticPref = this.calculateKinestheticPreference(interactions);
    const readingPref = this.calculateReadingPreference(interactions);

    // تطبيع النسب لتصل إلى 100
    const total = visualPref + auditoryPref + kinestheticPref + readingPref;
    const normalizedVisual = Math.round((visualPref / total) * 100);
    const normalizedAuditory = Math.round((auditoryPref / total) * 100);
    const normalizedKinesthetic = Math.round((kinestheticPref / total) * 100);
    const normalizedReading = 100 - normalizedVisual - normalizedAuditory - normalizedKinesthetic;

    return {
      visualPreference: normalizedVisual,
      auditoryPreference: normalizedAuditory,
      kinestheticPreference: normalizedKinesthetic,
      readingPreference: normalizedReading,
      optimalPace: this.determineOptimalPace(interactions),
      preferredMethodologies: this.identifyPreferredMethodologies(interactions),
      confidence: this.calculateConfidence(interactions),
      recommendations: this.generateRecommendations(interactions)
    };
  }

  // حساب تفضيل التعلم البصري
  private calculateVisualPreference(interactions: EducationalInteraction[]): number {
    const visualInteractions = interactions.filter(i => 
      i.methodology === 'visual_demo' || 
      this.usedWhiteboard(i) || 
      this.includedDiagrams(i)
    );

    if (visualInteractions.length === 0) return 25; // قيمة افتراضية

    const visualSuccessRate = this.calculateSuccessRate(visualInteractions);
    const totalSuccessRate = this.calculateSuccessRate(interactions);
    
    // نسبة تفضيل البصري = (معدل نجاح البصري / معدل النجاح العام) * وزن أساسي
    const preference = totalSuccessRate > 0 ? (visualSuccessRate / totalSuccessRate) * 25 : 25;
    return Math.min(100, Math.max(0, preference));
  }

  // حساب تفضيل التعلم السمعي
  private calculateAuditoryPreference(interactions: EducationalInteraction[]): number {
    const auditoryInteractions = interactions.filter(i => 
      i.methodology === 'narrative' || 
      i.methodology === 'socratic' ||
      this.containsAudioElements(i)
    );

    if (auditoryInteractions.length === 0) return 25;

    const auditorySuccessRate = this.calculateSuccessRate(auditoryInteractions);
    const totalSuccessRate = this.calculateSuccessRate(interactions);
    
    const preference = totalSuccessRate > 0 ? (auditorySuccessRate / totalSuccessRate) * 25 : 25;
    return Math.min(100, Math.max(0, preference));
  }

  // حساب تفضيل التعلم الحركي
  private calculateKinestheticPreference(interactions: EducationalInteraction[]): number {
    const kinestheticInteractions = interactions.filter(i => 
      i.methodology === 'problem_based' || 
      i.methodology === 'scaffolding' ||
      this.isInteractiveContent(i)
    );

    if (kinestheticInteractions.length === 0) return 25;

    const kinestheticSuccessRate = this.calculateSuccessRate(kinestheticInteractions);
    const totalSuccessRate = this.calculateSuccessRate(interactions);
    
    const preference = totalSuccessRate > 0 ? (kinestheticSuccessRate / totalSuccessRate) * 25 : 25;
    return Math.min(100, Math.max(0, preference));
  }

  // حساب تفضيل التعلم القرائي
  private calculateReadingPreference(interactions: EducationalInteraction[]): number {
    const readingInteractions = interactions.filter(i => 
      i.methodology === 'direct_instruction' || 
      i.methodology === 'worked_example' ||
      this.isTextHeavy(i)
    );

    if (readingInteractions.length === 0) return 25;

    const readingSuccessRate = this.calculateSuccessRate(readingInteractions);
    const totalSuccessRate = this.calculateSuccessRate(interactions);
    
    const preference = totalSuccessRate > 0 ? (readingSuccessRate / totalSuccessRate) * 25 : 25;
    return Math.min(100, Math.max(0, preference));
  }

  // تحديد الوتيرة المثلى للتعلم
  private determineOptimalPace(interactions: EducationalInteraction[]): 'slow' | 'medium' | 'fast' {
    const avgResponseTime = interactions.reduce((sum, i) => sum + i.responseTime, 0) / interactions.length;
    const successByTime = this.groupSuccessByResponseTime(interactions);
    
    // تحليل العلاقة بين الوقت والنجاح
    if (successByTime.slow > successByTime.medium && successByTime.slow > successByTime.fast) {
      return 'slow';
    } else if (successByTime.fast > successByTime.medium) {
      return 'fast';
    }
    return 'medium';
  }

  // تحديد المنهجيات المفضلة
  private identifyPreferredMethodologies(interactions: EducationalInteraction[]): MethodologyPreference[] {
    const methodologyStats = new Map<string, { total: number, success: number }>();
    
    interactions.forEach(interaction => {
      const method = interaction.methodology;
      if (!methodologyStats.has(method)) {
        methodologyStats.set(method, { total: 0, success: 0 });
      }
      
      const stats = methodologyStats.get(method)!;
      stats.total++;
      if (interaction.success > 0.7) {
        stats.success++;
      }
    });
    
    return Array.from(methodologyStats.entries()).map(([method, stats]) => ({
      methodology: method,
      successRate: stats.total > 0 ? stats.success / stats.total : 0,
      totalUsage: stats.total,
      preference: stats.total > 0 ? stats.success / stats.total : 0
    })).sort((a, b) => b.preference - a.preference);
  }

  // حساب مستوى الثقة في التحليل
  private calculateConfidence(interactions: EducationalInteraction[]): number {
    const dataPoints = interactions.length;
    const timeSpan = this.calculateTimeSpan(interactions);
    const methodologyVariety = this.countUniqueMethodologies(interactions);
    
    // الثقة تعتمد على كمية البيانات وتنوعها
    let confidence = 0;
    
    // نقاط البيانات (40% من الثقة)
    confidence += Math.min(0.4, (dataPoints / 50) * 0.4);
    
    // المدة الزمنية (30% من الثقة)
    confidence += Math.min(0.3, (timeSpan / 30) * 0.3); // 30 يوم كحد أقصى
    
    // تنوع المنهجيات (30% من الثقة)
    confidence += Math.min(0.3, (methodologyVariety / 8) * 0.3); // 8 منهجيات متاحة
    
    return Math.round(confidence * 100) / 100;
  }

  // توليد توصيات مخصصة
  private generateRecommendations(interactions: EducationalInteraction[]): string[] {
    const recommendations: string[] = [];
    const analysis = this.analyzeWeaknesses(interactions);
    
    if (analysis.lowEngagementTimes.length > 0) {
      recommendations.push(`تجنب الدراسة في الساعات: ${analysis.lowEngagementTimes.join(', ')}`);
    }
    
    if (analysis.difficultConcepts.length > 0) {
      recommendations.push(`ركز على تحسين فهم: ${analysis.difficultConcepts.slice(0, 3).join(', ')}`);
    }
    
    if (analysis.preferredMethodology) {
      recommendations.push(`استخدم منهجية ${analysis.preferredMethodology} أكثر لتحسين النتائج`);
    }
    
    return recommendations;
  }

  // تحليل نقاط الضعف
  private analyzeWeaknesses(interactions: EducationalInteraction[]): any {
    const timeAnalysis = this.analyzeTimePatterns(interactions);
    const conceptAnalysis = this.analyzeConceptDifficulties(interactions);
    const methodologyAnalysis = this.identifyPreferredMethodologies(interactions);
    
    return {
      lowEngagementTimes: timeAnalysis.filter(t => t.successRate < 0.6).map(t => `${t.hour}:00`),
      difficultConcepts: conceptAnalysis.filter(c => c.successRate < 0.5).map(c => c.concept),
      preferredMethodology: methodologyAnalysis[0]?.methodology
    };
  }

  // تحليل أنماط الوقت
  private analyzeTimePatterns(interactions: EducationalInteraction[]): TimePattern[] {
    const timeStats = new Map<number, { total: number, success: number, totalTime: number }>();
    
    interactions.forEach(interaction => {
      const hour = new Date(interaction.timestamp).getHours();
      if (!timeStats.has(hour)) {
        timeStats.set(hour, { total: 0, success: 0, totalTime: 0 });
      }
      
      const stats = timeStats.get(hour)!;
      stats.total++;
      stats.success += interaction.success;
      stats.totalTime += interaction.responseTime;
    });
    
    return Array.from(timeStats.entries()).map(([hour, stats]) => ({
      hour,
      successRate: stats.total > 0 ? stats.success / stats.total : 0,
      engagementLevel: this.calculateEngagementLevel(stats),
      responseTime: stats.total > 0 ? stats.totalTime / stats.total : 0
    }));
  }

  // وظائف مساعدة
  private async getStudentInteractions(studentId: string): Promise<EducationalInteraction[]> {
    const interactions = await this.prisma.educationalInteraction.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      take: 100 // آخر 100 تفاعل
    });

    return interactions.map(i => ({
      id: i.id,
      studentId: i.studentId,
      sessionId: i.sessionId,
      question: i.question,
      response: i.response,
      methodology: i.methodologyUsed,
      success: Number(i.successIndicator),
      concept: i.conceptAddressed || '',
      subject: i.subject || '',
      difficulty: i.difficultyLevel || 5,
      responseTime: i.responseTimeSeconds || 0,
      timestamp: i.createdAt
    }));
  }

  private calculateSuccessRate(interactions: EducationalInteraction[]): number {
    if (interactions.length === 0) return 0;
    return interactions.reduce((sum, i) => sum + i.success, 0) / interactions.length;
  }

  private usedWhiteboard(interaction: EducationalInteraction): boolean {
    // تحقق من استخدام السبورة (سيتم تطويره لاحقاً)
    return false;
  }

  private includedDiagrams(interaction: EducationalInteraction): boolean {
    // تحقق من وجود رسوم بيانية (سيتم تطويره لاحقاً)
    return false;
  }

  private containsAudioElements(interaction: EducationalInteraction): boolean {
    // تحقق من وجود عناصر صوتية (سيتم تطويره لاحقاً)
    return false;
  }

  private isInteractiveContent(interaction: EducationalInteraction): boolean {
    // تحقق من المحتوى التفاعلي (سيتم تطويره لاحقاً)
    return false;
  }

  private isTextHeavy(interaction: EducationalInteraction): boolean {
    // تحقق من كثافة النص (سيتم تطويره لاحقاً)
    return interaction.response.length > 500;
  }

  private groupSuccessByResponseTime(interactions: EducationalInteraction[]): any {
    const slow = interactions.filter(i => i.responseTime > 120); // أكثر من دقيقتين
    const medium = interactions.filter(i => i.responseTime >= 30 && i.responseTime <= 120);
    const fast = interactions.filter(i => i.responseTime < 30);
    
    return {
      slow: this.calculateSuccessRate(slow),
      medium: this.calculateSuccessRate(medium),
      fast: this.calculateSuccessRate(fast)
    };
  }

  private calculateTimeSpan(interactions: EducationalInteraction[]): number {
    if (interactions.length < 2) return 1;
    
    const oldest = new Date(Math.min(...interactions.map(i => i.timestamp.getTime())));
    const newest = new Date(Math.max(...interactions.map(i => i.timestamp.getTime())));
    
    return Math.ceil((newest.getTime() - oldest.getTime()) / (1000 * 60 * 60 * 24)); // أيام
  }

  private countUniqueMethodologies(interactions: EducationalInteraction[]): number {
    const methodologies = new Set(interactions.map(i => i.methodology));
    return methodologies.size;
  }

  private analyzeConceptDifficulties(interactions: EducationalInteraction[]): any[] {
    const conceptStats = new Map<string, { total: number, success: number }>();
    
    interactions.forEach(interaction => {
      if (interaction.concept) {
        if (!conceptStats.has(interaction.concept)) {
          conceptStats.set(interaction.concept, { total: 0, success: 0 });
        }
        
        const stats = conceptStats.get(interaction.concept)!;
        stats.total++;
        stats.success += interaction.success;
      }
    });
    
    return Array.from(conceptStats.entries()).map(([concept, stats]) => ({
      concept,
      successRate: stats.total > 0 ? stats.success / stats.total : 0,
      attempts: stats.total
    }));
  }

  private calculateEngagementLevel(stats: any): number {
    // حساب مستوى المشاركة بناءً على الإحصائيات
    return Math.min(5, Math.max(1, Math.round(stats.success / stats.total * 5)));
  }

  private getDefaultLearningStyle(): LearningStyleAnalysis {
    return {
      visualPreference: 25,
      auditoryPreference: 25,
      kinestheticPreference: 25,
      readingPreference: 25,
      optimalPace: 'medium',
      preferredMethodologies: [],
      confidence: 0.1,
      recommendations: ['تحتاج إلى المزيد من التفاعلات لتحليل أسلوب التعلم بدقة']
    };
  }
}
