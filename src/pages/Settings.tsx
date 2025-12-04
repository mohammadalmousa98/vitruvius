import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Settings = () => {
  const { currentUser, userData } = useAuth();
  const [activeTab, setActiveTab] = useState<'account' | 'billing' | 'usage'>('account');

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('account')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'account'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'billing'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Billing
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'usage'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Usage
            </button>
          </nav>
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <input
                  type="text"
                  value={currentUser?.uid || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Plan
                </label>
                <div className="flex items-center">
                  <span className="px-4 py-2 bg-primary-100 text-primary-800 rounded-md font-medium">
                    {userData?.plan.charAt(0).toUpperCase() + userData?.plan.slice(1)} Plan
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Danger Zone</h3>
                <button className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 border border-red-200">
                  Delete Account
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Billing Information</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">Current Plan</span>
                  <span className="text-primary-600 font-semibold">
                    {userData?.plan.charAt(0).toUpperCase() + userData?.plan.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Credits Remaining</span>
                  <span className="font-medium text-gray-900">{userData?.credits || 0}</span>
                </div>
              </div>

              {userData?.stripeCustomerId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      Stripe Customer ID: {userData.stripeCustomerId}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Billing History
                </h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 text-center py-4">
                    No billing history available
                  </p>
                </div>
              </div>

              <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700">
                Manage Subscription
              </button>
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Credits Used</div>
                <div className="text-3xl font-bold text-gray-900">
                  {/* TODO: Calculate from Firestore */}
                  --
                </div>
                <div className="text-xs text-gray-500 mt-1">This month</div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Images Generated</div>
                <div className="text-3xl font-bold text-gray-900">
                  {/* TODO: Calculate from Firestore */}
                  --
                </div>
                <div className="text-xs text-gray-500 mt-1">Total</div>
              </div>

              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Products Uploaded</div>
                <div className="text-3xl font-bold text-gray-900">
                  {/* TODO: Calculate from Firestore */}
                  --
                </div>
                <div className="text-xs text-gray-500 mt-1">Total</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Credit Usage Over Time
              </h3>
              <div className="border border-gray-200 rounded-lg p-8">
                <p className="text-sm text-gray-500 text-center">
                  Usage chart coming soon
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Settings;
