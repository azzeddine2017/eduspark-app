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
            where: { userId: session.user.id },
            include: { node: true }
        });

        if (!partnerRecord) {
            return NextResponse.json({ error: 'User is not a partner' }, { status: 403 });
        }

        // Only OWNER or MANAGER can view settings
        if (!['OWNER', 'MANAGER'].includes(partnerRecord.role)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const nodeId = partnerRecord.nodeId;

        const settings = await prisma.nodeSetting.findMany({
            where: { nodeId }
        });

        return NextResponse.json({
            node: partnerRecord.node,
            settings
        });

    } catch (error) {
        console.error('Error fetching partner settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
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

        // Only OWNER or MANAGER can update settings
        if (!['OWNER', 'MANAGER'].includes(partnerRecord.role)) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        const nodeId = partnerRecord.nodeId;
        const body = await request.json();
        const { settings } = body; // Expecting array of { key, value }

        if (!Array.isArray(settings)) {
            return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 });
        }

        // Update settings transactionally
        await prisma.$transaction(
            settings.map((setting: any) =>
                prisma.nodeSetting.upsert({
                    where: {
                        nodeId_settingKey: {
                            nodeId,
                            settingKey: setting.key
                        }
                    },
                    update: { settingValue: setting.value },
                    create: {
                        nodeId,
                        settingKey: setting.key,
                        settingValue: setting.value
                    }
                })
            )
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating partner settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
