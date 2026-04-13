import AuthForm from '@/components/gatepass/AuthForm';
import { Suspense } from 'react';

export default function ManagementSignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fafafa] flex items-center justify-center">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
