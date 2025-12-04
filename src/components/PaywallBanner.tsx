import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PaywallBanner = () => {
  const { userData } = useAuth();

  if (!userData || userData.credits > 5) {
    return null;
  }

  const isOutOfCredits = userData.credits === 0;

  return (
    <div className={`rounded-lg p-4 mb-6 ${isOutOfCredits ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 ${isOutOfCredits ? 'text-red-400' : 'text-yellow-400'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${isOutOfCredits ? 'text-red-800' : 'text-yellow-800'}`}>
            {isOutOfCredits ? 'Out of Credits' : 'Low on Credits'}
          </h3>
          <div className={`mt-2 text-sm ${isOutOfCredits ? 'text-red-700' : 'text-yellow-700'}`}>
            <p>
              {isOutOfCredits
                ? 'You have no credits left. Upgrade your plan to continue generating model photos.'
                : `You only have ${userData.credits} credits remaining. Consider upgrading for more credits.`}
            </p>
          </div>
          <div className="mt-4">
            <Link
              to="/pricing"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                isOutOfCredits
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-yellow-600 hover:bg-yellow-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isOutOfCredits ? 'focus:ring-red-500' : 'focus:ring-yellow-500'
              }`}
            >
              View Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaywallBanner;
