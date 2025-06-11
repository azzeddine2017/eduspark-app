import { NextRequest, NextResponse } from 'next/server';
import { paypalService } from '@/lib/payment/paypal';
import { globalPlatformService } from '@/lib/distributed-platform';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // قراءة البيانات الخام
    const body = await request.text();
    const headersList = headers();
    
    // التحقق من صحة webhook (مبسط - يجب تحسينه للإنتاج)
    const isValid = await paypalService.verifyWebhook(
      Object.fromEntries(headersList.entries()),
      body
    );

    if (!isValid) {
      console.error('فشل التحقق من webhook PayPal');
      return NextResponse.json(
        { error: 'webhook غير صحيح' },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    console.log(`تم استلام حدث PayPal: ${event.event_type}`);

    // معالجة الأحداث المختلفة
    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        await handleOrderApproved(event);
        break;

      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCaptureCompleted(event);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentCaptureDenied(event);
        break;

      case 'BILLING.SUBSCRIPTION.CREATED':
        await handleSubscriptionCreated(event);
        break;

      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(event);
        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(event);
        break;

      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        await handleSubscriptionSuspended(event);
        break;

      case 'PAYMENT.SALE.COMPLETED':
        await handleSaleCompleted(event);
        break;

      case 'PAYMENT.SALE.DENIED':
        await handleSaleDenied(event);
        break;

      default:
        console.log(`حدث PayPal غير معالج: ${event.event_type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('خطأ في معالجة webhook PayPal:', error);
    return NextResponse.json(
      { error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}

// معالجة موافقة الطلب
async function handleOrderApproved(event: any) {
  try {
    const orderId = event.resource.id;
    console.log(`تمت الموافقة على الطلب: ${orderId}`);

    // تحديث حالة الدفع
    await globalPlatformService.prisma.payment.update({
      where: { id: orderId },
      data: {
        status: 'approved',
        metadata: {
          paypalOrderId: orderId,
          approvedAt: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('خطأ في معالجة موافقة الطلب:', error);
  }
}

// معالجة اكتمال الدفع
async function handlePaymentCaptureCompleted(event: any) {
  try {
    const capture = event.resource;
    const orderId = capture.supplementary_data?.related_ids?.order_id;
    
    console.log(`اكتمل الدفع: ${capture.id} للطلب: ${orderId}`);

    if (orderId) {
      // تحديث حالة الدفع
      await globalPlatformService.prisma.payment.update({
        where: { id: orderId },
        data: {
          status: 'completed',
          completedAt: new Date(),
          metadata: {
            paypalCaptureId: capture.id,
            paypalOrderId: orderId,
            amount: capture.amount.value,
            currency: capture.amount.currency_code
          }
        }
      });

      // إرسال إشعار نجاح الدفع
      await sendPaymentSuccessNotification(orderId, capture);
    }

  } catch (error) {
    console.error('خطأ في معالجة اكتمال الدفع:', error);
  }
}

// معالجة رفض الدفع
async function handlePaymentCaptureDenied(event: any) {
  try {
    const capture = event.resource;
    const orderId = capture.supplementary_data?.related_ids?.order_id;
    
    console.log(`تم رفض الدفع: ${capture.id} للطلب: ${orderId}`);

    if (orderId) {
      // تحديث حالة الدفع
      await globalPlatformService.prisma.payment.update({
        where: { id: orderId },
        data: {
          status: 'failed',
          failedAt: new Date(),
          failureReason: 'تم رفض الدفع من PayPal',
          metadata: {
            paypalCaptureId: capture.id,
            paypalOrderId: orderId
          }
        }
      });

      // إرسال إشعار فشل الدفع
      await sendPaymentFailureNotification(orderId, capture);
    }

  } catch (error) {
    console.error('خطأ في معالجة رفض الدفع:', error);
  }
}

// معالجة إنشاء الاشتراك
async function handleSubscriptionCreated(event: any) {
  try {
    const subscription = event.resource;
    console.log(`تم إنشاء اشتراك PayPal: ${subscription.id}`);

    // البحث عن المستخدم باستخدام custom_id
    const userId = subscription.custom_id;
    
    if (userId) {
      // التحقق من وجود الاشتراك في قاعدة البيانات
      const existingSubscription = await globalPlatformService.prisma.subscription.findUnique({
        where: { id: subscription.id }
      });

      if (!existingSubscription) {
        // إنشاء سجل الاشتراك
        await globalPlatformService.prisma.subscription.create({
          data: {
            id: subscription.id,
            userId,
            planId: subscription.plan_id,
            provider: 'paypal',
            status: 'pending',
            amount: parseFloat(subscription.billing_info?.last_payment?.amount?.value || '0'),
            currency: subscription.billing_info?.last_payment?.amount?.currency_code || 'USD',
            interval: 'month', // يجب استخراج هذا من plan details
            createdAt: new Date(subscription.create_time),
            metadata: {
              paypalSubscriptionId: subscription.id,
              planId: subscription.plan_id
            }
          }
        });
      }
    }

  } catch (error) {
    console.error('خطأ في معالجة إنشاء الاشتراك:', error);
  }
}

// معالجة تفعيل الاشتراك
async function handleSubscriptionActivated(event: any) {
  try {
    const subscription = event.resource;
    console.log(`تم تفعيل اشتراك PayPal: ${subscription.id}`);

    // تحديث حالة الاشتراك
    await globalPlatformService.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'active',
        activatedAt: new Date(),
        nextBillingDate: subscription.billing_info?.next_billing_time 
          ? new Date(subscription.billing_info.next_billing_time)
          : undefined
      }
    });

    // إرسال إشعار تفعيل الاشتراك
    await sendSubscriptionActivatedNotification(subscription);

  } catch (error) {
    console.error('خطأ في معالجة تفعيل الاشتراك:', error);
  }
}

// معالجة إلغاء الاشتراك
async function handleSubscriptionCancelled(event: any) {
  try {
    const subscription = event.resource;
    console.log(`تم إلغاء اشتراك PayPal: ${subscription.id}`);

    // تحديث حالة الاشتراك
    await globalPlatformService.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: 'إلغاء من PayPal'
      }
    });

    // إرسال إشعار إلغاء الاشتراك
    await sendSubscriptionCancelledNotification(subscription);

  } catch (error) {
    console.error('خطأ في معالجة إلغاء الاشتراك:', error);
  }
}

// معالجة تعليق الاشتراك
async function handleSubscriptionSuspended(event: any) {
  try {
    const subscription = event.resource;
    console.log(`تم تعليق اشتراك PayPal: ${subscription.id}`);

    // تحديث حالة الاشتراك
    await globalPlatformService.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'suspended',
        suspendedAt: new Date()
      }
    });

    // إرسال إشعار تعليق الاشتراك
    await sendSubscriptionSuspendedNotification(subscription);

  } catch (error) {
    console.error('خطأ في معالجة تعليق الاشتراك:', error);
  }
}

// معالجة اكتمال البيع (للاشتراكات)
async function handleSaleCompleted(event: any) {
  try {
    const sale = event.resource;
    console.log(`اكتمل البيع: ${sale.id}`);

    // البحث عن الاشتراك المرتبط
    const subscriptionId = sale.billing_agreement_id;
    
    if (subscriptionId) {
      // تحديث آخر دفعة للاشتراك
      await globalPlatformService.prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          lastPaymentAt: new Date(),
          status: 'active'
        }
      });

      // إنشاء سجل دفع للبيع
      const userId = await getUserIdFromSubscription(subscriptionId);
      
      if (userId) {
        await globalPlatformService.prisma.payment.create({
          data: {
            id: `sale_${sale.id}`,
            userId,
            amount: parseFloat(sale.amount.total),
            currency: sale.amount.currency,
            provider: 'paypal',
            status: 'completed',
            description: `دفع اشتراك PayPal ${subscriptionId}`,
            metadata: {
              paypalSaleId: sale.id,
              subscriptionId,
              billingAgreementId: sale.billing_agreement_id
            },
            completedAt: new Date()
          }
        });
      }
    }

  } catch (error) {
    console.error('خطأ في معالجة اكتمال البيع:', error);
  }
}

// معالجة رفض البيع
async function handleSaleDenied(event: any) {
  try {
    const sale = event.resource;
    console.log(`تم رفض البيع: ${sale.id}`);

    const subscriptionId = sale.billing_agreement_id;
    
    if (subscriptionId) {
      // تحديث حالة الاشتراك
      await globalPlatformService.prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'past_due',
          lastFailedPaymentAt: new Date()
        }
      });

      // إرسال إشعار فشل الدفع
      await sendSubscriptionPaymentFailureNotification(subscriptionId, sale);
    }

  } catch (error) {
    console.error('خطأ في معالجة رفض البيع:', error);
  }
}

// دوال مساعدة
async function getUserIdFromSubscription(subscriptionId: string): Promise<string | null> {
  const subscription = await globalPlatformService.prisma.subscription.findUnique({
    where: { id: subscriptionId }
  });
  
  return subscription?.userId || null;
}

async function sendPaymentSuccessNotification(orderId: string, capture: any) {
  console.log(`إرسال إشعار نجاح الدفع للطلب: ${orderId}`);
}

async function sendPaymentFailureNotification(orderId: string, capture: any) {
  console.log(`إرسال إشعار فشل الدفع للطلب: ${orderId}`);
}

async function sendSubscriptionActivatedNotification(subscription: any) {
  console.log(`إرسال إشعار تفعيل الاشتراك: ${subscription.id}`);
}

async function sendSubscriptionCancelledNotification(subscription: any) {
  console.log(`إرسال إشعار إلغاء الاشتراك: ${subscription.id}`);
}

async function sendSubscriptionSuspendedNotification(subscription: any) {
  console.log(`إرسال إشعار تعليق الاشتراك: ${subscription.id}`);
}

async function sendSubscriptionPaymentFailureNotification(subscriptionId: string, sale: any) {
  console.log(`إرسال إشعار فشل دفع الاشتراك: ${subscriptionId}`);
}
