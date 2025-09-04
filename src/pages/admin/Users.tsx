import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

const AdminUsers: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            User Management
          </h1>
          <p className="text-secondary-600">
            Manage user accounts and permissions
          </p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              User Management Coming Soon
            </h3>
            <p className="text-secondary-600">
              This page will allow you to view, manage, and control user accounts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUsers;
