import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode, useEffect } from 'react';
import Loader from '@/components/Loader';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !allowedRoles.includes(user.role))) {
      router.push('/auth/login');
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" text="Checking access..." />
      </div>
    );
  }

  return <>{children}</>;
}