# StyleModel Studio - Complete Setup Guide

This guide will walk you through setting up StyleModel Studio from scratch.

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter project name (e.g., "stylemodel-studio")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 1.2 Upgrade to Blaze Plan

1. In Firebase Console, click "Upgrade" at the bottom left
2. Select "Blaze" (pay as you go) plan
3. Add payment method
4. Note: Blaze plan is required for Cloud Functions

### 1.3 Enable Authentication

1. Go to Authentication > Get started
2. Enable "Email/Password"
3. Enable "Google" sign-in
4. Add authorized domain for your app

### 1.4 Create Firestore Database

1. Go to Firestore Database > Create database
2. Start in **production mode**
3. Choose location (preferably same as your users)
4. Click "Enable"

### 1.5 Create Storage Bucket

1. Go to Storage > Get started
2. Start in **production mode**
3. Choose same location as Firestore
4. Click "Done"

### 1.6 Get Firebase Config

1. Go to Project settings (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app with nickname "StyleModel Studio"
5. Copy the `firebaseConfig` object

## Step 2: Google AI Studio Setup

### 2.1 Get API Key

1. Go to https://ai.google.dev/
2. Click "Get API key in Google AI Studio"
3. Create new API key or use existing
4. Copy the API key

### 2.2 Enable Imagen Model

1. In Google Cloud Console, go to APIs & Services
2. Enable "Generative Language API"
3. Ensure billing is enabled for the project

## Step 3: Stripe Setup

### 3.1 Create Stripe Account

1. Go to https://stripe.com
2. Create account or sign in
3. Complete business verification

### 3.2 Create Products

Create 3 products in Stripe Dashboard:

**Starter Plan**
- Name: "StyleModel Studio - Starter"
- Price: $19/month
- Recurring: Monthly
- Copy Price ID

**Pro Plan**
- Name: "StyleModel Studio - Pro"
- Price: $49/month
- Recurring: Monthly
- Copy Price ID

**Agency Plan**
- Name: "StyleModel Studio - Agency"
- Price: $99/month
- Recurring: Monthly
- Copy Price ID

### 3.3 Get Publishable Key

1. Go to Developers > API keys
2. Copy "Publishable key"
3. Keep "Secret key" safe (will use in Cloud Functions)

## Step 4: Local Project Setup

### 4.1 Install Dependencies

```bash
# Install project dependencies
npm install

# Install Cloud Functions dependencies
cd functions
npm install
cd ..
```

### 4.2 Create Environment File

Create `.env` in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google AI Studio
VITE_GOOGLE_AI_API_KEY=AIza...
```

### 4.3 Update Firebase Project ID

Edit `.firebaserc`:

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

### 4.4 Configure Firebase CLI

```bash
# Login to Firebase
firebase login

# Verify project
firebase projects:list

# Select your project
firebase use your-project-id
```

## Step 5: Deploy Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

## Step 6: Set Cloud Functions Environment Variables

```bash
# Set Google AI API key
firebase functions:config:set google.ai_api_key="YOUR_GOOGLE_AI_API_KEY"

# Set Stripe secret key
firebase functions:config:set stripe.secret_key="YOUR_STRIPE_SECRET_KEY"

# View current config
firebase functions:config:get
```

## Step 7: Create Base Models

You need to create 10 base AI models. Here's how:

### 7.1 Generate Model Images

Use Google AI Studio or another AI image generator to create 10 full-body model images:

**Suggested Diversity:**
1. Female, 20s, athletic, Caucasian
2. Female, 30s, curvy, African American
3. Female, petite, Asian
4. Female, plus-size, Hispanic
5. Female, tall, Middle Eastern
6. Male, athletic, Caucasian
7. Male, plus-size, African American
8. Male, slim, Asian
9. Androgynous, neutral features
10. Teen model (16-17 appearance)

**Requirements:**
- Full body visible
- White background
- Professional lighting
- Neutral clothing (white/beige)
- Facing camera
- High resolution (at least 1024x1536px)

### 7.2 Upload to Firebase Storage

```bash
# Using Firebase Console
1. Go to Storage in Firebase Console
2. Create folder: models/base/
3. Upload each image as model_1.png, model_2.png, etc.
4. Make files public or get download URLs
```

### 7.3 Create Firestore Documents

For each model, create a document in the `models` collection:

```javascript
// In Firebase Console > Firestore > Add collection "models"
{
  "name": "Model 1 - Athletic Female",
  "description": "Athletic build, 5'8\", professional stance",
  "storagePath": "models/base/model_1.png",
  "gender": "female",
  "bodyType": "athletic",
  "thumbnailUrl": "https://storage.googleapis.com/your-bucket/models/base/model_1.png"
}
```

Repeat for all 10 models.

## Step 8: Test Locally

```bash
# Start development server
npm run dev

# In another terminal, start Firebase emulators (optional)
firebase emulators:start
```

Visit `http://localhost:3000`

### Test the Flow

1. Sign up with email/password
2. Upload a product image
3. Select a model
4. Click "Generate Images"
5. Check job status updates

## Step 9: Deploy Cloud Functions

```bash
# Build and deploy functions
cd functions
npm run build
cd ..

firebase deploy --only functions
```

Expected functions:
- `generateModelImages`
- `createCheckoutSession`
- `stripeWebhook`

## Step 10: Deploy to Production

### 10.1 Build the App

```bash
npm run build
```

### 10.2 Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

### 10.3 Get Hosting URL

After deployment, you'll see:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project.web.app
```

### 10.4 Configure Domain (Optional)

1. Go to Hosting in Firebase Console
2. Click "Add custom domain"
3. Follow the instructions to point your domain
4. Recommended: `studio.vitruviusit.com`

## Step 11: Configure Stripe Webhook

### 11.1 Get Webhook URL

Your webhook URL will be:
```
https://us-central1-your-project.cloudfunctions.net/stripeWebhook
```

### 11.2 Add to Stripe

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Paste your webhook URL
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. Click "Add endpoint"
6. Copy webhook signing secret

### 11.3 Update Cloud Functions

```bash
firebase functions:config:set stripe.webhook_secret="whsec_..."
firebase deploy --only functions
```

## Step 12: Final Testing

### 12.1 Create Test Account

1. Go to your deployed URL
2. Sign up with a test account
3. Check Firestore for user document

### 12.2 Test Product Upload

1. Upload a test product image
2. Verify it appears in Storage under `products/{userId}/`
3. Check Firestore for product document

### 12.3 Test Image Generation

1. Select a model
2. Select a product
3. Click "Generate Images"
4. Monitor Cloud Function logs:
   ```bash
   firebase functions:log --only generateModelImages
   ```
5. Check job status updates in real-time
6. Verify generated images in Storage under `outputs/{userId}/`

### 12.4 Test Payment Flow

1. Go to Pricing page
2. Click "Subscribe" on Starter plan
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify subscription in Stripe Dashboard
6. Check user credits updated in Firestore

## Troubleshooting

### Issue: Cloud Function timeout

**Solution:** Increase timeout in `functions/src/index.ts`:
```typescript
export const generateModelImages = functions
  .runWith({ timeoutSeconds: 300, memory: '1GB' })
  .https.onCall(...)
```

### Issue: CORS errors

**Solution:** Add to `firebase.json`:
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      }
    ]
  }
}
```

### Issue: Insufficient permissions

**Solution:** Check Firestore/Storage rules are deployed correctly

### Issue: Google AI API quota exceeded

**Solution:**
- Check quota in Google Cloud Console
- Request quota increase
- Implement rate limiting

## Monitoring and Maintenance

### Check Logs

```bash
# Cloud Functions logs
firebase functions:log

# Specific function
firebase functions:log --only generateModelImages

# Real-time logs
firebase functions:log --follow
```

### Monitor Usage

- **Firebase Console**: Check usage for Firestore, Storage, Functions
- **Google Cloud Console**: Check AI API usage
- **Stripe Dashboard**: Monitor subscriptions and revenue

### Backup Firestore

```bash
# Export all data
gcloud firestore export gs://your-project-backup-bucket
```

### Update Dependencies

```bash
# Update frontend
npm update

# Update functions
cd functions && npm update && cd ..

# Check for outdated packages
npm outdated
```

## Next Steps

1. Set up monitoring and alerts
2. Configure custom domain
3. Add analytics (Google Analytics, etc.)
4. Create marketing materials
5. Launch beta program
6. Gather user feedback
7. Implement feature requests

## Support

For questions during setup:
- Email: support@vitruviusright.com
- Documentation: See README.md

---

Setup complete! You now have a fully functional StyleModel Studio instance.
