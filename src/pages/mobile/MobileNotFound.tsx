
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TranslatedText } from '@/components/TranslatedText';

export const MobileNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100 max-w-sm w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            <TranslatedText text="Page Not Found" />
          </h1>
          <p className="text-gray-600 mb-6">
            <TranslatedText text="The page you're looking for doesn't exist." />
          </p>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Home className="h-4 w-4 mr-2" />
            <TranslatedText text="Go Home" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
