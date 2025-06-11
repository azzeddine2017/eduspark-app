import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { paymentService, PaymentProvider } from '@/lib/payment/payment-service';
import { z } from 'zod';

// مخطط التحقق من البيانات
const createPaymentSchema = z.object({
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  currency: z.string().length(3, 'رمز العملة يجب أن يكون 3 أحرف'),
  provider: z.enum(['stripe', 'paypal', 'local'], {
    errorMap: () => ({ message: 'بوابة دفع غير صحيحة' })
  }),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    // قراءة وتحليل البيانات
    const body = await request.json();
    const validationResult = createPaymentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'بيانات غير صحيحة',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { amount, currency, provider, description, metadata } = validationResult.data;

    // إنشاء عملية الدفع
    const paymentIntent = await paymentService.createPayment({
      amount,
      currency,
      provider: provider as PaymentProvider,
      userId: session.user.id,
      description,
      metadata
    });

    return NextResponse.json({
      success: true,
      data: paymentIntent
    });

  } catch (error) {
    console.error('خطأ في إنشاء عملية الدفع:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'خطأ في الخادم' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // التحقق من المصادقة
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح بالوصول' },
        { status: 401 }
      );
    }

    // جلب خطط الاشتراك المتاحة
    const plans = await paymentService.getSubscriptionPlans();

    return NextResponse.json({
      success: true,
      data: {
        plans,
        supportedProviders: ['stripe', 'paypal', 'local'],
        supportedCurrencies: ['USD', 'SAR', 'AED', 'EUR']
      }
    });

  } catch (error) {
    console.error('خطأ في جلب معلومات الدفع:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في الخادم' 
      },
      { status: 500 }
    );
  }
}
