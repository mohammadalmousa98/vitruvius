import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { SUBSCRIPTION_PLANS, SubscriptionPlan } from '../types';

const Pricing = () => {
  const { userData } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan.id === 'free') {
      alert('You are already on the free plan!');
      return;
    }

    setLoading(true);
    setSelectedPlan(plan);

    try {
      // TODO: Implement Stripe checkout
      // This would call a Cloud Function to create a Stripe checkout session
      alert(`Stripe integration coming soon! Selected plan: ${plan.name} - $${plan.price}/month`);

      // Placeholder for Stripe integration:
      // const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');
      // const result = await createCheckoutSession({ priceId: plan.stripePriceId });
      // window.location.href = result.data.url;

    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const isCurrentPlan = (planId: string) => userData?.plan === planId;

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing Plans</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include access to 10 AI models and 4 standard poses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                isCurrentPlan(plan.id) ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              {isCurrentPlan(plan.id) && (
                <div className="bg-primary-500 text-white text-center py-2 text-sm font-medium">
                  Current Plan
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  {plan.price > 0 && <span className="text-gray-600">/month</span>}
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold text-gray-900">{plan.credits}</span> credits/month
                  </p>
                  <p className="text-xs text-gray-500">
                    Extra credits: ${plan.extraCreditCost.toFixed(2)} each
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading || isCurrentPlan(plan.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isCurrentPlan(plan.id)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.id === 'pro'
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  } disabled:opacity-50`}
                >
                  {loading && selectedPlan?.id === plan.id
                    ? 'Processing...'
                    : isCurrentPlan(plan.id)
                    ? 'Current Plan'
                    : plan.id === 'free'
                    ? 'Free Forever'
                    : 'Subscribe'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Credits Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <div className="bg-primary-100 rounded-full p-2 mr-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">1 Credit = 1 Image</h3>
              </div>
              <p className="text-sm text-gray-600">
                Each rendered model photo costs 1 credit
              </p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <div className="bg-primary-100 rounded-full p-2 mr-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">4 Poses = 4 Credits</h3>
              </div>
              <p className="text-sm text-gray-600">
                One product on one model in all 4 poses
              </p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <div className="bg-primary-100 rounded-full p-2 mr-3">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Monthly Refresh</h3>
              </div>
              <p className="text-sm text-gray-600">
                Credits refresh on your billing date each month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-primary-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Need More Credits?</h2>
          <p className="text-gray-600 mb-4">
            Purchase additional credits at your plan's rate or upgrade to a higher tier
          </p>
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-medium">
            Contact Sales
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
