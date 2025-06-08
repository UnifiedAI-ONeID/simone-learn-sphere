
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MobileSidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  toggleSidebar: () => void;
  close: () => void;
}

const MobileSidebarContext = createContext<MobileSidebarContextType | undefined>(undefined);

export const useMobileSidebar = () => {
  const context = useContext(MobileSidebarContext);
  if (!context) {
    throw new Error('useMobileSidebar must be used within a MobileSidebarProvider');
  }
  return context;
};

export const MobileSidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <MobileSidebarContext.Provider value={{ isOpen, toggle, toggleSidebar, close }}>
      {children}
    </MobileSidebarContext.Provider>
  );
};
