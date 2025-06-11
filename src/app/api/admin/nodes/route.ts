import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { globalPlatformService } from '@/lib/distributed-platform';
import { z } from 'zod';

// Schema for creating a new node
const createNodeSchema = z.object({
  name: z.string().min(1, 'اسم العقدة مطلوب'),
  slug: z.string().min(1, 'معرف العقدة مطلوب').regex(/^[a-z0-9-]+$/, 'معرف العقدة يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط'),
  region: z.string().min(1, 'المنطقة مطلوبة'),
  country: z.string().min(1, 'البلد مطلوب'),
  language: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  adminEmail: z.string().email('البريد الإلكتروني غير صحيح'),
  adminName: z.string().min(1, 'اسم المدير مطلوب')
});

// GET /api/admin/nodes - Get all nodes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }

    const nodes = await globalPlatformService.getAllActiveNodes();
    
    return NextResponse.json({
      success: true,
      data: nodes,
      message: 'تم جلب العقد بنجاح'
    });

  } catch (error: any) {
    console.error('Error fetching nodes:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب العقد' },
      { status: 500 }
    );
  }
}

// POST /api/admin/nodes - Create a new node
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = createNodeSchema.parse(body);

    const node = await globalPlatformService.createNode(validatedData);
    
    return NextResponse.json({
      success: true,
      data: node,
      message: 'تم إنشاء العقدة المحلية بنجاح'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating node:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء إنشاء العقدة' },
      { status: 500 }
    );
  }
}
