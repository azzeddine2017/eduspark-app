import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { globalPlatformService } from '@/lib/distributed-platform';
import { NodeStatus } from '@prisma/client';
import { z } from 'zod';

// Schema for updating a node
const updateNodeSchema = z.object({
  name: z.string().min(1, 'اسم العقدة مطلوب').optional(),
  region: z.string().min(1, 'المنطقة مطلوبة').optional(),
  country: z.string().min(1, 'البلد مطلوب').optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  status: z.nativeEnum(NodeStatus).optional()
});

// GET /api/admin/nodes/[id] - Get specific node
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

    const node = await globalPlatformService.getNode(id);
    
    if (!node) {
      return NextResponse.json(
        { success: false, error: 'العقدة غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: node,
      message: 'تم جلب بيانات العقدة بنجاح'
    });

  } catch (error: any) {
    console.error('Error fetching node:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب بيانات العقدة' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/nodes/[id] - Update specific node
export async function PUT(
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
    const validatedData = updateNodeSchema.parse(body);

    // Check if node exists
    const existingNode = await globalPlatformService.getNode(id);
    if (!existingNode) {
      return NextResponse.json(
        { success: false, error: 'العقدة غير موجودة' },
        { status: 404 }
      );
    }

    // Update node status if provided
    if (validatedData.status) {
      await globalPlatformService.updateNodeStatus(id, validatedData.status);
    }

    // Update other settings if provided
    if (Object.keys(validatedData).length > 0) {
      for (const [key, value] of Object.entries(validatedData)) {
        if (key !== 'status' && value !== undefined) {
          await globalPlatformService.updateNodeSetting(id, key, value);
        }
      }
    }

    // Get updated node
    const updatedNode = await globalPlatformService.getNode(id);
    
    return NextResponse.json({
      success: true,
      data: updatedNode,
      message: 'تم تحديث العقدة بنجاح'
    });

  } catch (error: any) {
    console.error('Error updating node:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تحديث العقدة' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/nodes/[id] - Delete specific node
export async function DELETE(
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

    // Check if node exists
    const existingNode = await globalPlatformService.getNode(id);
    if (!existingNode) {
      return NextResponse.json(
        { success: false, error: 'العقدة غير موجودة' },
        { status: 404 }
      );
    }

    // Instead of deleting, suspend the node for safety
    await globalPlatformService.updateNodeStatus(id, NodeStatus.SUSPENDED);
    
    return NextResponse.json({
      success: true,
      message: 'تم تعليق العقدة بنجاح'
    });

  } catch (error: any) {
    console.error('Error suspending node:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تعليق العقدة' },
      { status: 500 }
    );
  }
}
