'use client';

import React from 'react';
import { useGuestAuth } from '@/context/GuestAuthContext';
import CleaningRequestModal from './CleaningRequestModal';
import GuestEntryModal from './GuestEntryModal';
import CheckoutModal from './CheckoutModal';
import CartDrawer from './CartDrawer';

export default function ModalRegistry() {
  const { serviceModalOpen, setServiceModalOpen } = useGuestAuth();

  return (
    <>
      <CartDrawer />
      <GuestEntryModal />
      <CheckoutModal />
      <CleaningRequestModal 
        isOpen={serviceModalOpen} 
        onClose={() => setServiceModalOpen(false)} 
      />
    </>
  );
}
