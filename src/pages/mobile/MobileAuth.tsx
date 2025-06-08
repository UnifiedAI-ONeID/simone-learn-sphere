
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { SimpleMobileAuth } from '@/components/SimpleMobileAuth';

export const MobileAuth = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center mx-auto mb-4 rounded-xl shadow-xl bg-primary">
            <Brain className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to continue learning
          </p>
        </div>

        <SimpleMobileAuth onSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
};
