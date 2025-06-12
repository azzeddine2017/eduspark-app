// نظام الذاكرة البسيط لمرجان المعلم الافتراضي
// Simple Memory System for Marjan Virtual Teacher

export interface StudentProfile {
  id: string;
  name?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  preferredSubjects: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  strengths: string[];
  weaknesses: string[];
  lastInteraction: Date;
  totalInteractions: number;
  averageSessionDuration: number; // بالدقائق
}

export interface ConversationMemory {
  sessionId: string;
  studentId: string;
  messages: ConversationMessage[];
  topics: string[];
  concepts: ConceptProgress[];
  startTime: Date;
  lastActivity: Date;
  sessionSummary?: string;
}

export interface ConversationMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'socratic' | 'explanation' | 'encouragement' | 'text';
  metadata?: {
    subject?: string;
    concept?: string;
    difficulty?: number;
    studentResponse?: 'correct' | 'partial' | 'incorrect' | 'confused';
  };
}

export interface ConceptProgress {
  concept: string;
  subject: string;
  masteryLevel: number; // 0-100
  attempts: number;
  correctAnswers: number;
  lastPracticed: Date;
  needsReview: boolean;
  commonMistakes: string[];
}

export interface LearningInsight {
  type: 'strength' | 'weakness' | 'improvement' | 'suggestion';
  description: string;
  evidence: string[];
  confidence: number; // 0-100
  actionable: boolean;
}

export class SimpleMemorySystem {
  private storageKey = 'marjan_memory';
  
  /**
   * حفظ ملف الطالب
   */
  saveStudentProfile(profile: StudentProfile): void {
    const memory = this.getMemoryData();
    memory.students[profile.id] = profile;
    this.saveMemoryData(memory);
  }
  
  /**
   * الحصول على ملف الطالب
   */
  getStudentProfile(studentId: string): StudentProfile | null {
    const memory = this.getMemoryData();
    return memory.students[studentId] || null;
  }
  
  /**
   * إنشاء ملف طالب جديد
   */
  createStudentProfile(studentId: string, initialData?: Partial<StudentProfile>): StudentProfile {
    const profile: StudentProfile = {
      id: studentId,
      level: 'intermediate',
      preferredSubjects: [],
      learningStyle: 'mixed',
      strengths: [],
      weaknesses: [],
      lastInteraction: new Date(),
      totalInteractions: 0,
      averageSessionDuration: 0,
      ...initialData
    };
    
    this.saveStudentProfile(profile);
    return profile;
  }
  
  /**
   * حفظ محادثة
   */
  saveConversation(conversation: ConversationMemory): void {
    const memory = this.getMemoryData();
    memory.conversations[conversation.sessionId] = conversation;
    
    // الاحتفاظ بآخر 50 محادثة فقط لتوفير المساحة
    const conversations = Object.values(memory.conversations);
    if (conversations.length > 50) {
      const sortedConversations = conversations.sort(
        (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
      );
      
      memory.conversations = {};
      sortedConversations.slice(0, 50).forEach(conv => {
        memory.conversations[conv.sessionId] = conv;
      });
    }
    
    this.saveMemoryData(memory);
  }
  
  /**
   * الحصول على محادثة
   */
  getConversation(sessionId: string): ConversationMemory | null {
    const memory = this.getMemoryData();
    return memory.conversations[sessionId] || null;
  }
  
  /**
   * الحصول على آخر محادثات الطالب
   */
  getStudentConversations(studentId: string, limit: number = 5): ConversationMemory[] {
    const memory = this.getMemoryData();
    const conversations = Object.values(memory.conversations)
      .filter(conv => conv.studentId === studentId)
      .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
      .slice(0, limit);
    
    return conversations;
  }
  
  /**
   * إضافة رسالة للمحادثة الحالية
   */
  addMessageToConversation(
    sessionId: string, 
    message: ConversationMessage,
    studentId: string
  ): void {
    let conversation = this.getConversation(sessionId);
    
    if (!conversation) {
      conversation = {
        sessionId,
        studentId,
        messages: [],
        topics: [],
        concepts: [],
        startTime: new Date(),
        lastActivity: new Date()
      };
    }
    
    conversation.messages.push(message);
    conversation.lastActivity = new Date();
    
    // استخراج المواضيع والمفاهيم من الرسالة
    if (message.metadata?.subject && !conversation.topics.includes(message.metadata.subject)) {
      conversation.topics.push(message.metadata.subject);
    }
    
    if (message.metadata?.concept) {
      this.updateConceptProgress(conversation, message);
    }
    
    this.saveConversation(conversation);
  }
  
  /**
   * تحديث تقدم المفهوم
   */
  private updateConceptProgress(
    conversation: ConversationMemory, 
    message: ConversationMessage
  ): void {
    if (!message.metadata?.concept || !message.metadata?.subject) return;
    
    const concept = message.metadata.concept;
    const subject = message.metadata.subject;
    
    let conceptProgress = conversation.concepts.find(c => c.concept === concept);
    
    if (!conceptProgress) {
      conceptProgress = {
        concept,
        subject,
        masteryLevel: 50, // نبدأ بمستوى متوسط
        attempts: 0,
        correctAnswers: 0,
        lastPracticed: new Date(),
        needsReview: false,
        commonMistakes: []
      };
      conversation.concepts.push(conceptProgress);
    }
    
    conceptProgress.attempts++;
    conceptProgress.lastPracticed = new Date();
    
    // تحديث مستوى الإتقان بناءً على استجابة الطالب
    if (message.metadata.studentResponse) {
      switch (message.metadata.studentResponse) {
        case 'correct':
          conceptProgress.correctAnswers++;
          conceptProgress.masteryLevel = Math.min(100, conceptProgress.masteryLevel + 10);
          conceptProgress.needsReview = false;
          break;
        case 'partial':
          conceptProgress.masteryLevel = Math.min(100, conceptProgress.masteryLevel + 5);
          break;
        case 'incorrect':
          conceptProgress.masteryLevel = Math.max(0, conceptProgress.masteryLevel - 5);
          conceptProgress.needsReview = true;
          break;
        case 'confused':
          conceptProgress.masteryLevel = Math.max(0, conceptProgress.masteryLevel - 10);
          conceptProgress.needsReview = true;
          break;
      }
    }
  }
  
  /**
   * تحليل تقدم الطالب وإنتاج رؤى تعليمية
   */
  generateLearningInsights(studentId: string): LearningInsight[] {
    const profile = this.getStudentProfile(studentId);
    const conversations = this.getStudentConversations(studentId, 10);
    
    if (!profile || conversations.length === 0) {
      return [];
    }
    
    const insights: LearningInsight[] = [];
    
    // تحليل المواضيع المفضلة
    const subjectFrequency = this.analyzeSubjectFrequency(conversations);
    const mostFrequentSubject = Object.keys(subjectFrequency)[0];
    
    if (mostFrequentSubject) {
      insights.push({
        type: 'strength',
        description: `يظهر الطالب اهتماماً كبيراً بمادة ${mostFrequentSubject}`,
        evidence: [`${subjectFrequency[mostFrequentSubject]} سؤال في هذه المادة`],
        confidence: 80,
        actionable: true
      });
    }
    
    // تحليل المفاهيم التي تحتاج مراجعة
    const conceptsNeedingReview = this.getConceptsNeedingReview(conversations);
    
    if (conceptsNeedingReview.length > 0) {
      insights.push({
        type: 'weakness',
        description: `هناك ${conceptsNeedingReview.length} مفهوم يحتاج مراجعة`,
        evidence: conceptsNeedingReview.map(c => c.concept),
        confidence: 90,
        actionable: true
      });
    }
    
    // تحليل نمط التعلم
    const learningPatterns = this.analyzeLearningPatterns(conversations);
    
    if (learningPatterns.prefersVisualAids) {
      insights.push({
        type: 'suggestion',
        description: 'الطالب يستفيد أكثر من التوضيحات البصرية',
        evidence: ['طلب توضيحات بصرية في عدة مناسبات'],
        confidence: 75,
        actionable: true
      });
    }
    
    return insights;
  }
  
  /**
   * تحليل تكرار المواضيع
   */
  private analyzeSubjectFrequency(conversations: ConversationMemory[]): Record<string, number> {
    const frequency: Record<string, number> = {};
    
    conversations.forEach(conv => {
      conv.topics.forEach(topic => {
        frequency[topic] = (frequency[topic] || 0) + 1;
      });
    });
    
    // ترتيب حسب التكرار
    return Object.fromEntries(
      Object.entries(frequency).sort(([,a], [,b]) => b - a)
    );
  }
  
  /**
   * الحصول على المفاهيم التي تحتاج مراجعة
   */
  private getConceptsNeedingReview(conversations: ConversationMemory[]): ConceptProgress[] {
    const allConcepts: ConceptProgress[] = [];
    
    conversations.forEach(conv => {
      allConcepts.push(...conv.concepts);
    });
    
    return allConcepts.filter(concept => 
      concept.needsReview || concept.masteryLevel < 60
    );
  }
  
  /**
   * تحليل أنماط التعلم
   */
  private analyzeLearningPatterns(conversations: ConversationMemory[]): {
    prefersVisualAids: boolean;
    asksFollowUpQuestions: boolean;
    needsEncouragement: boolean;
  } {
    let visualAidRequests = 0;
    let followUpQuestions = 0;
    let confusionIndicators = 0;
    let totalMessages = 0;
    
    conversations.forEach(conv => {
      conv.messages.forEach(msg => {
        if (msg.isUser) {
          totalMessages++;
          
          if (msg.content.includes('ارسم') || msg.content.includes('وضح') || 
              msg.content.includes('صورة') || msg.content.includes('مخطط')) {
            visualAidRequests++;
          }
          
          if (msg.content.includes('كيف') || msg.content.includes('لماذا') ||
              msg.content.includes('ماذا عن')) {
            followUpQuestions++;
          }
          
          if (msg.content.includes('لا أفهم') || msg.content.includes('صعب') ||
              msg.content.includes('معقد')) {
            confusionIndicators++;
          }
        }
      });
    });
    
    return {
      prefersVisualAids: (visualAidRequests / totalMessages) > 0.2,
      asksFollowUpQuestions: (followUpQuestions / totalMessages) > 0.3,
      needsEncouragement: (confusionIndicators / totalMessages) > 0.1
    };
  }
  
  /**
   * الحصول على بيانات الذاكرة من التخزين المحلي
   */
  private getMemoryData(): {
    students: Record<string, StudentProfile>;
    conversations: Record<string, ConversationMemory>;
  } {
    if (typeof window === 'undefined') {
      return { students: {}, conversations: {} };
    }
    
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        
        // تحويل التواريخ من strings إلى Date objects
        Object.values(parsed.students || {}).forEach((student: any) => {
          student.lastInteraction = new Date(student.lastInteraction);
        });
        
        Object.values(parsed.conversations || {}).forEach((conv: any) => {
          conv.startTime = new Date(conv.startTime);
          conv.lastActivity = new Date(conv.lastActivity);
          conv.messages.forEach((msg: any) => {
            msg.timestamp = new Date(msg.timestamp);
          });
          conv.concepts.forEach((concept: any) => {
            concept.lastPracticed = new Date(concept.lastPracticed);
          });
        });
        
        return parsed;
      }
    } catch (error) {
      console.error('خطأ في قراءة بيانات الذاكرة:', error);
    }
    
    return { students: {}, conversations: {} };
  }
  
  /**
   * حفظ بيانات الذاكرة في التخزين المحلي
   */
  private saveMemoryData(data: {
    students: Record<string, StudentProfile>;
    conversations: Record<string, ConversationMemory>;
  }): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('خطأ في حفظ بيانات الذاكرة:', error);
    }
  }
  
  /**
   * مسح جميع بيانات الذاكرة
   */
  clearAllMemory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageKey);
  }
  
  /**
   * الحصول على إحصائيات الذاكرة
   */
  getMemoryStats(): {
    totalStudents: number;
    totalConversations: number;
    totalMessages: number;
    storageSize: string;
  } {
    const memory = this.getMemoryData();
    
    const totalStudents = Object.keys(memory.students).length;
    const totalConversations = Object.keys(memory.conversations).length;
    const totalMessages = Object.values(memory.conversations)
      .reduce((sum, conv) => sum + conv.messages.length, 0);
    
    let storageSize = '0 KB';
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
          const sizeInBytes = new Blob([data]).size;
          storageSize = `${(sizeInBytes / 1024).toFixed(2)} KB`;
        }
      } catch (error) {
        storageSize = 'غير معروف';
      }
    }
    
    return {
      totalStudents,
      totalConversations,
      totalMessages,
      storageSize
    };
  }
}

// إنشاء instance واحد للاستخدام العام
export const memorySystem = new SimpleMemorySystem();
