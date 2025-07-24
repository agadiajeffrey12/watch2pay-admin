'use client'
import { useAdminAuth } from '@/hooks/useLogin';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'

const ClientLayout = ({children}:{children:React.ReactNode}) => {
    const router = useRouter();
      const { 
        isAuthenticated, 
        user 
      } = useAdminAuth();
    
      // Redirect if already authenticated
      useEffect(() => {
        if (isAuthenticated && user) {
          router.push("/dashboard");
        }
      }, [isAuthenticated, user, router]);
  return (
    <>{children}</>
  )
}

export default ClientLayout