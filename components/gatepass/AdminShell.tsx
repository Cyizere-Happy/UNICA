'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/gatepass/Sidebar';
import { apiService } from '@/lib/gatepass/apiService';
import { SidebarProvider } from '@/context/SidebarContext';
import { useInactivityTimer } from '@/lib/gatepass/useInactivityTimer';
import '@/components/gatepass/gatepass-admin.css';

const ADMIN_ONLY_SEGMENTS = new Set<string>(['staff-management', 'reports', 'analytics']);

type UserRole = 'ADMIN' | 'KITCHEN' | 'RECEPTION' | 'SUPER_ADMIN' | 'SECURITY' | null;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const segment = pathname.split('/').filter(Boolean).pop() || 'dashboard';

  // 1-hour inactivity timeout for staff
  useInactivityTimer(() => {
    console.log('Session expired due to inactivity');
    handleLogout();
  }, 3600000);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/management/admin');
      return;
    }

    // Session heartbeat and verification
    (async () => {
      try {
        const profile = await apiService.getProfile();
        // Server-side validation of the account
        if (!profile || (profile.role === 'SUPER_ADMIN')) {
          throw new Error('Invalid account access');
        }
        setUserRole(profile.role as UserRole);
        setReady(true);
      } catch (err) {
        console.error('Session validation failed:', err);
        apiService.logout();
        router.replace('/management/admin');
      }
    })();
  }, [router]);

  useEffect(() => {
    if (!ready || !userRole) return;
    if (userRole === 'SUPER_ADMIN') {
      apiService.logout();
      router.replace('/management/admin');
      return;
    }
    if (ADMIN_ONLY_SEGMENTS.has(segment) && userRole !== 'ADMIN') {
      router.replace('/management/admin/dashboard');
    }
  }, [ready, userRole, segment, router]);

  const handleLogout = () => {
    apiService.logout();
    router.replace('/management/admin');
  };

  const onNavigate = (page: string) => {
    router.push(`/management/admin/${page}`);
  };

  if (!ready) {
    return (
      <div className="gatepass-admin-portal min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="gatepass-admin-portal flex h-screen bg-background">
        <Sidebar
          userRole={userRole || 'ADMIN'}
          currentPage={segment}
          onNavigate={onNavigate}
          onLogout={handleLogout}
        />
        <main className="flex-1 flex flex-col min-h-screen h-screen overflow-y-auto w-full scrollbar-custom">
          <div className="flex-1 p-4 lg:px-6 lg:py-8 mt-14 lg:mt-0">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
