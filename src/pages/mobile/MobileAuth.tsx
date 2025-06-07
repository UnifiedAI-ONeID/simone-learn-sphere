
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { TranslatedText } from '@/components/TranslatedText';
import { TwoFactorLogin } from '@/components/TwoFactorLogin';

export const MobileAuth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-4 shadow-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            <TranslatedText text="Welcome Back" />
          </h1>
          <p className="text-gray-600 mt-2">
            <TranslatedText text="Sign in to continue learning" />
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              <TranslatedText text="Sign In" />
            </CardTitle>
            <CardDescription>
              <TranslatedText text="Access your mobile learning dashboard" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TwoFactorLogin />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
