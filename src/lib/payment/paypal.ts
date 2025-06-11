// خدمة PayPal للدفع
export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
}

export interface CreateOrderParams {
  amount: string;
  currency: string;
  description?: string;
  customId?: string;
  metadata?: Record<string, any>;
}

export interface CreateSubscriptionParams {
  planId: string;
  customId?: string;
  metadata?: Record<string, any>;
}

export interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalSubscription {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export class PayPalService {
  private config: PayPalConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      clientId: process.env.PAYPAL_CLIENT_ID!,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
      environment: (process.env.PAYPAL_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
    };

    this.baseUrl = this.config.environment === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  // الحصول على access token
  private async getAccessToken(): Promise<string> {
    // التحقق من صحة التوكن الحالي
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
      
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error(`فشل في الحصول على access token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // تقليل دقيقة للأمان

      return this.accessToken;
    } catch (error) {
      console.error('خطأ في الحصول على PayPal access token:', error);
      throw new Error('فشل في المصادقة مع PayPal');
    }
  }

  // إجراء طلب API
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('PayPal API Error:', errorData);
      throw new Error(`PayPal API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // إنشاء طلب دفع
  async createOrder(params: CreateOrderParams): Promise<PayPalOrder> {
    try {
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: params.currency.toUpperCase(),
              value: params.amount,
            },
            description: params.description,
            custom_id: params.customId,
          },
        ],
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL}/api/payment/paypal/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/api/payment/paypal/cancel`,
          brand_name: 'منصة فتح',
          locale: 'ar-SA',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
        },
      };

      const order = await this.makeRequest('/v2/checkout/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      return order;
    } catch (error) {
      console.error('خطأ في إنشاء طلب PayPal:', error);
      throw new Error('فشل في إنشاء طلب الدفع');
    }
  }

  // تأكيد الدفع
  async captureOrder(orderId: string): Promise<any> {
    try {
      const result = await this.makeRequest(`/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
      });

      return result;
    } catch (error) {
      console.error('خطأ في تأكيد دفع PayPal:', error);
      throw new Error('فشل في تأكيد الدفع');
    }
  }

  // جلب تفاصيل الطلب
  async getOrder(orderId: string): Promise<any> {
    try {
      const order = await this.makeRequest(`/v2/checkout/orders/${orderId}`);
      return order;
    } catch (error) {
      console.error('خطأ في جلب تفاصيل طلب PayPal:', error);
      throw new Error('فشل في جلب تفاصيل الطلب');
    }
  }

  // إنشاء اشتراك
  async createSubscription(params: CreateSubscriptionParams): Promise<PayPalSubscription> {
    try {
      const subscriptionData = {
        plan_id: params.planId,
        custom_id: params.customId,
        application_context: {
          brand_name: 'منصة فتح',
          locale: 'ar-SA',
          return_url: `${process.env.NEXTAUTH_URL}/api/payment/paypal/subscription/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/api/payment/paypal/subscription/cancel`,
        },
      };

      const subscription = await this.makeRequest('/v1/billing/subscriptions', {
        method: 'POST',
        body: JSON.stringify(subscriptionData),
      });

      return subscription;
    } catch (error) {
      console.error('خطأ في إنشاء اشتراك PayPal:', error);
      throw new Error('فشل في إنشاء الاشتراك');
    }
  }

  // إلغاء الاشتراك
  async cancelSubscription(subscriptionId: string, reason: string = 'إلغاء بناءً على طلب المستخدم'): Promise<void> {
    try {
      await this.makeRequest(`/v1/billing/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({
          reason: reason,
        }),
      });
    } catch (error) {
      console.error('خطأ في إلغاء اشتراك PayPal:', error);
      throw new Error('فشل في إلغاء الاشتراك');
    }
  }

  // جلب تفاصيل الاشتراك
  async getSubscription(subscriptionId: string): Promise<any> {
    try {
      const subscription = await this.makeRequest(`/v1/billing/subscriptions/${subscriptionId}`);
      return subscription;
    } catch (error) {
      console.error('خطأ في جلب تفاصيل اشتراك PayPal:', error);
      throw new Error('فشل في جلب تفاصيل الاشتراك');
    }
  }

  // إنشاء خطة اشتراك
  async createPlan(params: {
    name: string;
    description: string;
    amount: string;
    currency: string;
    interval: 'MONTH' | 'YEAR';
    intervalCount?: number;
  }): Promise<any> {
    try {
      const planData = {
        product_id: process.env.PAYPAL_PRODUCT_ID!,
        name: params.name,
        description: params.description,
        status: 'ACTIVE',
        billing_cycles: [
          {
            frequency: {
              interval_unit: params.interval,
              interval_count: params.intervalCount || 1,
            },
            tenure_type: 'REGULAR',
            sequence: 1,
            total_cycles: 0, // 0 = لا نهائي
            pricing_scheme: {
              fixed_price: {
                value: params.amount,
                currency_code: params.currency.toUpperCase(),
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3,
        },
      };

      const plan = await this.makeRequest('/v1/billing/plans', {
        method: 'POST',
        body: JSON.stringify(planData),
      });

      return plan;
    } catch (error) {
      console.error('خطأ في إنشاء خطة PayPal:', error);
      throw new Error('فشل في إنشاء خطة الاشتراك');
    }
  }

  // جلب جميع الخطط
  async getPlans(): Promise<any[]> {
    try {
      const response = await this.makeRequest('/v1/billing/plans?page_size=20');
      return response.plans || [];
    } catch (error) {
      console.error('خطأ في جلب خطط PayPal:', error);
      return [];
    }
  }

  // التحقق من webhook
  async verifyWebhook(headers: Record<string, string>, body: string): Promise<boolean> {
    try {
      // PayPal webhook verification logic
      // يتطلب تنفيذ التحقق من التوقيع
      return true; // مؤقت
    } catch (error) {
      console.error('خطأ في التحقق من PayPal webhook:', error);
      return false;
    }
  }

  // إنشاء رابط دفع سريع
  async createPaymentLink(params: {
    amount: string;
    currency: string;
    description: string;
    customId?: string;
  }): Promise<string> {
    try {
      const order = await this.createOrder(params);
      const approveLink = order.links.find(link => link.rel === 'approve');
      
      if (!approveLink) {
        throw new Error('لم يتم العثور على رابط الموافقة');
      }

      return approveLink.href;
    } catch (error) {
      console.error('خطأ في إنشاء رابط دفع PayPal:', error);
      throw new Error('فشل في إنشاء رابط الدفع');
    }
  }
}

// إنشاء مثيل واحد من الخدمة
export const paypalService = new PayPalService();
