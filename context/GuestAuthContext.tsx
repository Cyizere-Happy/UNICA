'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { operationalData } from '@/lib/gatepass/operationalData';

interface GuestUser {
  name: string;
  email: string;
  stayCode: string;
  roomNumber?: string;
  checkOutDate?: string;
}

interface GuestAuthContextType {
  isAuthenticated: boolean;
  isRegistered: boolean;
  guestUser: GuestUser | null;
  entryModalOpen: boolean;
  verifyStayCode: (code: string) => Promise<boolean>;
  registerGuest: (data: Omit<GuestUser, 'stayCode'>) => void;
  setEntryModalOpen: (open: boolean) => void;
  checkoutModalOpen: boolean;
  setCheckoutModalOpen: (open: boolean) => void;
  logout: () => void;
}

const GuestAuthContext = createContext<GuestAuthContextType | undefined>(undefined);


export function GuestAuthProvider({ children }: { children: ReactNode }) {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('unica-guest-session');
    if (saved) {
      const data = JSON.parse(saved);
      setGuestUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      setIsRegistered(data.isRegistered);
    }
  }, []);

  // Persist state
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('unica-guest-session', JSON.stringify({
        user: guestUser,
        isAuthenticated,
        isRegistered
      }));
    } else {
      localStorage.removeItem('unica-guest-session');
    }
  }, [guestUser, isAuthenticated, isRegistered]);

  const verifyStayCode = async (code: string) => {
    // Check operational data for active stay
    const allStays = operationalData.getStays();
    const activeStay = allStays.find(s => 
      s.stayCode?.toUpperCase() === code.toUpperCase() && 
      s.status === 'CHECKED_IN'
    );

    if (activeStay) {
      setIsAuthenticated(true);
      const guestObj = {
        name: activeStay.guestName,
        email: '', // Get from guest if needed
        stayCode: code,
        roomNumber: activeStay.roomName,
        checkOutDate: activeStay.expectedCheckOutAt || '' // We may need to update types to include this in operationalData
      };
      setGuestUser(guestObj);
      return true;
    }
    return false;
  };

  const registerGuest = (data: Omit<GuestUser, 'stayCode'>) => {
    if (guestUser) {
      // Simulate assigning a checkOut date 1 to 3 days in the future
      const outDate = new Date();
      outDate.setDate(outDate.getDate() + Math.floor(Math.random() * 3) + 1);

      setGuestUser({ 
          ...data, 
          stayCode: guestUser.stayCode,
          checkOutDate: outDate.toISOString()
      });
      setIsRegistered(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsRegistered(false);
    setGuestUser(null);
  };

  return (
    <GuestAuthContext.Provider value={{
      isAuthenticated,
      isRegistered,
      guestUser,
      entryModalOpen,
      verifyStayCode,
      registerGuest,
      setEntryModalOpen,
      checkoutModalOpen,
      setCheckoutModalOpen,
      logout
    }}>
      {children}
    </GuestAuthContext.Provider>
  );
}

export function useGuestAuth() {
  const context = useContext(GuestAuthContext);
  if (context === undefined) {
    throw new Error('useGuestAuth must be used within a GuestAuthProvider');
  }
  return context;
}
