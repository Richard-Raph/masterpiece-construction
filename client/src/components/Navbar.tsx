import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <span className="font-bold">Masterpiece Construction</span>
                {user && (
                    <div className="flex items-center space-x-4">
                        <span>Welcome, {user.email}</span>
                        <span className="bg-blue-800 px-2 py-1 rounded text-sm">
                            {user.role}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="hover:underline bg-white text-blue-600 px-3 py-1 rounded"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}