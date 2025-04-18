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
            // Redirect to role-specific dashboard
            switch (user.role) { // Ensure you've set this in your auth context
                case 'buyer':
                    router.push('/dashboard/buyer');
                    break;
                case 'vendor':
                    router.push('/dashboard/vendor');
                    break;
                case 'rider':
                    router.push('/dashboard/rider');
                    break;
                default:
                    router.push('/auth/login');
            }
        }
    }, [user, router]);

    return <div>Loading...</div>;
}