
import React, { useState } from 'react';
import { DesktopAuth } from '@/components/auth/DesktopAuth';
import { MobileAuth } from '@/components/auth/MobileAuth';
import { useIsMobile } from '@/hooks/useIsMobile';

export const Auth = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (isMobile) {
    return <MobileAuth />;
  }

  return <DesktopAuth onClose={handleClose} />;
};

export default Auth;
