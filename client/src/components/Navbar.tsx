import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { user } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto flex justify-between">
                <span>Masterpiece Construction</span>
                {user && (
                    <button onClick={handleLogout} className="hover:underline">
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}