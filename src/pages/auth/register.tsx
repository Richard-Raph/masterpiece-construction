import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Loader from '@/components/Loader';
import { useState, FormEvent } from 'react';
import { useToaster } from '@/components/Toaster';
import { FaArrowCircleRight } from 'react-icons/fa';
import { useAuth, UserRole } from '@/contexts/AuthContext';

export default function Register() {
    const { showToast } = useToaster();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const [role, setRole] = useState<UserRole>('buyer');
    const { loading, register, clearError, error: authError } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setLocalError('');

        try {
            await register(email, password, role);
            showToast('Registration successful! Please login.', 'success');
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Registration failed';
            setLocalError(error);
            showToast(error, 'error');
        }
    };

    return (
        <>
            <Head>
                <title>Register | Masterpiece Construction</title>
                <meta name="description" content="Create your account" />
            </Head>

            <section className="min-h-screen bg-mp-light flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-gradient-to-br from-mp-primary to-mp-muted grid place-items-center p-8 text-white">
                    <div className="max-w-md">
                        <Link href="/" aria-label="Home">
                            <Image
                                priority
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
                    <form
                        noValidate
                        onSubmit={handleSubmit}
                        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-1 text-mp-dark">Create Account</h2>
                            <p className="text-mp-gray mb-6">Select your role to get started</p>

                            {(authError || localError) && (
                                <div className="text-red-500 mb-4 text-center">
                                    {authError || localError}
                                </div>
                            )}

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
                                disabled={loading}
                                aria-label="Continue registration"
                                className="w-full cursor-pointer bg-gradient-to-r from-mp-primary to-mp-muted text-mp-dark font-medium py-3 px-4 rounded-md hover:from-[#e0bb4b]! hover:to-[#f6c834]! transition-all duration-300 flex items-center justify-center"
                            >
                                {loading ? (
                                    <Loader size="sm" text="" className="inline" spinnerClass="text-mp-black" />
                                ) : (
                                    <>
                                        Continue
                                        <FaArrowCircleRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>

                            <div className="mt-6 text-center text-sm text-mp-gray">
                                Already have an account?{' '}
                                <Link
                                    href="/auth/login"
                                    aria-label="Login"
                                    className="text-mp-primary hover:underline"
                                >
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
