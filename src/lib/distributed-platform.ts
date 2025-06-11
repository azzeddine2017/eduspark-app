import { PrismaClient, NodeStatus, PartnerRole, RevenueType, ContentTier, SubscriptionType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Types for the distributed platform
export interface CreateNodeInput {
  name: string;
  slug: string;
  region: string;
  country: string;
  language?: string;
  currency?: string;
  timezone?: string;
  adminEmail: string;
  adminName: string;
}

export interface NodeStatistics {
  nodeId: string;
  userCount: number;
  revenue: number;
  contentCount: number;
  lastSyncDate: Date;
}

export interface GlobalStatistics {
  totalNodes: number;
  totalUsers: number;
  totalRevenue: number;
  nodeStatistics: NodeStatistics[];
}

export interface RevenueInput {
  type: RevenueType;
  amount: number;
  currency: string;
  date: Date;
  description?: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionInput {
  userId: string;
  subscriptionType: SubscriptionType;
  tier: ContentTier;
  amount: number;
  currency?: string;
  durationMonths: number;
}

export interface ContentAccess {
  userId: string;
  nodeId: string;
  hasFreeTierAccess: boolean;
  hasPremiumAccess: boolean;
  subscriptionLevel: ContentTier;
  expiryDate?: Date;
}

// Global Platform Service - manages the entire distributed network
export class GlobalPlatformService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // Create a new local node
  async createNode(nodeData: CreateNodeInput) {
    try {
      // Check if slug is unique
      const existingNode = await this.prisma.localNode.findUnique({
        where: { slug: nodeData.slug }
      });

      if (existingNode) {
        throw new Error('اسم العقدة مستخدم بالفعل');
      }

      // Create the node
      const node = await this.prisma.localNode.create({
        data: {
          name: nodeData.name,
          slug: nodeData.slug,
          region: nodeData.region,
          country: nodeData.country,
          language: nodeData.language || 'ar',
          currency: nodeData.currency || 'USD',
          timezone: nodeData.timezone || 'UTC',
          apiEndpoint: `https://${nodeData.slug}.fateh-platform.com`,
          settings: {
            platformFeePercentage: 0.20, // 20% default platform fee
            maxUsers: 1000,
            features: ['basic_content', 'ai_assistant', 'analytics']
          }
        }
      });

      // Create admin user for the node if not exists
      let adminUser = await this.prisma.user.findUnique({
        where: { email: nodeData.adminEmail }
      });

      if (!adminUser) {
        adminUser = await this.prisma.user.create({
          data: {
            email: nodeData.adminEmail,
            name: nodeData.adminName,
            role: 'ADMIN',
            isActive: true
          }
        });
      }

      // Create node partnership
      await this.prisma.nodePartner.create({
        data: {
          nodeId: node.id,
          userId: adminUser.id,
          role: PartnerRole.OWNER,
          revenueShare: 80.00, // 80% for the node owner
          status: NodeStatus.ACTIVE,
          contractStartDate: new Date(),
          contractData: {
            type: 'owner_contract',
            terms: 'standard_owner_terms'
          }
        }
      });

      return node;
    } catch (error) {
      console.error('Error creating node:', error);
      throw error;
    }
  }

  // Get all active nodes
  async getAllActiveNodes() {
    return await this.prisma.localNode.findMany({
      where: { status: NodeStatus.ACTIVE },
      include: {
        partners: {
          include: { user: true }
        },
        _count: {
          select: {
            revenues: true,
            localContent: true
          }
        }
      }
    });
  }

  // Get node by ID
  async getNode(nodeId: string) {
    return await this.prisma.localNode.findUnique({
      where: { id: nodeId },
      include: {
        partners: {
          include: { user: true }
        },
        revenues: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        localContent: {
          where: { status: 'published' }
        },
        nodeSettings: true
      }
    });
  }

  // Update node status
  async updateNodeStatus(nodeId: string, status: NodeStatus) {
    return await this.prisma.localNode.update({
      where: { id: nodeId },
      data: { status, updatedAt: new Date() }
    });
  }

  // Distribute global content to nodes
  async distributeContent(contentId: string, targetNodes?: string[]) {
    try {
      // Get the global content (assuming it exists in the courses table)
      const globalContent = await this.prisma.course.findUnique({
        where: { id: contentId },
        include: { lessons: true }
      });

      if (!globalContent) {
        throw new Error('المحتوى العالمي غير موجود');
      }

      const nodes = targetNodes || (await this.getAllActiveNodes()).map(n => n.id);

      for (const nodeId of nodes) {
        // Check if content already exists for this node
        const existingContent = await this.prisma.localContent.findFirst({
          where: {
            nodeId,
            globalContentId: contentId
          }
        });

        if (!existingContent) {
          await this.prisma.localContent.create({
            data: {
              nodeId,
              globalContentId: contentId,
              title: globalContent.title,
              description: globalContent.description,
              contentType: 'course',
              contentData: {
                course: globalContent,
                lessons: globalContent.lessons
              },
              language: 'ar', // Default language
              status: 'published'
            }
          });
        }
      }

      return { success: true, distributedTo: nodes.length };
    } catch (error) {
      console.error('Error distributing content:', error);
      throw error;
    }
  }

  // Collect statistics from all nodes
  async collectGlobalStatistics(): Promise<GlobalStatistics> {
    const nodes = await this.getAllActiveNodes();
    const statistics: GlobalStatistics = {
      totalNodes: nodes.length,
      totalUsers: 0,
      totalRevenue: 0,
      nodeStatistics: []
    };

    for (const node of nodes) {
      const nodeStats = await this.getNodeStatistics(node.id);
      statistics.totalUsers += nodeStats.userCount;
      statistics.totalRevenue += nodeStats.revenue;
      statistics.nodeStatistics.push(nodeStats);
    }

    return statistics;
  }

  // Get statistics for a specific node
  async getNodeStatistics(nodeId: string): Promise<NodeStatistics> {
    const revenues = await this.prisma.nodeRevenue.findMany({
      where: { nodeId }
    });

    const contentCount = await this.prisma.localContent.count({
      where: { nodeId, status: 'published' }
    });

    const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.amount), 0);

    return {
      nodeId,
      userCount: 0, // This would come from the local node's database
      revenue: totalRevenue,
      contentCount,
      lastSyncDate: new Date()
    };
  }

  // Record revenue for a node
  async recordNodeRevenue(nodeId: string, revenueData: RevenueInput) {
    const platformFee = this.calculatePlatformFee(revenueData.amount, nodeId);
    const netAmount = revenueData.amount - platformFee;

    return await this.prisma.nodeRevenue.create({
      data: {
        nodeId,
        revenueType: revenueData.type,
        amount: revenueData.amount,
        currency: revenueData.currency,
        platformFee,
        netAmount,
        transactionDate: revenueData.date,
        description: revenueData.description,
        metadata: revenueData.metadata || {}
      }
    });
  }

  // Calculate platform fee for a node
  private calculatePlatformFee(amount: number, nodeId: string): number {
    // Default 20% platform fee - could be customized per node
    return amount * 0.20;
  }

  // Add partner to a node
  async addNodePartner(nodeId: string, userId: string, role: PartnerRole, revenueShare: number) {
    return await this.prisma.nodePartner.create({
      data: {
        nodeId,
        userId,
        role,
        revenueShare,
        status: NodeStatus.PENDING,
        contractStartDate: new Date()
      }
    });
  }

  // Update partner status
  async updatePartnerStatus(partnerId: string, status: NodeStatus) {
    return await this.prisma.nodePartner.update({
      where: { id: partnerId },
      data: { status, updatedAt: new Date() }
    });
  }

  // Get node settings
  async getNodeSettings(nodeId: string) {
    const settings = await this.prisma.nodeSetting.findMany({
      where: { nodeId }
    });

    return settings.reduce((acc, setting) => {
      acc[setting.settingKey] = this.parseSettingValue(setting.settingValue, setting.settingType);
      return acc;
    }, {} as Record<string, any>);
  }

  // Update node setting
  async updateNodeSetting(nodeId: string, key: string, value: any, type: string = 'string') {
    return await this.prisma.nodeSetting.upsert({
      where: {
        nodeId_settingKey: { nodeId, settingKey: key }
      },
      update: {
        settingValue: JSON.stringify(value),
        settingType: type,
        updatedAt: new Date()
      },
      create: {
        nodeId,
        settingKey: key,
        settingValue: JSON.stringify(value),
        settingType: type
      }
    });
  }

  // Parse setting value based on type
  private parseSettingValue(value: string, type: string): any {
    switch (type) {
      case 'number':
        return Number(value);
      case 'boolean':
        return value === 'true';
      case 'json':
        return JSON.parse(value);
      default:
        return value;
    }
  }

  // إدارة الاشتراكات للنموذج المختلط

  // إنشاء اشتراك جديد
  async createSubscription(nodeId: string, subscriptionData: SubscriptionInput) {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + subscriptionData.durationMonths);

    return await this.prisma.nodeSubscription.create({
      data: {
        nodeId,
        userId: subscriptionData.userId,
        subscriptionType: subscriptionData.subscriptionType,
        tier: subscriptionData.tier,
        amount: subscriptionData.amount,
        currency: subscriptionData.currency || 'USD',
        startDate: new Date(),
        endDate,
        isActive: true,
        autoRenew: true
      }
    });
  }

  // التحقق من صلاحية الوصول للمحتوى
  async checkContentAccess(userId: string, nodeId: string, contentTier: ContentTier): Promise<ContentAccess> {
    // الجميع لديه وصول للمحتوى المجاني
    if (contentTier === ContentTier.FREE) {
      return {
        userId,
        nodeId,
        hasFreeTierAccess: true,
        hasPremiumAccess: false,
        subscriptionLevel: ContentTier.FREE
      };
    }

    // التحقق من الاشتراك النشط
    const activeSubscription = await this.prisma.nodeSubscription.findFirst({
      where: {
        userId,
        nodeId,
        isActive: true,
        endDate: {
          gte: new Date()
        }
      }
    });

    if (!activeSubscription) {
      return {
        userId,
        nodeId,
        hasFreeTierAccess: true,
        hasPremiumAccess: false,
        subscriptionLevel: ContentTier.FREE
      };
    }

    // تحديد مستوى الوصول بناءً على الاشتراك
    const hasPremiumAccess =
      (contentTier === ContentTier.PREMIUM && activeSubscription.tier === ContentTier.PREMIUM) ||
      (contentTier === ContentTier.ENTERPRISE && activeSubscription.tier === ContentTier.ENTERPRISE) ||
      (activeSubscription.tier === ContentTier.ENTERPRISE); // Enterprise يشمل كل شيء

    return {
      userId,
      nodeId,
      hasFreeTierAccess: true,
      hasPremiumAccess,
      subscriptionLevel: activeSubscription.tier,
      expiryDate: activeSubscription.endDate
    };
  }

  // تجديد الاشتراك
  async renewSubscription(subscriptionId: string, durationMonths: number) {
    const subscription = await this.prisma.nodeSubscription.findUnique({
      where: { id: subscriptionId }
    });

    if (!subscription) {
      throw new Error('الاشتراك غير موجود');
    }

    const newEndDate = new Date(subscription.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

    return await this.prisma.nodeSubscription.update({
      where: { id: subscriptionId },
      data: {
        endDate: newEndDate,
        isActive: true,
        updatedAt: new Date()
      }
    });
  }

  // إلغاء الاشتراك
  async cancelSubscription(subscriptionId: string) {
    return await this.prisma.nodeSubscription.update({
      where: { id: subscriptionId },
      data: {
        isActive: false,
        autoRenew: false,
        updatedAt: new Date()
      }
    });
  }

  // الحصول على اشتراكات المستخدم
  async getUserSubscriptions(userId: string, nodeId?: string) {
    const where: any = { userId };
    if (nodeId) {
      where.nodeId = nodeId;
    }

    return await this.prisma.nodeSubscription.findMany({
      where,
      include: {
        node: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // إحصائيات الاشتراكات للعقدة
  async getNodeSubscriptionStats(nodeId: string) {
    const subscriptions = await this.prisma.nodeSubscription.findMany({
      where: { nodeId, isActive: true }
    });

    const totalSubscribers = subscriptions.length;
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + Number(sub.amount), 0);

    const tierDistribution = subscriptions.reduce((acc, sub) => {
      acc[sub.tier] = (acc[sub.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeDistribution = subscriptions.reduce((acc, sub) => {
      acc[sub.subscriptionType] = (acc[sub.subscriptionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSubscribers,
      totalRevenue,
      tierDistribution,
      typeDistribution,
      averageRevenuePerUser: totalSubscribers > 0 ? totalRevenue / totalSubscribers : 0
    };
  }
}

// Export singleton instance
export const globalPlatformService = new GlobalPlatformService();
