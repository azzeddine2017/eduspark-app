import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a partner
    const partnerRecord = await prisma.nodePartner.findFirst({
      where: { userId: session.user.id },
      include: { node: true }
    });

    if (!partnerRecord) {
      return NextResponse.json({ error: 'User is not a partner' }, { status: 403 });
    }

    const nodeId = partnerRecord.nodeId;

    // Fetch stats
    const [
      totalStudents,
      totalRevenue,
      activeCourses,
      nodeDetails
    ] = await Promise.all([
      prisma.nodeSubscription.count({
        where: { nodeId, isActive: true }
      }),
      prisma.nodeRevenue.aggregate({
        where: { nodeId },
        _sum: { netAmount: true }
      }),
      prisma.localContent.count({
        where: { nodeId, contentType: 'course', status: 'published' }
      }),
      prisma.localNode.findUnique({
        where: { id: nodeId }
      })
    ]);

    return NextResponse.json({
      nodeName: nodeDetails?.name,
      region: nodeDetails?.region,
      totalStudents,
      totalRevenue: totalRevenue._sum.netAmount || 0,
      activeCourses,
      currency: nodeDetails?.currency || 'USD'
    });

  } catch (error) {
    console.error('Error fetching partner stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
