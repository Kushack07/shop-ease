import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const AdminProducts: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Product Management
            </h1>
            <p className="text-secondary-600">
              Manage your product catalog
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Product Management Coming Soon
            </h3>
            <p className="text-secondary-600">
              This page will allow you to add, edit, and manage products in your catalog.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProducts;
