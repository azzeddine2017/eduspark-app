import { prisma } from '../prisma';

// أنواع البيانات
export type PaymentProvider = 'stripe' | 'paypal' | 'local';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
  approvalUrl?: string;
  provider: PaymentProvider;
  metadata?: Record<string, any>;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  provider: PaymentProvider;
  providerPlanId: string;
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  provider: PaymentProvider;
  userId: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreateSubscriptionParams {
  planId: string;
  userId: string;
  provider: PaymentProvider;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  subscriptionId?: string;
  error?: string;
  redirectUrl?: string;
}

// خدمة الدفع الموحدة
export class PaymentService {
  // إنشاء عملية دفع
  async createPayment(params: CreatePaymentParams): Promise<PaymentIntent> {
    try {
      // جلب معلومات المستخدم
      const user = await prisma.user.findUnique({
        where: { id: params.userId }
      });

      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      let paymentIntent: PaymentIntent;

      switch (params.provider) {
        case 'stripe':
          try {
            paymentIntent = await this.createStripePayment(params, user);
          } catch (error) {
            console.warn('Stripe not configured, falling back to local payment');
            paymentIntent = await this.createLocalPayment(params, user);
          }
          break;
        case 'paypal':
          try {
            paymentIntent = await this.createPayPalPayment(params, user);
          } catch (error) {
            console.warn('PayPal not configured, falling back to local payment');
            paymentIntent = await this.createLocalPayment(params, user);
          }
          break;
        case 'local':
          paymentIntent = await this.createLocalPayment(params, user);
          break;
        default:
          throw new Error('بوابة دفع غير مدعومة');
      }

      // حفظ عملية الدفع في قاعدة البيانات (معطل مؤقتاً - نموذج Payment غير موجود)
      await this.savePaymentRecord(paymentIntent, params);

      return paymentIntent;
    } catch (error) {
      console.error('خطأ في إنشاء عملية الدفع:', error);
      throw error;
    }
  }

  // إنشاء دفع Stripe
  private async createStripePayment(params: CreatePaymentParams, user: any): Promise<PaymentIntent> {
    // استيراد Stripe service عند الحاجة
    const { stripeService } = await import('./stripe');

    // إنشاء أو جلب عميل Stripe
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripeService.createCustomer({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id }
      });
      customerId = customer.id;

      // حفظ معرف العميل (معطل مؤقتاً - حقل stripeCustomerId غير موجود في نموذج User)
      // await prisma.user.update({
      //   where: { id: user.id },
      //   data: { stripeCustomerId: customerId }
      // });
      console.log('Stripe customer ID would be saved:', { userId: user.id, customerId });
    }

    const stripeIntent = await stripeService.createPaymentIntent({
      amount: params.amount,
      currency: params.currency,
      customerId,
      description: params.description,
      metadata: params.metadata
    });

    return {
      id: stripeIntent.id,
      amount: params.amount,
      currency: params.currency,
      status: stripeIntent.status,
      clientSecret: stripeIntent.client_secret || undefined,
      provider: 'stripe',
      metadata: params.metadata
    };
  }

  // إنشاء دفع PayPal
  private async createPayPalPayment(params: CreatePaymentParams, user: any): Promise<PaymentIntent> {
    // استيراد PayPal service عند الحاجة
    const { paypalService } = await import('./paypal');

    const paypalOrder = await paypalService.createOrder({
      amount: params.amount.toString(),
      currency: params.currency,
      description: params.description,
      customId: user.id,
      metadata: params.metadata
    });

    const approvalUrl = paypalOrder.links.find((link: any) => link.rel === 'approve')?.href;

    return {
      id: paypalOrder.id,
      amount: params.amount,
      currency: params.currency,
      status: paypalOrder.status,
      approvalUrl,
      provider: 'paypal',
      metadata: params.metadata
    };
  }

  // إنشاء دفع محلي (للبوابات المحلية)
  private async createLocalPayment(params: CreatePaymentParams, user: any): Promise<PaymentIntent> {
    // تنفيذ الدفع المحلي (مثل مدى، STC Pay، إلخ)
    // هذا مثال بسيط - يجب تخصيصه حسب البوابة المحلية
    
    const paymentId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    
    return {
      id: paymentId,
      amount: params.amount,
      currency: params.currency,
      status: 'pending',
      provider: 'local',
      metadata: params.metadata,
      approvalUrl: `/payment/local/${paymentId}` // رابط صفحة الدفع المحلية
    };
  }

  // إنشاء اشتراك
  async createSubscription(params: CreateSubscriptionParams): Promise<PaymentResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: params.userId }
      });

      if (!user) {
        throw new Error('المستخدم غير موجود');
      }

      // جلب معلومات الخطة
      const plan = await this.getSubscriptionPlan(params.planId);
      if (!plan) {
        throw new Error('خطة الاشتراك غير موجودة');
      }

      let result: PaymentResult;

      switch (params.provider) {
        case 'stripe':
          result = await this.createStripeSubscription(params, user, plan);
          break;
        case 'paypal':
          result = await this.createPayPalSubscription(params, user, plan);
          break;
        default:
          throw new Error('بوابة دفع غير مدعومة للاشتراكات');
      }

      if (result.success) {
        // حفظ الاشتراك في قاعدة البيانات
        await this.saveSubscriptionRecord(result, params, plan);
      }

      return result;
    } catch (error) {
      console.error('خطأ في إنشاء الاشتراك:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }

  // إنشاء اشتراك Stripe
  private async createStripeSubscription(
    params: CreateSubscriptionParams,
    user: any,
    plan: SubscriptionPlan
  ): Promise<PaymentResult> {
    // استيراد Stripe service عند الحاجة
    const { stripeService } = await import('./stripe');

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripeService.createCustomer({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id }
      });
      customerId = customer.id;

      // await prisma.user.update({
      //   where: { id: user.id },
      //   data: { stripeCustomerId: customerId }
      // });
      console.log('Stripe customer ID would be saved:', { userId: user.id, customerId });
    }

    const subscription = await stripeService.createSubscription({
      customerId,
      priceId: plan.providerPlanId,
      metadata: params.metadata
    });

    return {
      success: true,
      subscriptionId: subscription.id,
      redirectUrl: (typeof subscription.latest_invoice === 'object' &&
                   subscription.latest_invoice?.payment_intent &&
                   typeof subscription.latest_invoice.payment_intent === 'object' &&
                   subscription.latest_invoice.payment_intent.client_secret)
        ? `/payment/stripe/confirm?client_secret=${subscription.latest_invoice.payment_intent.client_secret}`
        : undefined
    };
  }

  // إنشاء اشتراك PayPal
  private async createPayPalSubscription(
    params: CreateSubscriptionParams,
    user: any,
    plan: SubscriptionPlan
  ): Promise<PaymentResult> {
    // استيراد PayPal service عند الحاجة
    const { paypalService } = await import('./paypal');

    const subscription = await paypalService.createSubscription({
      planId: plan.providerPlanId,
      customId: user.id,
      metadata: params.metadata
    });

    const approvalUrl = subscription.links.find((link: any) => link.rel === 'approve')?.href;

    return {
      success: true,
      subscriptionId: subscription.id,
      redirectUrl: approvalUrl
    };
  }

  // جلب خطط الاشتراك
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      // يمكن جلبها من قاعدة البيانات أو تعريفها هنا
      return [
        {
          id: 'basic',
          name: 'الباقة الأساسية',
          description: 'وصول محدود للمحتوى التعليمي',
          amount: 29,
          currency: 'USD',
          interval: 'month',
          features: [
            'وصول لـ 10 دورات',
            'دعم عبر البريد الإلكتروني',
            'شهادات إتمام'
          ],
          provider: 'stripe',
          providerPlanId: process.env.STRIPE_BASIC_PLAN_ID!
        },
        {
          id: 'premium',
          name: 'الباقة المميزة',
          description: 'وصول كامل لجميع المحتويات',
          amount: 99,
          currency: 'USD',
          interval: 'month',
          features: [
            'وصول لجميع الدورات',
            'مساعد ذكي متقدم',
            'دعم مباشر',
            'شهادات معتمدة',
            'محتوى حصري'
          ],
          provider: 'stripe',
          providerPlanId: process.env.STRIPE_PREMIUM_PLAN_ID!
        }
      ];
    } catch (error) {
      console.error('خطأ في جلب خطط الاشتراك:', error);
      return [];
    }
  }

  // جلب خطة اشتراك محددة
  async getSubscriptionPlan(planId: string): Promise<SubscriptionPlan | null> {
    const plans = await this.getSubscriptionPlans();
    return plans.find(plan => plan.id === planId) || null;
  }

  // حفظ سجل الدفع (معطل مؤقتاً - نموذج Payment غير موجود)
  private async savePaymentRecord(paymentIntent: PaymentIntent, params: CreatePaymentParams): Promise<void> {
    // await prisma.payment.create({
    //   data: {
    //     id: paymentIntent.id,
    //     userId: params.userId,
    //     amount: paymentIntent.amount,
    //     currency: paymentIntent.currency,
    //     provider: paymentIntent.provider,
    //     status: paymentIntent.status,
    //     description: params.description,
    //     metadata: paymentIntent.metadata || {},
    //     createdAt: new Date()
    //   }
    // });
    console.log('Payment record would be saved:', { paymentIntent, params });
  }

  // حفظ سجل الاشتراك
  private async saveSubscriptionRecord(
    result: PaymentResult, 
    params: CreateSubscriptionParams, 
    plan: SubscriptionPlan
  ): Promise<void> {
    if (!result.subscriptionId) return;

    await prisma.subscription.create({
      data: {
        id: result.subscriptionId,
        userId: params.userId,
        planId: params.planId,
        planName: plan.name,
        provider: params.provider,
        status: 'ACTIVE',
        amount: plan.amount,
        currency: plan.currency,
        metadata: params.metadata || {},
        createdAt: new Date(),
        endDate: new Date(Date.now() + (plan.interval === 'month' ? 30 : 365) * 24 * 60 * 60 * 1000)
      }
    });
  }

  // تأكيد الدفع
  async confirmPayment(paymentId: string, provider: PaymentProvider): Promise<PaymentResult> {
    try {
      let result: PaymentResult;

      switch (provider) {
        case 'stripe':
          // Stripe يتم تأكيده تلقائياً عبر webhook
          result = { success: true, paymentId };
          break;
        case 'paypal':
          const { paypalService } = await import('./paypal');
          const captureResult = await paypalService.captureOrder(paymentId);
          result = {
            success: captureResult.status === 'COMPLETED',
            paymentId: captureResult.id
          };
          break;
        default:
          result = { success: false, error: 'بوابة دفع غير مدعومة' };
      }

      if (result.success) {
        // تحديث حالة الدفع في قاعدة البيانات (معطل مؤقتاً - نموذج Payment غير موجود)
        // await prisma.payment.update({
        //   where: { id: paymentId },
        //   data: {
        //     status: 'completed',
        //     completedAt: new Date()
        //   }
        // });
        console.log('Payment would be updated:', { paymentId, status: 'completed' });
      }

      return result;
    } catch (error) {
      console.error('خطأ في تأكيد الدفع:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطأ في تأكيد الدفع'
      };
    }
  }
}

// إنشاء مثيل واحد من الخدمة
export const paymentService = new PaymentService();
