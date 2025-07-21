// نظام تتبع التقدم الذكي - المرحلة الأولى
import { PrismaClient } from '@prisma/client';
import { EducationalInteraction, ConceptMastery } from '../memory/educational-memory';

export interface ConceptProgress {
  conceptName: string;
  subject: string;
  currentMastery: number;
  learningVelocity: number;
  retentionRate: number;
  difficultyAreas: string[];
  nextSteps: string[];
  estimatedTimeToMastery: number;
  progressTrend: 'improving' | 'stable' | 'declining';
}

export interface ProgressReport {
  studentId: string;
  overallProgress: number;
  strongAreas: ConceptArea[];
  improvementAreas: ConceptArea[];
  learningTrends: LearningTrend[];
  recommendations: ProgressRecommendation[];
  weeklyGoals: WeeklyGoal[];
  achievements: Achievement[];
}

export interface ConceptArea {
  subject: string;
  concepts: string[];
  averageMastery: number;
  totalTime: number;
  successRate: number;
}

export interface LearningTrend {
  period: string;
  metric: string;
  value: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
}

export interface ProgressRecommendation {
  type: 'review' | 'advance' | 'practice' | 'break';
  title: string;
  description: string;
  priority: number;
  estimatedTime: number;
  concepts: string[];
}

export interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'mastery' | 'consistency' | 'improvement' | 'milestone';
  earnedAt: Date;
  points: number;
}

export class IntelligentProgressTracker {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  // تتبع تقدم مفهوم محدد
  async trackConceptProgress(studentId: string, concept: string): Promise<ConceptProgress> {
    const conceptHistory = await this.getConceptHistory(studentId, concept);
    
    if (conceptHistory.length === 0) {
      return this.createEmptyConceptProgress(concept);
    }

    const currentMastery = this.calculateCurrentMastery(conceptHistory);
    const learningVelocity = this.calculateLearningVelocity(conceptHistory);
    const retentionRate = this.calculateRetentionRate(conceptHistory);
    const difficultyAreas = this.identifyDifficultyAreas(conceptHistory);
    const progressTrend = this.analyzeProgressTrend(conceptHistory);

    return {
      conceptName: concept,
      subject: conceptHistory[0]?.subject || 'general',
      currentMastery,
      learningVelocity,
      retentionRate,
      difficultyAreas,
      nextSteps: this.suggestNextSteps(conceptHistory, currentMastery),
      estimatedTimeToMastery: this.estimateTimeToMastery(conceptHistory, currentMastery),
      progressTrend
    };
  }

  // إنشاء تقرير تقدم شامل
  async generateProgressReport(studentId: string): Promise<ProgressReport> {
    const allConcepts = await this.getStudentConcepts(studentId);
    const conceptProgresses = await Promise.all(
      allConcepts.map(concept => this.trackConceptProgress(studentId, concept))
    );

    const overallProgress = this.calculateOverallProgress(conceptProgresses);
    const strongAreas = this.identifyStrongAreas(conceptProgresses);
    const improvementAreas = this.identifyImprovementAreas(conceptProgresses);
    const learningTrends = await this.analyzeLearningTrends(studentId);
    const recommendations = this.generateRecommendations(conceptProgresses);
    const weeklyGoals = await this.generateWeeklyGoals(studentId, conceptProgresses);
    const achievements = await this.checkAchievements(studentId, conceptProgresses);

    return {
      studentId,
      overallProgress,
      strongAreas,
      improvementAreas,
      learningTrends,
      recommendations,
      weeklyGoals,
      achievements
    };
  }

  // حساب الإتقان الحالي
  private calculateCurrentMastery(history: EducationalInteraction[]): number {
    if (history.length === 0) return 0;

    // أعطي وزن أكبر للتفاعلات الحديثة
    const recentHistory = history.slice(0, 10); // آخر 10 تفاعلات
    const weights = recentHistory.map((_, index) => Math.pow(0.9, index)); // وزن متناقص
    
    let weightedSum = 0;
    let totalWeight = 0;

    recentHistory.forEach((interaction, index) => {
      const weight = weights[index];
      weightedSum += interaction.success * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0;
  }

  // حساب سرعة التعلم
  private calculateLearningVelocity(history: EducationalInteraction[]): number {
    if (history.length < 5) return 0;

    // تقسيم التاريخ إلى فترات وحساب التحسن
    const periods = this.divideToPeriods(history, 3);
    const improvements = [];

    for (let i = 1; i < periods.length; i++) {
      const previousAvg = this.calculateAverageSuccess(periods[i - 1]);
      const currentAvg = this.calculateAverageSuccess(periods[i]);
      improvements.push(currentAvg - previousAvg);
    }

    return improvements.length > 0 
      ? improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length 
      : 0;
  }

  // حساب معدل الاحتفاظ
  private calculateRetentionRate(history: EducationalInteraction[]): number {
    if (history.length < 10) return 0.5; // قيمة افتراضية

    // مقارنة الأداء في المراجعات مع الأداء الأولي
    const initialLearning = history.slice(-5); // أول 5 تفاعلات
    const recentReview = history.slice(0, 5); // آخر 5 تفاعلات

    const initialAvg = this.calculateAverageSuccess(initialLearning);
    const reviewAvg = this.calculateAverageSuccess(recentReview);

    return Math.max(0, Math.min(1, reviewAvg / Math.max(initialAvg, 0.1)));
  }

  // تحديد مناطق الصعوبة
  private identifyDifficultyAreas(history: EducationalInteraction[]): string[] {
    const difficultyMap = new Map<number, number>();
    
    history.forEach(interaction => {
      const difficulty = interaction.difficulty;
      if (!difficultyMap.has(difficulty)) {
        difficultyMap.set(difficulty, 0);
      }
      difficultyMap.set(difficulty, difficultyMap.get(difficulty)! + interaction.success);
    });

    const difficulties: string[] = [];
    difficultyMap.forEach((successSum, difficulty) => {
      const avgSuccess = successSum / history.filter(h => h.difficulty === difficulty).length;
      if (avgSuccess < 0.6) {
        difficulties.push(`مستوى الصعوبة ${difficulty}`);
      }
    });

    return difficulties;
  }

  // تحليل اتجاه التقدم
  private analyzeProgressTrend(history: EducationalInteraction[]): 'improving' | 'stable' | 'declining' {
    if (history.length < 6) return 'stable';

    const recent = history.slice(0, 3);
    const previous = history.slice(3, 6);

    const recentAvg = this.calculateAverageSuccess(recent);
    const previousAvg = this.calculateAverageSuccess(previous);

    const difference = recentAvg - previousAvg;

    if (difference > 0.1) return 'improving';
    if (difference < -0.1) return 'declining';
    return 'stable';
  }

  // اقتراح الخطوات التالية
  private suggestNextSteps(history: EducationalInteraction[], currentMastery: number): string[] {
    const steps: string[] = [];

    if (currentMastery < 30) {
      steps.push('مراجعة المفاهيم الأساسية');
      steps.push('التدرب على أمثلة بسيطة');
    } else if (currentMastery < 70) {
      steps.push('حل تمارين متوسطة الصعوبة');
      steps.push('ربط المفهوم بمفاهيم أخرى');
    } else if (currentMastery < 90) {
      steps.push('حل مسائل متقدمة');
      steps.push('تطبيق المفهوم في سياقات جديدة');
    } else {
      steps.push('تعليم المفهوم للآخرين');
      steps.push('الانتقال لمفاهيم أكثر تقدماً');
    }

    return steps;
  }

  // تقدير الوقت المطلوب للإتقان
  private estimateTimeToMastery(history: EducationalInteraction[], currentMastery: number): number {
    if (currentMastery >= 90) return 0;

    const velocity = this.calculateLearningVelocity(history);
    const remainingMastery = 90 - currentMastery;

    if (velocity <= 0) return -1; // غير قابل للتحديد

    // تقدير بناءً على السرعة الحالية (بالساعات)
    const estimatedHours = (remainingMastery / velocity) * 2; // تقدير تقريبي
    return Math.max(1, Math.round(estimatedHours));
  }

  // حساب التقدم العام
  private calculateOverallProgress(progresses: ConceptProgress[]): number {
    if (progresses.length === 0) return 0;

    const totalMastery = progresses.reduce((sum, p) => sum + p.currentMastery, 0);
    return Math.round(totalMastery / progresses.length);
  }

  // تحديد المناطق القوية
  private identifyStrongAreas(progresses: ConceptProgress[]): ConceptArea[] {
    const subjectMap = new Map<string, ConceptProgress[]>();
    
    progresses.forEach(progress => {
      if (!subjectMap.has(progress.subject)) {
        subjectMap.set(progress.subject, []);
      }
      subjectMap.get(progress.subject)!.push(progress);
    });

    const strongAreas: ConceptArea[] = [];
    
    subjectMap.forEach((concepts, subject) => {
      const avgMastery = concepts.reduce((sum, c) => sum + c.currentMastery, 0) / concepts.length;
      
      if (avgMastery >= 70) {
        strongAreas.push({
          subject,
          concepts: concepts.map(c => c.conceptName),
          averageMastery: Math.round(avgMastery),
          totalTime: concepts.reduce((sum, c) => sum + c.estimatedTimeToMastery, 0),
          successRate: avgMastery / 100
        });
      }
    });

    return strongAreas.sort((a, b) => b.averageMastery - a.averageMastery);
  }

  // تحديد مناطق التحسين
  private identifyImprovementAreas(progresses: ConceptProgress[]): ConceptArea[] {
    const subjectMap = new Map<string, ConceptProgress[]>();
    
    progresses.forEach(progress => {
      if (!subjectMap.has(progress.subject)) {
        subjectMap.set(progress.subject, []);
      }
      subjectMap.get(progress.subject)!.push(progress);
    });

    const improvementAreas: ConceptArea[] = [];
    
    subjectMap.forEach((concepts, subject) => {
      const avgMastery = concepts.reduce((sum, c) => sum + c.currentMastery, 0) / concepts.length;
      
      if (avgMastery < 70) {
        improvementAreas.push({
          subject,
          concepts: concepts.map(c => c.conceptName),
          averageMastery: Math.round(avgMastery),
          totalTime: concepts.reduce((sum, c) => sum + c.estimatedTimeToMastery, 0),
          successRate: avgMastery / 100
        });
      }
    });

    return improvementAreas.sort((a, b) => a.averageMastery - b.averageMastery);
  }

  // توليد التوصيات
  private generateRecommendations(progresses: ConceptProgress[]): ProgressRecommendation[] {
    const recommendations: ProgressRecommendation[] = [];

    // توصيات للمراجعة
    const needReview = progresses.filter(p => p.progressTrend === 'declining');
    if (needReview.length > 0) {
      recommendations.push({
        type: 'review',
        title: 'مراجعة المفاهيم المتراجعة',
        description: `راجع هذه المفاهيم لتحسين الأداء: ${needReview.map(p => p.conceptName).join(', ')}`,
        priority: 9,
        estimatedTime: needReview.length * 30,
        concepts: needReview.map(p => p.conceptName)
      });
    }

    // توصيات للتقدم
    const readyToAdvance = progresses.filter(p => p.currentMastery >= 80);
    if (readyToAdvance.length > 0) {
      recommendations.push({
        type: 'advance',
        title: 'الانتقال لمستوى أعلى',
        description: `أنت مستعد للانتقال لمفاهيم أكثر تقدماً في: ${readyToAdvance.map(p => p.subject).join(', ')}`,
        priority: 7,
        estimatedTime: 60,
        concepts: readyToAdvance.map(p => p.conceptName)
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  // وظائف مساعدة
  private async getConceptHistory(studentId: string, concept: string): Promise<EducationalInteraction[]> {
    const interactions = await this.prisma.educationalInteraction.findMany({
      where: {
        studentId,
        conceptAddressed: concept
      },
      orderBy: { createdAt: 'desc' }
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

  private async getStudentConcepts(studentId: string): Promise<string[]> {
    const concepts = await this.prisma.conceptMastery.findMany({
      where: { studentId },
      select: { conceptName: true },
      distinct: ['conceptName']
    });

    return concepts.map(c => c.conceptName);
  }

  private createEmptyConceptProgress(concept: string): ConceptProgress {
    return {
      conceptName: concept,
      subject: 'general',
      currentMastery: 0,
      learningVelocity: 0,
      retentionRate: 0,
      difficultyAreas: [],
      nextSteps: ['البدء في تعلم المفهوم'],
      estimatedTimeToMastery: -1,
      progressTrend: 'stable'
    };
  }

  private divideToPeriods(history: EducationalInteraction[], periods: number): EducationalInteraction[][] {
    const periodSize = Math.ceil(history.length / periods);
    const result: EducationalInteraction[][] = [];

    for (let i = 0; i < periods; i++) {
      const start = i * periodSize;
      const end = Math.min(start + periodSize, history.length);
      result.push(history.slice(start, end));
    }

    return result.filter(period => period.length > 0);
  }

  private calculateAverageSuccess(interactions: EducationalInteraction[]): number {
    if (interactions.length === 0) return 0;
    return interactions.reduce((sum, i) => sum + i.success, 0) / interactions.length;
  }

  private async analyzeLearningTrends(studentId: string): Promise<LearningTrend[]> {
    // تحليل الاتجاهات (سيتم تطويره في المراحل التالية)
    return [];
  }

  private async generateWeeklyGoals(studentId: string, progresses: ConceptProgress[]): Promise<WeeklyGoal[]> {
    // توليد الأهداف الأسبوعية (سيتم تطويره في المراحل التالية)
    return [];
  }

  private async checkAchievements(studentId: string, progresses: ConceptProgress[]): Promise<Achievement[]> {
    // فحص الإنجازات (سيتم تطويره في المراحل التالية)
    return [];
  }
}
