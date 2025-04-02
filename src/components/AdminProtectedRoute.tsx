'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/ui/LoadingScreen';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [adminChecked, setAdminChecked] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!loading && user) {
        const adminStatus = await isAdmin();
        setIsUserAdmin(adminStatus);
      }
      setAdminChecked(true);
    };

    checkAdminStatus();
  }, [user, loading, isAdmin]);

  useEffect(() => {
    if (!loading && !user) {
      // User is not logged in, redirect to login
      router.push('/auth/login?redirect=/admin');
    } else if (adminChecked && !isUserAdmin && user) {
      // User is logged in but not an admin, redirect to home
      router.push('/');
    }
  }, [loading, user, adminChecked, isUserAdmin, router]);

  // Show loading screen while checking auth status
  if (loading || !adminChecked) {
    return <LoadingScreen message="Проверка доступа..." />;
  }

  // Only render children if user is logged in and is an admin
  return user && isUserAdmin ? <>{children}</> : null;
};

export default AdminProtectedRoute; 