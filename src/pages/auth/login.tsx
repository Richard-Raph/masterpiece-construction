import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Input from '@/components/Input';
import Loader from '@/components/Loader';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToaster } from '@/components/Toaster';
import { FaArrowCircleRight } from 'react-icons/fa';

export default function Login() {
    const { showToast } = useToaster();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { login, loading, clearError, error: authError } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        clearError();
        setLocalError('');

        try {
            await login(email, password);
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Login failed';
            setLocalError(error);
            showToast(error, 'error');
        }
    };

    return (
        <>
            <Head>
                <title>Login | Masterpiece Construction</title>
                <meta name="description" content="Construction platform login" />
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
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                            Welcome Back
                        </h1>
                        <p className="text-lg text-center opacity-90">
                            Sign in to access your construction network
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
                            <h2 className="text-2xl font-bold mb-6 text-mp-dark">Sign In</h2>

                            {(authError || localError) && (
                                <div className="text-red-500 mb-4 text-center">
                                    {authError || localError}
                                </div>
                            )}

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

                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="h-4 w-4 text-mp-primary focus:ring-mp-primary border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-sm text-mp-gray">
                                        Remember me
                                    </label>
                                </div>
                                <Link
                                    href="/auth/forgot-password"
                                    aria-label="Forgot password"
                                    className="text-sm text-mp-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                aria-label="Sign in"
                                className="w-full cursor-pointer bg-gradient-to-r from-mp-primary to-mp-muted text-mp-dark font-medium py-3 px-4 rounded-md hover:from-[#e0bb4b]! hover:to-[#f6c834]! transition-all duration-300 flex items-center justify-center"
                            >
                                {loading ? (
                                    <Loader size="sm" text="" className="inline text-mp-black" />
                                ) : (
                                    <>
                                        Sign In
                                        <FaArrowCircleRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </button>

                            <div className="mt-6 text-center text-sm text-mp-gray">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/auth/register"
                                    aria-label="Register"
                                    className="text-mp-primary hover:underline"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}
