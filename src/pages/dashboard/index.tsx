import { useRouter } from 'next/router';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!user) {
            setIsRedirecting(true);
            router.push('/auth/login');
        } else if (router.isReady) { // Wait for router to be ready
            setIsRedirecting(true);
            router.push(`/dashboard/${user.role}`);
        }
    }, [user, router]);

    if (isRedirecting) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader text="Redirecting..." size="lg" />
            </div>
        );
    }


    return null;
}