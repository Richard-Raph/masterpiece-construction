import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { useToaster } from '@/components/Toaster';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
    const router = useRouter();
    const { showToast } = useToaster();
    const { user, logout } = useAuth();
    const [logoutError, setLogoutError] = useState<string | null>(null);

    const handleLogout = async () => {
        try {
            await logout();
            showToast('Logged out successfully', 'success');
            router.push('/auth/login');
        } catch (err) {
            setLogoutError(err instanceof Error ? err.message : 'Failed to logout');
            const error = err instanceof Error ? err.message : 'Failed to logout';
            console.error('Logout error:', error);
            showToast(error, 'error');
        }
    };

    return (
        <nav className="bg-mp-dark text-mp-light shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Logo/Home */}
                    <Link href="/" className="flex items-center">
                        <div className="flex items-center">
                            <Image
                                width={50}
                                height={50}
                                src="/logo-black.webp"
                                className="object-contain"
                                alt="Masterpiece Construction Logo"
                            />
                            <span className="hidden md:block font-bold text-2xl text-mp-light ml-2">
                                Masterpiece Construction
                            </span>
                        </div>
                    </Link>

                    {/* Right side - User controls */}
                    {user && (
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-2">
                                <FaUserCircle className="text-mp-light/80" />
                                <span className="text-sm">{user.email}</span>
                                <span className="bg-mp-primary text-mp-dark px-2 py-1 rounded-full text-xs font-medium capitalize">
                                    {user.role}
                                </span>
                            </div>

                            <button
                                aria-label="Logout"
                                onClick={handleLogout}
                                className="cursor-pointer flex items-center space-x-1 bg-mp-primary/10 hover:bg-mp-primary/20 text-mp-light px-3 py-2 rounded-md transition-colors"
                            >
                                <FaSignOutAlt className="text-mp-primary" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>

                            {logoutError && (
                                <span className="text-red-300 text-sm">{logoutError}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
