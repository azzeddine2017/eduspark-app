import Stripe from 'stripe';

// إعداد Stripe - فقط إذا كان المفتاح متوفر
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
}) : null;

// أنواع البيانات
export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  customerId?: string;
  metadata?: Record<string, string>;
  description?: string;
}

export interface CreateSubscriptionParams {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
  trialPeriodDays?: number;
}

export interface CreateCustomerParams {
  email: string;
  name?: string;
  metadata?: Record<string, string>;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

// خدمة Stripe
export class StripeService {
  private stripe: Stripe;

  constructor() {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    this.stripe = stripe;
  }

  // إنشاء عميل جديد
  async createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email: params.email,
        name: params.name,
        metadata: params.metadata || {},
      });

      return customer;
    } catch (error) {
      console.error('خطأ في إنشاء عميل Stripe:', error);
      throw new Error('فشل في إنشاء حساب العميل');
    }
  }

  // جلب معلومات العميل
  async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return customer as Stripe.Customer;
    } catch (error) {
      console.error('خطأ في جلب معلومات العميل:', error);
      return null;
    }
  }

  // إنشاء Payment Intent للدفع الفوري
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(params.amount * 100), // تحويل إلى سنت
        currency: params.currency.toLowerCase(),
        customer: params.customerId,
        metadata: params.metadata || {},
        description: params.description,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('خطأ في إنشاء Payment Intent:', error);
      throw new Error('فشل في إنشاء عملية الدفع');
    }
  }

  // إنشاء اشتراك
  async createSubscription(params: CreateSubscriptionParams): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: params.customerId,
        items: [
          {
            price: params.priceId,
          },
        ],
        metadata: params.metadata || {},
        trial_period_days: params.trialPeriodDays,
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      return subscription;
    } catch (error) {
      console.error('خطأ في إنشاء الاشتراك:', error);
      throw new Error('فشل في إنشاء الاشتراك');
    }
  }

  // إلغاء الاشتراك
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('خطأ في إلغاء الاشتراك:', error);
      throw new Error('فشل في إلغاء الاشتراك');
    }
  }

  // تحديث الاشتراك
  async updateSubscription(
    subscriptionId: string, 
    params: Partial<Stripe.SubscriptionUpdateParams>
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, params);
      return subscription;
    } catch (error) {
      console.error('خطأ في تحديث الاشتراك:', error);
      throw new Error('فشل في تحديث الاشتراك');
    }
  }

  // جلب معلومات الاشتراك
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('خطأ في جلب معلومات الاشتراك:', error);
      return null;
    }
  }

  // جلب جميع اشتراكات العميل
  async getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
      });
      return subscriptions.data;
    } catch (error) {
      console.error('خطأ في جلب اشتراكات العميل:', error);
      return [];
    }
  }

  // إنشاء Setup Intent لحفظ طريقة الدفع
  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        usage: 'off_session',
      });

      return setupIntent;
    } catch (error) {
      console.error('خطأ في إنشاء Setup Intent:', error);
      throw new Error('فشل في إعداد طريقة الدفع');
    }
  }

  // جلب طرق الدفع للعميل
  async getCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data;
    } catch (error) {
      console.error('خطأ في جلب طرق الدفع:', error);
      return [];
    }
  }

  // حذف طريقة دفع
  async detachPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.detach(paymentMethodId);
      return paymentMethod;
    } catch (error) {
      console.error('خطأ في حذف طريقة الدفع:', error);
      throw new Error('فشل في حذف طريقة الدفع');
    }
  }

  // إنشاء فاتورة
  async createInvoice(customerId: string, items: Stripe.InvoiceItemCreateParams[]): Promise<Stripe.Invoice> {
    try {
      // إنشاء عناصر الفاتورة
      for (const item of items) {
        const { customer, ...itemData } = item;
        await this.stripe.invoiceItems.create({
          customer: customerId,
          ...itemData,
        });
      }

      // إنشاء الفاتورة
      const invoice = await this.stripe.invoices.create({
        customer: customerId,
        auto_advance: true,
      });

      return invoice;
    } catch (error) {
      console.error('خطأ في إنشاء الفاتورة:', error);
      throw new Error('فشل في إنشاء الفاتورة');
    }
  }

  // إرسال الفاتورة
  async sendInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      const invoice = await this.stripe.invoices.sendInvoice(invoiceId);
      return invoice;
    } catch (error) {
      console.error('خطأ في إرسال الفاتورة:', error);
      throw new Error('فشل في إرسال الفاتورة');
    }
  }

  // التحقق من صحة webhook
  verifyWebhookSignature(payload: string, signature: string): WebhookEvent {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      return event as WebhookEvent;
    } catch (error) {
      console.error('خطأ في التحقق من webhook:', error);
      throw new Error('فشل في التحقق من صحة الطلب');
    }
  }

  // جلب الأسعار المتاحة
  async getPrices(): Promise<Stripe.Price[]> {
    try {
      const prices = await this.stripe.prices.list({
        active: true,
        expand: ['data.product'],
      });
      return prices.data;
    } catch (error) {
      console.error('خطأ في جلب الأسعار:', error);
      return [];
    }
  }

  // إنشاء رابط دفع
  async createPaymentLink(params: {
    priceId: string;
    quantity?: number;
    metadata?: Record<string, string>;
  }): Promise<Stripe.PaymentLink> {
    try {
      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [
          {
            price: params.priceId,
            quantity: params.quantity || 1,
          },
        ],
        metadata: params.metadata || {},
      });

      return paymentLink;
    } catch (error) {
      console.error('خطأ في إنشاء رابط الدفع:', error);
      throw new Error('فشل في إنشاء رابط الدفع');
    }
  }
}

// إنشاء مثيل واحد من الخدمة
export const stripeService = new StripeService();
