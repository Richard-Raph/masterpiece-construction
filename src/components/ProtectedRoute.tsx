import Loader from './Loader';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !router.isReady) return;

    // Type guard for user role check
    const hasAccess = user && allowedRoles.includes(user.role);
    if (!hasAccess) {
      router.push('/auth/login');
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader text="Authenticating..." size="lg" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // or redirect to login
  }

  return <>{children}</>;
}