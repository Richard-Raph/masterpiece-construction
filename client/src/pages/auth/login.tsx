import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../utils/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'buyer' | 'vendor' | 'rider'>('buyer');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Role will be set via Firebase Admin in backend (Phase 2)
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'buyer' | 'vendor' | 'rider')}
                    className="mb-4 w-full p-2 border rounded"
                >
                    <option value="buyer">Buyer</option>
                    <option value="vendor">Vendor</option>
                    <option value="rider">Rider</option>
                </select>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 w-full p-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Login
                </button>
            </form>
        </div>
    );
}