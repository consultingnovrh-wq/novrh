export type UserType = 'candidate' | 'company' | 'employer' | 'admin';

export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'enterprise';

export type ServiceCategory = 'recruitment' | 'formation' | 'consulting' | 'cvtheque' | 'job_posting' | 'tenders';

export interface PricingPlan {
  id: SubscriptionPlan;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  description: string;
  features: string[];
  userTypes: UserType[];
  popular?: boolean;
}

export interface ServiceAccess {
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  description: string;
  freeAccess: boolean;
  requiredPlan: SubscriptionPlan;
  maxUsage?: number;
  currentUsage?: number;
}

export interface UserSubscription {
  userId: string;
  userType: UserType;
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'mobile_money';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  description: string;
  plan: SubscriptionPlan;
  billingCycle: 'monthly' | 'yearly';
}
