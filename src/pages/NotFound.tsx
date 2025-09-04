import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="text-8xl font-bold text-primary-600 mb-4">404</div>
        
        {/* Main Message */}
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-secondary-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link to="/" className="block">
            <Button className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Button>
          </Link>
          
          <Link to="/products" className="block">
            <Button variant="outline" className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-full text-secondary-600 hover:text-secondary-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-secondary-500">
          <p>Need help? Contact our support team at</p>
          <a href="mailto:support@shopease.com" className="text-primary-600 hover:text-primary-700">
            support@shopease.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
