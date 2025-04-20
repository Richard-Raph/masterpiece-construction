import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Input from '@/components/Input';
import { useRouter } from 'next/router';
import Select from '@/components/Select';
import { useAuth } from '@/contexts/AuthContext';
import { FaArrowCircleRight } from 'react-icons/fa';

export default function Register() {
    const router = useRouter();
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'buyer' | 'vendor' | 'rider'>('buyer');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register(email, password, role);
            router.push('/dashboard');
        } catch (err) {
            setError('Registration failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <>
            <Head>
                <title>Register | Masterpiece Construction</title>
                <meta name="description" content="Platform for buyers, vendors, and riders in the construction industry" />
            </Head>
            <section className="min-h-screen bg-mp-light flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-gradient-to-br from-mp-primary to-mp-muted grid place-items-center p-8 text-white">
                    <div className="max-w-md">
                        <Link href="/">
                            <Image
                                width={180}
                                height={60}
                                src="/logo-white.webp"
                                className="mb-8 mx-auto"
                                alt="Masterpiece Construction Logo"
                            />
                        </Link>
                        <h1 className="text-3xl grid place-items-center md:text-4xl font-bold mb-4 text-center">
                            Join Our
                            <span className="relative my-2 block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-[#242424]">
                                <span className="relative text-mp-primary">Construction</span>
                            </span>
                            Network
                        </h1>
                        <p className="text-lg text-center opacity-90">
                            Connect with pros and streamline your projects.
                        </p>
                    </div>
                </div>

                <div className="md:w-1/2 flex items-center justify-center p-6">
                    <form onSubmit={handleRegister} className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-1 text-mp-dark">Create Account</h2>
                            <p className="text-mp-gray mb-6">Select your role to get started</p>
                            {error && <div className="text-red-500 mb-4">{error}</div>}
                            <Select role={role} setRole={setRole} />

                            <Input
                                id="email"
                                icon="email"
                                type="email"
                                value={email}
                                label="Email Address"
                                placeholder="your@email.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Input
                                id="password"
                                icon="password"
                                type="password"
                                label="Password"
                                value={password}
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button
                                type="submit"
                                className="w-full cursor-pointer bg-gradient-to-r from-mp-primary to-mp-muted text-mp-dark font-medium py-3 px-4 rounded-md hover:from-[#e0bb4b]! hover:to-[#f6c834]! transition-all duration-300 flex items-center justify-center"
                            >
                                Continue
                                <FaArrowCircleRight className="w-4 h-4 ml-2" />
                            </button>

                            <div className="mt-6 text-center text-sm text-mp-gray">
                                Already have an account?{' '}
                                <Link href="/auth/login" className="text-mp-primary hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </div>

                        <div className="bg-mp-light px-8 py-4 border-t border-gray-200">
                            <p className="text-xs text-mp-gray text-center">
                                By continuing, you agree to our{' '}
                                <Link href="/terms" className="text-mp-primary hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-mp-primary hover:underline">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}
