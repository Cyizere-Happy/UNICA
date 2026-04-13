'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/lib/gatepass/apiService';
import { useInactivityTimer } from '@/lib/gatepass/useInactivityTimer';

interface GuestUser {
  id?: string; // stayId
  guestId?: string; // Real guest UUID
  roomId?: string; // Real room UUID
  name: string;
  email: string;
  stayCode: string;
  roomNumber?: string;
  checkOutDate?: string;
  roomPrice?: number;
  stayType?: 'ROOM' | 'APARTMENT';
}

interface GuestAuthContextType {
  isAuthenticated: boolean;
  isRegistered: boolean;
  guestUser: GuestUser | null;
  entryModalOpen: boolean;
  verifyStayCode: (code: string) => Promise<boolean>;
  registerGuest: (data: any) => Promise<boolean>;
  setEntryModalOpen: (open: boolean) => void;
  checkoutModalOpen: boolean;
  setCheckoutModalOpen: (open: boolean) => void;
  serviceModalOpen: boolean;
  setServiceModalOpen: (open: boolean) => void;
  logout: () => void;
}

const GuestAuthContext = createContext<GuestAuthContextType | undefined>(undefined);


export function GuestAuthProvider({ children }: { children: ReactNode }) {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [entryModalOpen, setEntryModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  // 1-hour inactivity timeout for guests
  useInactivityTimer(() => {
    if (isAuthenticated) {
      console.log('Guest session expired due to inactivity');
      logout();
    }
  }, 3600000);

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
    try {
      // Trim and uppercase to be safe
      const cleanCode = code.trim().toUpperCase();
      const response = await apiService.verifyGuest(cleanCode);
      
      // Backend returns: { access_token, guest, room, stayId }
      const { access_token, guest, room, stayId } = response;
      
      if (access_token && guest) {
        // Store as 'token' — this is what api.ts reads
        localStorage.setItem('token', access_token);
        setIsAuthenticated(true);
        
        const guestObj: GuestUser = {
          id: stayId,
          guestId: guest.id,
          roomId: room?.id,
          name: guest.name,
          email: guest.email,
          stayCode: cleanCode,
          roomNumber: room?.name,
          checkOutDate: room?.expectedCheckOutAt,
          roomPrice: room?.price ? Number(room.price) : 0,
          stayType: room?.type === 'apartment' ? 'APARTMENT' : 'ROOM',
        };
        setGuestUser(guestObj);
        return true;
      }
    } catch (error) {
      console.error('Guest verification failed:', error);
    }
    return false;
  };

  const registerGuest = async (data: any) => {
    try {
      if (!guestUser?.stayCode) return false;
      
      const response = await apiService.registerGuestProfile(data);
      if (response.success) {
        setGuestUser({ 
            ...guestUser,
            ...data,
            name: data.name,
            email: data.email
        });
        setIsRegistered(true);
        return true;
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsRegistered(false);
    setGuestUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('unica-guest-session');
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
      serviceModalOpen,
      setServiceModalOpen,
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
