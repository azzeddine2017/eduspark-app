import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { globalPlatformService } from '@/lib/distributed-platform';
import { RevenueType } from '@prisma/client';
import { z } from 'zod';

// Schema for recording revenue
const recordRevenueSchema = z.object({
  type: z.nativeEnum(RevenueType),
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  currency: z.string().min(1, 'العملة مطلوبة'),
  date: z.string().transform((str) => new Date(str)),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

// GET /api/admin/nodes/[id]/revenue - Get node revenue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }

    // Get query parameters
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const type = url.searchParams.get('type') as RevenueType;

    // Check if node exists
    const node = await globalPlatformService.getNode(id);
    if (!node) {
      return NextResponse.json(
        { success: false, error: 'العقدة غير موجودة' },
        { status: 404 }
      );
    }

    // Build where clause
    const where: any = { nodeId: id };
    
    if (startDate && endDate) {
      where.transactionDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    if (type) {
      where.revenueType = type;
    }

    // Get revenues
    const revenues = await globalPlatformService.prisma.nodeRevenue.findMany({
      where,
      orderBy: { transactionDate: 'desc' },
      take: 100 // Limit to last 100 records
    });

    // Calculate totals
    const totalAmount = revenues.reduce((sum, r) => sum + Number(r.amount), 0);
    const totalPlatformFee = revenues.reduce((sum, r) => sum + Number(r.platformFee), 0);
    const totalNetAmount = revenues.reduce((sum, r) => sum + Number(r.netAmount), 0);

    // Group by revenue type
    const revenueByType = revenues.reduce((acc, revenue) => {
      const type = revenue.revenueType;
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          totalAmount: 0,
          totalNetAmount: 0
        };
      }
      acc[type].count++;
      acc[type].totalAmount += Number(revenue.amount);
      acc[type].totalNetAmount += Number(revenue.netAmount);
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      data: {
        revenues,
        summary: {
          totalRecords: revenues.length,
          totalAmount,
          totalPlatformFee,
          totalNetAmount,
          revenueByType
        }
      },
      message: 'تم جلب بيانات الإيرادات بنجاح'
    });

  } catch (error: any) {
    console.error('Error fetching node revenue:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب بيانات الإيرادات' },
      { status: 500 }
    );
  }
}

// POST /api/admin/nodes/[id]/revenue - Record new revenue
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = recordRevenueSchema.parse(body);

    // Check if node exists
    const node = await globalPlatformService.getNode(id);
    if (!node) {
      return NextResponse.json(
        { success: false, error: 'العقدة غير موجودة' },
        { status: 404 }
      );
    }

    // Record the revenue
    const revenue = await globalPlatformService.recordNodeRevenue(id, validatedData);
    
    return NextResponse.json({
      success: true,
      data: revenue,
      message: 'تم تسجيل الإيراد بنجاح'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error recording revenue:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تسجيل الإيراد' },
      { status: 500 }
    );
  }
}
