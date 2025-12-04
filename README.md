# StyleModel Studio

AI-powered virtual model generator for clothing stores. Generate professional fashion model photos using Google AI Studio's Nano Banana image generation model.

## Overview

StyleModel Studio allows clothing store owners to:
- Upload product images
- Choose from 10 AI-generated models
- Generate 4 professional poses automatically
- Download high-quality fashion photos

Built with React, Firebase, and Google AI Studio.

## Features

- 🤖 **10 AI Models** - Diverse selection of virtual models
- 📸 **4 Standard Poses** - Front, 45°, walking, and seated
- 💳 **Credit-based System** - Flexible pricing with Stripe integration
- ⚡ **Real-time Updates** - Live job status tracking
- 🔐 **Secure Authentication** - Firebase Auth with email/Google sign-in
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **AI**: Google AI Studio (Nano Banana model)
- **Payments**: Stripe
- **Hosting**: Firebase Hosting

## Project Structure

```
stylemodel-studio/
├── src/
│   ├── components/
│   │   ├── AuthGate.tsx
│   │   ├── Layout.tsx
│   │   ├── ProductUploader.tsx
│   │   ├── ModelSelector.tsx
│   │   ├── JobList.tsx
│   │   └── PaywallBanner.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Pricing.tsx
│   │   └── Settings.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── firebase.ts
│   ├── App.tsx
│   └── main.tsx
├── functions/
│   └── src/
│       └── index.ts
├── firestore.rules
├── storage.rules
├── firebase.json
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Blaze plan (for Cloud Functions)
- Google AI Studio API key
- Stripe account (for payments)

### 1. Clone and Install

```bash
npm install
cd functions && npm install && cd ..
```

### 2. Configure Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password and Google)
3. Create Firestore database
4. Create Storage bucket
5. Copy your Firebase config

### 3. Environment Variables

Create `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_GOOGLE_AI_API_KEY=your_google_ai_key
```

### 4. Update Firebase Project ID

Edit `.firebaserc`:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 5. Configure Cloud Functions

Set the Google AI API key for Cloud Functions:

```bash
firebase functions:config:set google.ai_api_key="YOUR_GOOGLE_AI_API_KEY"
```

### 6. Deploy Security Rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

### 7. Create Base Models

Upload 10 base model images to Firebase Storage under `models/base/`:
- Generate using Nano Banana or another AI model
- Full-body, white background, various demographics
- Create corresponding Firestore documents in `models` collection

Example Firestore document:

```json
{
  "name": "Model 1 - Female Athletic",
  "description": "Athletic build, professional stance",
  "storagePath": "models/base/model_1.png",
  "gender": "female",
  "bodyType": "athletic",
  "thumbnailUrl": "https://..."
}
```

### 8. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 9. Deploy to Production

```bash
# Build the app
npm run build

# Deploy everything
firebase deploy

# Or deploy individually
firebase deploy --only hosting
firebase deploy --only functions
```

## Firestore Data Model

### users/{userId}
```typescript
{
  uid: string;
  email: string;
  plan: 'free' | 'starter' | 'pro' | 'agency';
  credits: number;
  stripeCustomerId?: string;
}
```

### models/{modelId}
```typescript
{
  name: string;
  description: string;
  storagePath: string;
  gender: 'female' | 'male' | 'unisex';
  bodyType: string;
  thumbnailUrl: string;
}
```

### products/{productId}
```typescript
{
  ownerUid: string;
  name: string;
  category: 'tops' | 'pants' | 'dresses' | 'jackets' | 'other';
  imageStoragePath: string;
  imageUrl: string;
  color?: string;
  gender?: 'male' | 'female' | 'unisex';
  createdAt: Date;
}
```

### jobs/{jobId}
```typescript
{
  ownerUid: string;
  productId: string;
  modelId: string;
  poses: PoseType[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputImages: Array<{
    pose: string;
    url: string;
    storagePath: string;
  }>;
  creditsUsed: number;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}
```

## Pricing Plans

| Plan | Price | Credits | Extra Credit Cost |
|------|-------|---------|-------------------|
| Free | $0 | 10/month | $0.20 |
| Starter | $19/month | 150/month | $0.15 |
| Pro | $49/month | 600/month | $0.10 |
| Agency | $99/month | 2,000/month | $0.08 |

## Google AI Studio Integration

### Setting Up Nano Banana

1. Go to https://ai.google.dev/
2. Create an API key
3. Enable the Imagen model
4. Update the Cloud Function to use the correct endpoint

### API Call Structure

The Cloud Function calls Nano Banana with:
- Base model image (full-body)
- Product image (clothing item)
- Pose-specific prompt
- System prompt for consistency

## Stripe Integration

### Setup

1. Create Stripe account
2. Create products and prices
3. Add webhook endpoint: `https://your-project.web.app/stripeWebhook`
4. Implement checkout session creation in Cloud Functions

### Webhook Events

- `checkout.session.completed` - Activate subscription
- `customer.subscription.updated` - Update plan
- `customer.subscription.deleted` - Cancel subscription
- `invoice.payment_succeeded` - Add credits

## Security Rules

### Firestore

- Users can only read/write their own data
- Models are read-only for all authenticated users
- Jobs can only be created by users, updated by Cloud Functions

### Storage

- Users can only access their own uploads
- Model images are read-only
- Generated outputs are user-specific

## Development Tips

### Local Testing

```bash
# Run Firebase emulators
firebase emulators:start

# Update firebase.ts to use emulators
# Uncomment the emulator connection code
```

### Debugging Cloud Functions

```bash
# View logs
firebase functions:log

# View specific function logs
firebase functions:log --only generateModelImages
```

### Adding New Models

1. Generate/upload model image to Storage
2. Create Firestore document with metadata
3. Ensure proper permissions

## Troubleshooting

### Build Errors

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Firebase Deployment Issues

```bash
# Login again
firebase login --reauth

# Check project
firebase projects:list
firebase use your-project-id
```

### Cloud Function Errors

- Check function logs: `firebase functions:log`
- Verify environment variables are set
- Ensure billing is enabled (Blaze plan)
- Check Google AI API quota

## Future Enhancements

- [ ] Batch processing (multiple products at once)
- [ ] Multi-model selection (show product on different models)
- [ ] Custom poses
- [ ] Transparent background option
- [ ] Shopify/WooCommerce plugins
- [ ] API access for Pro/Agency plans
- [ ] White-label option for Agency plan
- [ ] AI-powered product cropping
- [ ] Advanced editing tools

## Contributing

This is a private project. For questions or issues, contact the development team.

## License

Proprietary - All rights reserved

## Support

For support, email: support@vitruviusright.com

---

Built with ❤️ by Vitruvius IT Solutions
