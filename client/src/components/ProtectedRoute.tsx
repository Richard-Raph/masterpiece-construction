import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({
    children,
    allowedRoles,
}: {
    allowedRoles: string[];
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, role, loading } = useAuth();

    useEffect(() => {
        if (loading) return; // Wait until auth state is loaded

        // Redirect conditions:
        // 1. No user (not logged in)
        // 2. User exists but no role assigned
        // 3. User's role not in allowedRoles
        if (!user || !role || !allowedRoles.includes(role)) {
            router.push('/auth/login');
        }
    }, [user, role, loading, router, allowedRoles]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <p>Loading authentication...</p>
        </div>;
    }

    if (!user || !role || !allowedRoles.includes(role)) {
        return null; // Already redirected in useEffect
    }

    return <>{children}</>;
}