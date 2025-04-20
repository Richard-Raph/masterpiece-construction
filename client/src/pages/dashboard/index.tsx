import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        } else {
            router.push(`/dashboard/${user.role}`);
        }
    }, [user, router]);

    return <div>Loading...</div>;
}