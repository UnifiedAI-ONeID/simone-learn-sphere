
import React from 'react';
import { SimpleMobileAuth } from '@/components/SimpleMobileAuth';
import { useNavigate } from 'react-router-dom';

export const MobileAuth = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SimpleMobileAuth onSuccess={handleAuthSuccess} />
    </div>
  );
};
