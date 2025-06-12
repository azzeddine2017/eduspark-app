import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/lib/payment/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // قراءة البيانات الخام
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('لا يوجد توقيع Stripe في الطلب');
      return NextResponse.json(
        { error: 'لا يوجد توقيع' },
        { status: 400 }
      );
    }

    // التحقق من صحة webhook
    let event;
    try {
      event = stripeService.verifyWebhookSignature(body, signature);
    } catch (error) {
      console.error('خطأ في التحقق من توقيع Stripe:', error);
      return NextResponse.json(
        { error: 'توقيع غير صحيح' },
        { status: 400 }
      );
    }

    console.log(`تم استلام حدث Stripe: ${event.type}`);

    // معالجة الأحداث المختلفة
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'customer.subscription.trial_will_end':
        await handleSubscriptionTrialWillEnd(event.data.object);
        break;

      default:
        console.log(`حدث Stripe غير معالج: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('خطأ في معالجة webhook Stripe:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// معالجة نجاح الدفع
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log(`نجح الدفع: ${paymentIntent.id}`);

    // إرسال إشعار للمستخدم
    await sendPaymentSuccessNotification(paymentIntent);

  } catch (error) {
    console.error('خطأ في معالجة نجاح الدفع:', error);
  }
}

// معالجة فشل الدفع
async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    console.log(`فشل الدفع: ${paymentIntent.id}`);

    // إرسال إشعار للمستخدم
    await sendPaymentFailureNotification(paymentIntent);

  } catch (error) {
    console.error('خطأ في معالجة فشل الدفع:', error);
  }
}

// معالجة نجاح دفع الفاتورة (للاشتراكات)
async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    console.log(`نجح دفع الفاتورة: ${invoice.id}`);

    if (invoice.subscription) {
      // تحديث حالة الاشتراك
      await prisma.subscription.update({
        where: { id: invoice.subscription },
        data: {
          status: 'ACTIVE',
          endDate: new Date(invoice.period_end * 1000),
          metadata: {
            lastPaymentAt: new Date().toISOString(),
            lastInvoiceId: invoice.id
          }
        }
      });
    }

  } catch (error) {
    console.error('خطأ في معالجة نجاح دفع الفاتورة:', error);
  }
}

// معالجة فشل دفع الفاتورة
async function handleInvoicePaymentFailed(invoice: any) {
  try {
    console.log(`فشل دفع الفاتورة: ${invoice.id}`);

    if (invoice.subscription) {
      // تحديث حالة الاشتراك
      await prisma.subscription.update({
        where: { id: invoice.subscription },
        data: {
          status: 'EXPIRED',
          metadata: {
            lastFailedPaymentAt: new Date().toISOString(),
            failedInvoiceId: invoice.id
          }
        }
      });

      // إرسال إشعار للمستخدم
      await sendSubscriptionPaymentFailureNotification(invoice);
    }

  } catch (error) {
    console.error('خطأ في معالجة فشل دفع الفاتورة:', error);
  }
}

// معالجة إنشاء اشتراك
async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log(`تم إنشاء اشتراك: ${subscription.id}`);

    // التحقق من وجود الاشتراك في قاعدة البيانات
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: subscription.id }
    });

    if (!existingSubscription) {
      // إنشاء سجل الاشتراك إذا لم يكن موجوداً
      const userId = await getUserIdFromCustomer(subscription.customer);

      await prisma.subscription.create({
        data: {
          id: subscription.id,
          userId,
          planId: subscription.items.data[0]?.price?.id || 'stripe-plan',
          planName: 'Stripe Subscription',
          provider: 'stripe',
          status: subscription.status.toUpperCase(),
          amount: subscription.items.data[0]?.price?.unit_amount / 100 || 0,
          currency: subscription.currency.toUpperCase(),
          createdAt: new Date(subscription.created * 1000),
          endDate: new Date(subscription.current_period_end * 1000)
        }
      });
    }

  } catch (error) {
    console.error('خطأ في معالجة إنشاء الاشتراك:', error);
  }
}

// معالجة تحديث الاشتراك
async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log(`تم تحديث اشتراك: ${subscription.id}`);

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: subscription.status.toUpperCase(),
        endDate: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('خطأ في معالجة تحديث الاشتراك:', error);
  }
}

// معالجة حذف الاشتراك
async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log(`تم حذف اشتراك: ${subscription.id}`);

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: 'حذف من Stripe'
      }
    });

  } catch (error) {
    console.error('خطأ في معالجة حذف الاشتراك:', error);
  }
}

// معالجة انتهاء الفترة التجريبية قريباً
async function handleSubscriptionTrialWillEnd(subscription: any) {
  try {
    console.log(`ستنتهي الفترة التجريبية قريباً: ${subscription.id}`);

    // إرسال إشعار للمستخدم
    await sendTrialEndingNotification(subscription);

  } catch (error) {
    console.error('خطأ في معالجة انتهاء الفترة التجريبية:', error);
  }
}

// دوال مساعدة
async function getUserIdFromCustomer(customerId: string): Promise<string> {
  // بما أن stripeCustomerId غير موجود في النموذج، سنستخدم طريقة بديلة
  // يمكن تحسين هذا لاحقاً بإضافة الحقل إلى النموذج

  // للآن، سنرجع معرف مستخدم افتراضي أو نرمي خطأ
  console.warn(`البحث عن مستخدم بمعرف العميل: ${customerId} - يحتاج تحسين`);

  // يمكن إضافة منطق للبحث بطريقة أخرى هنا
  throw new Error(`لم يتم العثور على مستخدم للعميل: ${customerId} - يحتاج إضافة stripeCustomerId إلى نموذج User`);
}

async function sendPaymentSuccessNotification(paymentIntent: any) {
  // تنفيذ إرسال الإشعار
  console.log(`إرسال إشعار نجاح الدفع للدفع: ${paymentIntent.id}`);
}

async function sendPaymentFailureNotification(paymentIntent: any) {
  // تنفيذ إرسال الإشعار
  console.log(`إرسال إشعار فشل الدفع للدفع: ${paymentIntent.id}`);
}

async function sendSubscriptionPaymentFailureNotification(invoice: any) {
  // تنفيذ إرسال الإشعار
  console.log(`إرسال إشعار فشل دفع الاشتراك للفاتورة: ${invoice.id}`);
}

async function sendTrialEndingNotification(subscription: any) {
  // تنفيذ إرسال الإشعار
  console.log(`إرسال إشعار انتهاء الفترة التجريبية للاشتراك: ${subscription.id}`);
}
