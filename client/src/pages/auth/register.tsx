import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../../utils/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'buyer' | 'vendor' | 'rider'>('buyer');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Role will be set via Firebase Admin in backend (Phase 2)
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-600">Register</h1>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'buyer' | 'vendor' | 'rider')}
                    className="mb-4 w-full p-2 border text-gray-400 rounded"
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
                    className="mb-4 w-full p-2 border rounded text-gray-400"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 w-full p-2 border rounded text-gray-400"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Register
                </button>
            </form>
        </div>
    );
}