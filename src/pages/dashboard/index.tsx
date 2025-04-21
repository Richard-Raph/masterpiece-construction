import { useRouter } from 'next/router';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToaster } from '@/components/Toaster';

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { showToast } = useToaster();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!user) {
            setIsRedirecting(true);
            router.push('/auth/login');
        } else if (router.isReady) {
            const validRoles = ['vendor', 'buyer', 'rider'];
            if (validRoles.includes(user.role)) {
                setIsRedirecting(true);
                router.push(`/dashboard/${user.role}`);
            } else {
                console.error('Invalid user role:', user.role);
                showToast('Invalid user role. Please contact support.', 'error');
                setIsRedirecting(true);
                router.push('/auth/login');
            }
        }
    }, [user, router, showToast]);

    if (isRedirecting) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader text="Redirecting..." size="lg" />
            </div>
        );
    }

    // Fallback for unexpected cases
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Redirecting to your dashboard...</p>
        </div>
    );
}