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

        const partnerRecord = await prisma.nodePartner.findFirst({
            where: { userId: session.user.id }
        });

        if (!partnerRecord) {
            return NextResponse.json({ error: 'User is not a partner' }, { status: 403 });
        }

        const nodeId = partnerRecord.nodeId;

        // Fetch revenue history
        const revenueHistory = await prisma.nodeRevenue.findMany({
            where: { nodeId },
            orderBy: { transactionDate: 'desc' },
            take: 50
        });

        return NextResponse.json({ revenueHistory });

    } catch (error) {
        console.error('Error fetching partner revenue:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
