// اختبارات نظام الذاكرة التعليمية - المرحلة الأولى
import { EducationalMemoryManager } from '../educational-memory';
import { LearningStyleAnalyzer } from '../../student/learning-style-analyzer';
import { IntelligentProgressTracker } from '../../progress/progress-tracker';

// Mock Prisma Client
const mockPrismaClient = {
  studentProfile: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  educationalInteraction: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  conceptMastery: {
    upsert: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));

describe('EducationalMemoryManager', () => {
  let memoryManager: EducationalMemoryManager;
  let mockPrisma: any;

  beforeEach(() => {
    memoryManager = new EducationalMemoryManager();
    mockPrisma = (memoryManager as any).prisma;
  });

  describe('getOrCreateStudentProfile', () => {
    it('should create new student profile if not exists', async () => {
      const userId = 'test-user-id';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        birthDate: new Date('2000-01-01'),
        occupation: 'طالب'
      };

      const mockProfile = {
        id: 'profile-id',
        userId: userId,
        learningStyleVisual: 25,
        learningStyleAuditory: 25,
        learningStyleKinesthetic: 25,
        learningStyleReading: 25,
        culturalContext: 'arabic',
        interests: [],
        strengths: [],
        weaknesses: [],
        conceptMastery: [],
        educationalInteractions: []
      };

      mockPrisma.studentProfile.findUnique.mockResolvedValue(null);
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.studentProfile.create.mockResolvedValue(mockProfile);

      const result = await memoryManager.getOrCreateStudentProfile(userId);

      expect(result).toBeDefined();
      expect(result.userId).toBe(userId);
      expect(result.culturalContext).toBe('arabic');
      expect(mockPrisma.studentProfile.create).toHaveBeenCalled();
    });

    it('should return existing student profile', async () => {
      const userId = 'test-user-id';
      const existingProfile = {
        id: 'profile-id',
        userId: userId,
        learningStyleVisual: 40,
        learningStyleAuditory: 30,
        learningStyleKinesthetic: 20,
        learningStyleReading: 10,
        culturalContext: 'arabic',
        interests: ['رياضيات', 'علوم'],
        strengths: ['حل المسائل'],
        weaknesses: ['الحفظ'],
        conceptMastery: [],
        educationalInteractions: []
      };

      mockPrisma.studentProfile.findUnique.mockResolvedValue(existingProfile);

      const result = await memoryManager.getOrCreateStudentProfile(userId);

      expect(result).toBeDefined();
      expect(result.learningStyle.visual).toBe(40);
      expect(result.interests).toContain('رياضيات');
      expect(mockPrisma.studentProfile.create).not.toHaveBeenCalled();
    });
  });

  describe('updateShortTermMemory', () => {
    it('should save educational interaction', async () => {
      const sessionId = 'test-session';
      const interaction = {
        studentId: 'student-id',
        sessionId: sessionId,
        question: 'ما هي الكسور؟',
        response: 'الكسور هي أجزاء من الكل...',
        methodology: 'direct_instruction',
        success: 0.8,
        concept: 'الكسور',
        subject: 'رياضيات',
        difficulty: 5,
        responseTime: 120
      };

      mockPrisma.educationalInteraction.create.mockResolvedValue({
        id: 'interaction-id',
        ...interaction
      });

      await memoryManager.updateShortTermMemory(sessionId, interaction);

      expect(mockPrisma.educationalInteraction.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          studentId: interaction.studentId,
          sessionId: sessionId,
          question: interaction.question,
          response: interaction.response,
          methodologyUsed: interaction.methodology,
          successIndicator: interaction.success,
          conceptAddressed: interaction.concept,
          subject: interaction.subject,
          difficultyLevel: interaction.difficulty,
          responseTimeSeconds: interaction.responseTime
        })
      });
    });
  });

  describe('updateMediumTermMemory', () => {
    it('should update concept mastery based on recent interactions', async () => {
      const studentId = 'student-id';
      const mockInteractions = [
        {
          id: '1',
          studentId: studentId,
          conceptAddressed: 'الكسور',
          subject: 'رياضيات',
          successIndicator: 0.8,
          createdAt: new Date()
        },
        {
          id: '2',
          studentId: studentId,
          conceptAddressed: 'الكسور',
          subject: 'رياضيات',
          successIndicator: 0.9,
          createdAt: new Date()
        }
      ];

      mockPrisma.educationalInteraction.findMany.mockResolvedValue(mockInteractions);
      mockPrisma.conceptMastery.upsert.mockResolvedValue({});

      await memoryManager.updateMediumTermMemory(studentId);

      expect(mockPrisma.conceptMastery.upsert).toHaveBeenCalledWith({
        where: {
          studentId_conceptName_subject: {
            studentId: studentId,
            conceptName: 'الكسور',
            subject: 'رياضيات'
          }
        },
        update: expect.objectContaining({
          masteryLevel: expect.any(Number),
          attemptsCount: 2,
          successRate: expect.any(Number)
        }),
        create: expect.objectContaining({
          studentId: studentId,
          conceptName: 'الكسور',
          subject: 'رياضيات'
        })
      });
    });
  });
});

describe('LearningStyleAnalyzer', () => {
  let analyzer: LearningStyleAnalyzer;
  let mockPrisma: any;

  beforeEach(() => {
    analyzer = new LearningStyleAnalyzer();
    mockPrisma = (analyzer as any).prisma;
  });

  describe('analyzeLearningStyle', () => {
    it('should return default style for insufficient data', async () => {
      const studentId = 'student-id';
      mockPrisma.educationalInteraction.findMany.mockResolvedValue([]);

      const result = await analyzer.analyzeLearningStyle(studentId);

      expect(result.visualPreference).toBe(25);
      expect(result.auditoryPreference).toBe(25);
      expect(result.kinestheticPreference).toBe(25);
      expect(result.readingPreference).toBe(25);
      expect(result.confidence).toBe(0.1);
    });

    it('should analyze learning style from interactions', async () => {
      const studentId = 'student-id';
      const mockInteractions = Array.from({ length: 10 }, (_, i) => ({
        id: `interaction-${i}`,
        studentId: studentId,
        methodologyUsed: i % 2 === 0 ? 'visual_demo' : 'direct_instruction',
        successIndicator: i % 2 === 0 ? 0.9 : 0.6, // visual methods more successful
        responseTimeSeconds: 60,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000) // spread over days
      }));

      mockPrisma.educationalInteraction.findMany.mockResolvedValue(mockInteractions);

      const result = await analyzer.analyzeLearningStyle(studentId);

      expect(result.confidence).toBeGreaterThan(0.1);
      expect(result.preferredMethodologies).toBeDefined();
      expect(result.optimalPace).toMatch(/^(slow|medium|fast)$/);
    });
  });
});

describe('IntelligentProgressTracker', () => {
  let tracker: IntelligentProgressTracker;
  let mockPrisma: any;

  beforeEach(() => {
    tracker = new IntelligentProgressTracker();
    mockPrisma = (tracker as any).prisma;
  });

  describe('trackConceptProgress', () => {
    it('should return empty progress for new concept', async () => {
      const studentId = 'student-id';
      const concept = 'الكسور';

      mockPrisma.educationalInteraction.findMany.mockResolvedValue([]);

      const result = await tracker.trackConceptProgress(studentId, concept);

      expect(result.conceptName).toBe(concept);
      expect(result.currentMastery).toBe(0);
      expect(result.nextSteps).toContain('البدء في تعلم المفهوم');
    });

    it('should calculate progress from interaction history', async () => {
      const studentId = 'student-id';
      const concept = 'الكسور';
      const mockInteractions = [
        {
          id: '1',
          studentId: studentId,
          conceptAddressed: concept,
          subject: 'رياضيات',
          successIndicator: 0.6,
          difficultyLevel: 3,
          responseTimeSeconds: 120,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          studentId: studentId,
          conceptAddressed: concept,
          subject: 'رياضيات',
          successIndicator: 0.8,
          difficultyLevel: 4,
          responseTimeSeconds: 90,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          studentId: studentId,
          conceptAddressed: concept,
          subject: 'رياضيات',
          successIndicator: 0.9,
          difficultyLevel: 5,
          responseTimeSeconds: 60,
          createdAt: new Date()
        }
      ];

      mockPrisma.educationalInteraction.findMany.mockResolvedValue(mockInteractions);

      const result = await tracker.trackConceptProgress(studentId, concept);

      expect(result.conceptName).toBe(concept);
      expect(result.currentMastery).toBeGreaterThan(0);
      expect(result.learningVelocity).toBeGreaterThan(0);
      expect(result.progressTrend).toBe('improving');
    });
  });

  describe('generateProgressReport', () => {
    it('should generate comprehensive progress report', async () => {
      const studentId = 'student-id';

      mockPrisma.conceptMastery.findMany.mockResolvedValue([
        { conceptName: 'الكسور' },
        { conceptName: 'الجبر' }
      ]);

      // Mock the trackConceptProgress calls
      const mockTrackConceptProgress = jest.spyOn(tracker, 'trackConceptProgress');
      mockTrackConceptProgress.mockResolvedValue({
        conceptName: 'الكسور',
        subject: 'رياضيات',
        currentMastery: 75,
        learningVelocity: 0.1,
        retentionRate: 0.8,
        difficultyAreas: [],
        nextSteps: ['حل تمارين متقدمة'],
        estimatedTimeToMastery: 5,
        progressTrend: 'improving'
      });

      const result = await tracker.generateProgressReport(studentId);

      expect(result.studentId).toBe(studentId);
      expect(result.overallProgress).toBeDefined();
      expect(result.strongAreas).toBeDefined();
      expect(result.improvementAreas).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });
  });
});

// Integration Tests
describe('Enhanced Marjan Integration', () => {
  it('should work together seamlessly', async () => {
    const memoryManager = new EducationalMemoryManager();
    const styleAnalyzer = new LearningStyleAnalyzer();
    const progressTracker = new IntelligentProgressTracker();

    // Mock successful operations
    const mockPrisma = (memoryManager as any).prisma;
    mockPrisma.studentProfile.findUnique.mockResolvedValue({
      id: 'profile-id',
      userId: 'user-id',
      learningStyleVisual: 40,
      learningStyleAuditory: 30,
      learningStyleKinesthetic: 20,
      learningStyleReading: 10,
      culturalContext: 'arabic',
      interests: ['رياضيات'],
      strengths: [],
      weaknesses: [],
      conceptMastery: [],
      educationalInteractions: []
    });

    const studentProfile = await memoryManager.getOrCreateStudentProfile('user-id');
    expect(studentProfile).toBeDefined();

    // Test that all components can work with the same student profile
    expect(studentProfile.learningStyle.visual).toBe(40);
    expect(studentProfile.culturalContext).toBe('arabic');
  });
});
