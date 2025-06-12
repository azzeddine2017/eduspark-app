// أنواع البيانات المشتركة للدفع والاشتراكات

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: string;
  features: string[];
  provider: string;
  providerPlanId: string;
}

export interface Subscription {
  id: string;
  planId: string;
  status: string;
  amount: number;
  currency: string;
  interval: string;
  createdAt: string;
  nextBillingDate?: string;
  plan?: SubscriptionPlan;
  // خصائص إضافية للتوافق مع CurrentSubscription
  startDate?: string;
  endDate?: string;
  price?: number;
  features?: string[];
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  description?: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  provider: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt: string;
}
