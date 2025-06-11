import { PrismaClient, GlobalContentType, ContentCategory, ContentLevel, AgeGroup, ContentTier, ReviewStatus, TranslationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// أنواع البيانات لإدارة المحتوى
export interface CreateGlobalContentInput {
  title: string;
  description?: string;
  type: GlobalContentType;
  category: ContentCategory;
  level: ContentLevel;
  ageGroup: AgeGroup;
  tier: ContentTier;
  estimatedDuration?: number;
  prerequisites?: string[];
  learningObjectives?: string[];
  contentData: any;
  metadata?: any;
}

export interface LocalizeContentInput {
  globalContentId: string;
  nodeId: string;
  targetLanguage: string;
  localizationType: 'translation' | 'adaptation' | 'recreation';
  culturalAdaptations?: CulturalAdaptation[];
  localExamples?: LocalExample[];
  additionalResources?: any[];
}

export interface CulturalAdaptation {
  section: string;
  originalContent: string;
  adaptedContent: string;
  reason: string;
  approvedBy: string;
}

export interface LocalExample {
  context: string;
  originalExample: string;
  localExample: string;
  relevanceScore: number;
}

export interface DistributionOptions {
  targetNodes?: string[];
  distributionType: 'push_all' | 'selective' | 'on_demand';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledTime?: Date;
}

export interface TranslationRequest {
  localContentId: string;
  translatorId: string;
  sourceLanguage: string;
  targetLanguage: string;
  sourceText: string;
  translationType: 'automatic' | 'human' | 'hybrid';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// خدمة إدارة المحتوى الموزع
export class ContentDistributionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // إدارة المحتوى العالمي

  // إنشاء محتوى عالمي جديد
  async createGlobalContent(contentData: CreateGlobalContentInput, authorId: string) {
    try {
      const globalContent = await this.prisma.globalContent.create({
        data: {
          title: contentData.title,
          description: contentData.description,
          type: contentData.type,
          category: contentData.category,
          level: contentData.level,
          ageGroup: contentData.ageGroup,
          tier: contentData.tier,
          estimatedDuration: contentData.estimatedDuration,
          prerequisites: contentData.prerequisites || [],
          learningObjectives: contentData.learningObjectives || [],
          contentData: contentData.contentData,
          metadata: {
            ...contentData.metadata,
            author: authorId,
            createdBy: authorId,
            lastModifiedBy: authorId
          }
        }
      });

      // إنشاء أول إصدار
      await this.createContentVersion(globalContent.id, '1.0.0', 'major', ['إنشاء المحتوى الأولي'], contentData.contentData);

      return globalContent;
    } catch (error) {
      console.error('خطأ في إنشاء المحتوى العالمي:', error);
      throw error;
    }
  }

  // إنشاء إصدار جديد من المحتوى
  async createContentVersion(globalContentId: string, version: string, changeType: string, changes: string[], contentData: any) {
    return await this.prisma.contentVersion.create({
      data: {
        globalContentId,
        version,
        changeType,
        changes,
        contentData,
        isStable: changeType === 'patch' // الإصلاحات البسيطة مستقرة تلقائياً
      }
    });
  }

  // جلب المحتوى العالمي مع الفلترة
  async getGlobalContent(filters?: {
    type?: GlobalContentType;
    category?: ContentCategory;
    level?: ContentLevel;
    tier?: ContentTier;
    isPublished?: boolean;
    searchTerm?: string;
  }) {
    const where: any = {};

    if (filters) {
      if (filters.type) where.type = filters.type;
      if (filters.category) where.category = filters.category;
      if (filters.level) where.level = filters.level;
      if (filters.tier) where.tier = filters.tier;
      if (filters.isPublished !== undefined) where.isPublished = filters.isPublished;
      
      if (filters.searchTerm) {
        where.OR = [
          { title: { contains: filters.searchTerm } },
          { description: { contains: filters.searchTerm } }
        ];
      }
    }

    return await this.prisma.globalContent.findMany({
      where,
      include: {
        reviews: {
          include: { reviewer: { select: { name: true, email: true } } }
        },
        versions: { orderBy: { publishedAt: 'desc' }, take: 5 },
        localizations: { include: { node: { select: { name: true, language: true } } } }
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  // توزيع المحتوى للعقد المحلية
  async distributeContent(globalContentId: string, options: DistributionOptions) {
    try {
      // التحقق من وجود المحتوى
      const globalContent = await this.prisma.globalContent.findUnique({
        where: { id: globalContentId }
      });

      if (!globalContent) {
        throw new Error('المحتوى العالمي غير موجود');
      }

      // تحديد العقد المستهدفة
      let targetNodes = options.targetNodes;
      if (!targetNodes || targetNodes.length === 0) {
        const allNodes = await this.prisma.localNode.findMany({
          where: { status: 'ACTIVE' },
          select: { id: true }
        });
        targetNodes = allNodes.map(node => node.id);
      }

      // إنشاء سجل التوزيع
      const distribution = await this.prisma.contentDistribution.create({
        data: {
          globalContentId,
          targetNodes,
          distributionType: options.distributionType,
          metadata: {
            priority: options.priority,
            scheduledTime: options.scheduledTime,
            totalTargetNodes: targetNodes.length
          }
        }
      });

      // بدء عملية التوزيع
      await this.executeDistribution(distribution.id, globalContent, targetNodes);

      return distribution;
    } catch (error) {
      console.error('خطأ في توزيع المحتوى:', error);
      throw error;
    }
  }

  // تنفيذ عملية التوزيع
  private async executeDistribution(distributionId: string, globalContent: any, targetNodes: string[]) {
    let successfulNodes = 0;
    let failedNodes = 0;
    const errors: any[] = [];

    // تحديث حالة التوزيع إلى "قيد التنفيذ"
    await this.prisma.contentDistribution.update({
      where: { id: distributionId },
      data: { status: 'in_progress' }
    });

    for (const nodeId of targetNodes) {
      try {
        // التحقق من وجود المحتوى مسبقاً في العقدة
        const existingContent = await this.prisma.localContent.findFirst({
          where: {
            nodeId,
            globalContentId: globalContent.id
          }
        });

        if (!existingContent) {
          // إنشاء نسخة محلية من المحتوى
          await this.prisma.localContent.create({
            data: {
              nodeId,
              globalContentId: globalContent.id,
              title: globalContent.title,
              description: globalContent.description,
              contentType: globalContent.type,
              contentData: globalContent.contentData,
              language: 'ar', // اللغة الافتراضية
              version: globalContent.version,
              status: 'published'
            }
          });
        } else {
          // تحديث المحتوى الموجود
          await this.prisma.localContent.update({
            where: { id: existingContent.id },
            data: {
              title: globalContent.title,
              description: globalContent.description,
              contentData: globalContent.contentData,
              version: globalContent.version,
              updatedAt: new Date()
            }
          });
        }

        successfulNodes++;
      } catch (error: any) {
        failedNodes++;
        errors.push({
          nodeId,
          error: error.message,
          timestamp: new Date()
        });
      }
    }

    // تحديث نتائج التوزيع
    await this.prisma.contentDistribution.update({
      where: { id: distributionId },
      data: {
        status: failedNodes === 0 ? 'completed' : 'partial_failure',
        completedAt: new Date(),
        successfulNodes,
        failedNodes,
        errors
      }
    });
  }

  // تخصيص المحتوى محلياً
  async localizeContent(localizationData: LocalizeContentInput, localizerId: string) {
    try {
      // التحقق من وجود المحتوى العالمي
      const globalContent = await this.prisma.globalContent.findUnique({
        where: { id: localizationData.globalContentId }
      });

      if (!globalContent) {
        throw new Error('المحتوى العالمي غير موجود');
      }

      // التحقق من وجود العقدة
      const node = await this.prisma.localNode.findUnique({
        where: { id: localizationData.nodeId }
      });

      if (!node) {
        throw new Error('العقدة المحلية غير موجودة');
      }

      // إنشاء أو تحديث المحتوى المحلي
      const existingLocalContent = await this.prisma.localContent.findFirst({
        where: {
          nodeId: localizationData.nodeId,
          globalContentId: localizationData.globalContentId
        }
      });

      const customizationData = {
        localizationType: localizationData.localizationType,
        culturalAdaptations: localizationData.culturalAdaptations || [],
        localExamples: localizationData.localExamples || [],
        additionalResources: localizationData.additionalResources || [],
        localizedBy: localizerId,
        localizedAt: new Date()
      };

      if (existingLocalContent) {
        return await this.prisma.localContent.update({
          where: { id: existingLocalContent.id },
          data: {
            language: localizationData.targetLanguage,
            isCustomized: true,
            customizationData,
            localizedBy: localizerId,
            translationStatus: TranslationStatus.IN_PROGRESS,
            updatedAt: new Date()
          }
        });
      } else {
        return await this.prisma.localContent.create({
          data: {
            nodeId: localizationData.nodeId,
            globalContentId: localizationData.globalContentId,
            title: globalContent.title,
            description: globalContent.description,
            contentType: globalContent.type,
            contentData: globalContent.contentData,
            language: localizationData.targetLanguage,
            isCustomized: true,
            customizationData,
            localizedBy: localizerId,
            translationStatus: TranslationStatus.IN_PROGRESS,
            status: 'draft'
          }
        });
      }
    } catch (error) {
      console.error('خطأ في تخصيص المحتوى:', error);
      throw error;
    }
  }

  // إدارة الترجمة
  async createTranslationRequest(translationData: TranslationRequest) {
    return await this.prisma.translation.create({
      data: {
        localContentId: translationData.localContentId,
        translatorId: translationData.translatorId,
        sourceLanguage: translationData.sourceLanguage,
        targetLanguage: translationData.targetLanguage,
        sourceText: translationData.sourceText,
        translatedText: '', // سيتم ملؤه لاحقاً
        translationType: translationData.translationType,
        status: TranslationStatus.NOT_STARTED,
        quality: {
          priority: translationData.priority
        }
      }
    });
  }

  // تحديث الترجمة
  async updateTranslation(translationId: string, translatedText: string, quality?: any) {
    return await this.prisma.translation.update({
      where: { id: translationId },
      data: {
        translatedText,
        quality: quality || {},
        status: TranslationStatus.REVIEW,
        completedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  // جلب إحصائيات المحتوى
  async getContentStatistics(nodeId?: string) {
    const where = nodeId ? { nodeId } : {};

    const [
      totalGlobalContent,
      totalLocalContent,
      publishedContent,
      pendingTranslations,
      completedTranslations
    ] = await Promise.all([
      this.prisma.globalContent.count({ where: { isPublished: true } }),
      this.prisma.localContent.count({ where }),
      this.prisma.localContent.count({ where: { ...where, status: 'published' } }),
      this.prisma.translation.count({ where: { status: TranslationStatus.IN_PROGRESS } }),
      this.prisma.translation.count({ where: { status: TranslationStatus.COMPLETED } })
    ]);

    return {
      totalGlobalContent,
      totalLocalContent,
      publishedContent,
      pendingTranslations,
      completedTranslations,
      localizationRate: totalGlobalContent > 0 ? (totalLocalContent / totalGlobalContent) * 100 : 0
    };
  }
}

// تصدير مثيل واحد من الخدمة
export const contentDistributionService = new ContentDistributionService();
