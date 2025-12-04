import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();

// Google AI Studio Nano Banana configuration
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || '';
const NANO_BANANA_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict';

interface GenerateImagesRequest {
  jobId: string;
}

interface PosePrompt {
  type: string;
  prompt: string;
}

const POSE_PROMPTS: PosePrompt[] = [
  {
    type: 'front-standing',
    prompt: 'Full-body front standing pose. Model facing camera directly. Neutral expression. Clean white background. Professional e-commerce photography lighting.',
  },
  {
    type: '45-angle',
    prompt: 'Full-body 45-degree angle pose. Model turned at three-quarter view. Natural stance. Clean white background. Professional e-commerce photography lighting.',
  },
  {
    type: 'walking',
    prompt: 'Full-body walking pose. Model in mid-stride, dynamic movement. Natural expression. Clean white background. Professional e-commerce photography lighting.',
  },
  {
    type: 'seated',
    prompt: 'Seated pose. Model sitting naturally, relaxed posture. Clean white background. Professional e-commerce photography lighting.',
  },
];

/**
 * Cloud Function to generate model images using Google AI Studio Nano Banana
 *
 * This function:
 * 1. Validates user credits
 * 2. Downloads product and model images
 * 3. Generates images for each pose
 * 4. Uploads results to Storage
 * 5. Updates job status and deducts credits
 */
export const generateModelImages = functions.https.onCall(async (data: GenerateImagesRequest, context) => {
  // Validate authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { jobId } = data;
  const userId = context.auth.uid;

  try {
    // Get job details
    const jobRef = db.collection('jobs').doc(jobId);
    const jobDoc = await jobRef.get();

    if (!jobDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Job not found');
    }

    const jobData = jobDoc.data()!;

    // Verify ownership
    if (jobData.ownerUid !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Not authorized to access this job');
    }

    // Check if already processing or completed
    if (jobData.status !== 'pending') {
      throw new functions.https.HttpsError('failed-precondition', `Job already ${jobData.status}`);
    }

    // Get user data and check credits
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data()!;

    const requiredCredits = jobData.poses.length;
    if (userData.credits < requiredCredits) {
      await jobRef.update({
        status: 'failed',
        error: 'Insufficient credits',
      });
      throw new functions.https.HttpsError('failed-precondition', 'Insufficient credits');
    }

    // Update job status to processing
    await jobRef.update({ status: 'processing' });

    // Deduct credits immediately
    await userRef.update({
      credits: admin.firestore.FieldValue.increment(-requiredCredits),
    });

    // Get product and model details
    const productDoc = await db.collection('products').doc(jobData.productId).get();
    const modelDoc = await db.collection('models').doc(jobData.modelId).get();

    if (!productDoc.exists || !modelDoc.exists) {
      await jobRef.update({
        status: 'failed',
        error: 'Product or model not found',
      });
      throw new functions.https.HttpsError('not-found', 'Product or model not found');
    }

    const productData = productDoc.data()!;
    const modelData = modelDoc.data()!;

    // Download images from Storage
    const productImagePath = productData.imageStoragePath;
    const modelImagePath = modelData.storagePath;

    const [productBuffer] = await storage.bucket().file(productImagePath).download();
    const [modelBuffer] = await storage.bucket().file(modelImagePath).download();

    const productBase64 = productBuffer.toString('base64');
    const modelBase64 = modelBuffer.toString('base64');

    // Generate images for each pose
    const outputImages: Array<{ pose: string; url: string; storagePath: string }> = [];

    for (const poseConfig of POSE_PROMPTS) {
      if (!jobData.poses.includes(poseConfig.type)) {
        continue;
      }

      try {
        // Call Google AI Studio Nano Banana
        const systemPrompt = `You are an expert e-commerce product photographer. You generate realistic fashion model photos by applying clothing items to full-body models. Maintain accurate clothing fit, natural lighting, and professional composition. Always use a clean white background.`;

        const userPrompt = `${poseConfig.prompt}\n\nApply the clothing item from the product image to the model. Ensure the clothing fits naturally and maintains its original color and style. The model should be wearing the clothing item appropriately.`;

        // NOTE: This is a placeholder for the actual Google AI API call
        // The actual implementation would use the Nano Banana image generation endpoint
        // with multimodal inputs (model image + product image + text prompt)

        const aiResponse = await callNanoBananaAPI({
          modelImage: modelBase64,
          productImage: productBase64,
          systemPrompt,
          userPrompt,
        });

        if (!aiResponse.success || !aiResponse.imageData) {
          throw new Error('Failed to generate image');
        }

        // Upload generated image to Storage
        const timestamp = Date.now();
        const outputPath = `outputs/${userId}/${jobId}/${poseConfig.type}_${timestamp}.png`;
        const outputFile = storage.bucket().file(outputPath);

        await outputFile.save(Buffer.from(aiResponse.imageData, 'base64'), {
          metadata: {
            contentType: 'image/png',
          },
        });

        // Make file publicly readable
        await outputFile.makePublic();
        const publicUrl = outputFile.publicUrl();

        outputImages.push({
          pose: poseConfig.type,
          url: publicUrl,
          storagePath: outputPath,
        });

      } catch (error) {
        console.error(`Error generating image for pose ${poseConfig.type}:`, error);
        // Continue with other poses even if one fails
      }
    }

    // Update job with results
    if (outputImages.length === 0) {
      await jobRef.update({
        status: 'failed',
        error: 'Failed to generate any images',
      });
      // Refund credits
      await userRef.update({
        credits: admin.firestore.FieldValue.increment(requiredCredits),
      });
      throw new functions.https.HttpsError('internal', 'Failed to generate images');
    }

    await jobRef.update({
      status: 'completed',
      outputImages,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      jobId,
      outputImages,
    };

  } catch (error) {
    console.error('Error in generateModelImages:', error);

    // Try to update job status to failed
    try {
      await db.collection('jobs').doc(jobId).update({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } catch (updateError) {
      console.error('Error updating job status:', updateError);
    }

    throw error;
  }
});

/**
 * Helper function to call Google AI Studio Nano Banana API
 *
 * NOTE: This is a placeholder implementation.
 * You'll need to implement the actual API call based on Google AI Studio's documentation
 * for the Nano Banana model.
 */
async function callNanoBananaAPI(params: {
  modelImage: string;
  productImage: string;
  systemPrompt: string;
  userPrompt: string;
}): Promise<{ success: boolean; imageData?: string }> {
  try {
    // TODO: Implement actual Google AI Studio Nano Banana API call
    // This is a placeholder that shows the expected structure

    const response = await fetch(`${NANO_BANANA_ENDPOINT}?key=${GOOGLE_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: params.userPrompt,
            image: {
              bytesBase64Encoded: params.modelImage,
            },
            referenceImage: {
              bytesBase64Encoded: params.productImage,
            },
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: '9:16', // Portrait for full-body model
          negativePrompt: 'blurry, distorted, low quality, watermark, text',
          seed: Math.floor(Math.random() * 1000000),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();

    // Extract image data from response
    // The structure depends on Google AI Studio's actual response format
    const imageData = result.predictions?.[0]?.bytesBase64Encoded || null;

    return {
      success: !!imageData,
      imageData,
    };

  } catch (error) {
    console.error('Error calling Nano Banana API:', error);
    return { success: false };
  }
}

/**
 * Cloud Function to create Stripe checkout session
 * Called when user wants to upgrade their plan
 */
export const createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // TODO: Implement Stripe checkout session creation
  // This would use the Stripe SDK to create a checkout session
  // and return the session URL for redirect

  return {
    url: 'https://checkout.stripe.com/placeholder',
  };
});

/**
 * Cloud Function to handle Stripe webhooks
 * Updates user subscription status when payment succeeds/fails
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  // TODO: Implement Stripe webhook handling
  // This would verify the webhook signature and update user data
  // based on subscription events (created, updated, cancelled, etc.)

  res.status(200).send({ received: true });
});
