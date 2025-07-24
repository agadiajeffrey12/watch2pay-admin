'use client'

import { useAdminAuth } from '@/hooks/useLogin';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAdminAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/');
    } else if (isAuthenticated === true) {
      setLoading(false); // Ready to show content
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return <div>Loading...</div>; // or null/spinner
  }

  return <>{children}</>;
};

export default ClientLayout;
