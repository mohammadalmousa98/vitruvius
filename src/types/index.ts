export interface User {
  uid: string;
  email: string | null;
  plan: 'free' | 'starter' | 'pro' | 'agency';
  credits: number;
  stripeCustomerId?: string;
}

export interface Model {
  id: string;
  name: string;
  description: string;
  storagePath: string;
  gender: 'female' | 'male' | 'unisex';
  bodyType: string;
  thumbnailUrl?: string;
}

export interface Product {
  id: string;
  ownerUid: string;
  name: string;
  category: 'tops' | 'pants' | 'dresses' | 'jackets' | 'other';
  imageStoragePath: string;
  imageUrl?: string;
  color?: string;
  fit?: string;
  gender?: 'male' | 'female' | 'unisex';
  createdAt: Date;
}

export type PoseType = 'front-standing' | '45-angle' | 'walking' | 'seated';

export interface Job {
  id: string;
  ownerUid: string;
  productId: string;
  modelId: string;
  poses: PoseType[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputImages: {
    pose: PoseType;
    url: string;
    storagePath: string;
  }[];
  creditsUsed: number;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface SubscriptionPlan {
  id: 'free' | 'starter' | 'pro' | 'agency';
  name: string;
  price: number;
  credits: number;
  extraCreditCost: number;
  stripePriceId?: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 10,
    extraCreditCost: 0.20,
    features: [
      '10 credits/month',
      'All 10 AI models',
      '4 standard poses',
      'Basic support'
    ]
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    credits: 150,
    extraCreditCost: 0.15,
    features: [
      '150 credits/month',
      'All 10 AI models',
      '4 standard poses',
      'Priority support',
      'Download in HD'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    credits: 600,
    extraCreditCost: 0.10,
    features: [
      '600 credits/month',
      'All 10 AI models',
      '4 standard poses',
      'Priority support',
      'Download in HD',
      'Batch processing',
      'API access'
    ]
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 99,
    credits: 2000,
    extraCreditCost: 0.08,
    features: [
      '2,000 credits/month',
      'All 10 AI models',
      '4 standard poses',
      'Dedicated support',
      'Download in HD',
      'Batch processing',
      'API access',
      'White label option'
    ]
  }
];

export const POSES: { type: PoseType; label: string; description: string }[] = [
  {
    type: 'front-standing',
    label: 'Front Standing',
    description: 'Full-body front view, neutral expression'
  },
  {
    type: '45-angle',
    label: '45° Angle',
    description: 'Three-quarter view showing depth'
  },
  {
    type: 'walking',
    label: 'Walking',
    description: 'Dynamic walking pose'
  },
  {
    type: 'seated',
    label: 'Seated',
    description: 'Sitting pose for casual wear'
  }
];
