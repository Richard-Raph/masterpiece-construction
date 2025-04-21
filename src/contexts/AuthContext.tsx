import { useRouter } from 'next/router';
import { db, auth } from '@/libs/firebase';
import { useToaster } from '@/components/Toaster';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirebaseErrorMessage } from '@/libs/firebaseError';
import { useState, useEffect, useContext, useCallback, createContext, ReactNode } from 'react';
import { User, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export type UserRole = 'buyer' | 'vendor' | 'rider';

interface UserData {
    uid: string;
    name?: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    loading: boolean;
    error: string | null;
    user: UserData | null;
    clearError: () => void;
    logout: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: UserRole, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const { showToast } = useToaster();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const formatUser = useCallback(
        async (firebaseUser: User): Promise<UserData | null> => {
            if (!firebaseUser?.email || !db) {
                console.warn('formatUser: Missing email or db');
                return null;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                console.log('User doc data:', userDoc.data()); // Debug
                if (!userDoc.exists()) {
                    console.warn(`User document not found for UID: ${firebaseUser.uid}`);
                    setError('User profile not found. Please register again.');
                    showToast('User profile not found. Please register again.', 'error');
                    return null;
                }

                const data = userDoc.data();
                if (!data.role || !['buyer', 'vendor', 'rider'].includes(data.role)) {
                    console.warn(`Invalid or missing role for UID: ${firebaseUser.uid}`);
                    setError('Invalid user role. Please contact support.');
                    showToast('Invalid user role. Please contact support.', 'error');
                    return null;
                }

                return {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    role: data.role as UserRole,
                    name: data.name || undefined,
                };
            } catch (err) {
                console.error('Error formatting user:', err);
                const errorMessage = getFirebaseErrorMessage(err);
                setError(errorMessage);
                showToast(errorMessage, 'error');
                return null;
            }
        },
        [setError, showToast]
    );

    const register = useCallback(
        async (email: string, password: string, role: UserRole, name?: string): Promise<void> => {
            if (!auth || !db) {
                const errorMessage = 'Firebase services not initialized';
                setError(errorMessage);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }

            setLoading(true);
            setError(null);

            const trimmedEmail = email.trim();
            console.log('Registering user with email:', trimmedEmail, 'role:', role); // Debug

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
                const firebaseUser = userCredential.user;

                const userData = {
                    role,
                    email: trimmedEmail,
                    name: name || '',
                    createdAt: new Date().toISOString(),
                };

                await setDoc(doc(db, 'users', firebaseUser.uid), userData);
                console.log('User registered with UID:', firebaseUser.uid); // Debug

                await signOut(auth);
                setUser(null);

                showToast('Registration successful! Please login.', 'success');
                router.push('/auth/login');
            } catch (err) {
                console.error('Registration error:', err);
                const errorMessage = getFirebaseErrorMessage(err);
                setError(errorMessage);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [router, showToast]
    );

    const login = useCallback(
        async (email: string, password: string): Promise<void> => {
            if (!auth || !db) {
                const errorMessage = 'Firebase services not initialized';
                setError(errorMessage);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            }

            const trimmedEmail = email.trim();
            const trimmedPassword = password.trim();
            console.log('Login attempt with email:', trimmedEmail); // Debug

            setLoading(true);
            setError(null);

            try {
                const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
                const firebaseUser = userCredential.user;
                console.log('Login user UID:', firebaseUser.uid); // Debug
                const formattedUser = await formatUser(firebaseUser);

                if (formattedUser) {
                    setUser(formattedUser);
                    showToast(`Welcome back, ${formattedUser.name?.split(' ')[0].toLowerCase().replace(/^\w/, c => c.toUpperCase())}!`, 'success');
                    router.push('/dashboard');
                } else {
                    await signOut(auth);
                    throw new Error('Failed to load user data');
                }
            } catch (err) {
                console.error('Login error:', err);
                const errorMessage = getFirebaseErrorMessage(err);
                setError(errorMessage);
                showToast(errorMessage, 'error');
                throw new Error(errorMessage);
            } finally {
                setLoading(false);
            }
        },
        [router, showToast, formatUser]
    );

    const logout = useCallback(async (): Promise<void> => {
        if (!auth) {
            const errorMessage = 'Firebase auth not initialized';
            setError(errorMessage);
            showToast(errorMessage, 'error');
            throw new Error(errorMessage);
        }

        setLoading(true);
        try {
            await signOut(auth);
            setUser(null);
            showToast('Logged out successfully', 'success');
            router.push('/auth/login');
        } catch (err) {
            console.error('Logout error:', err);
            const errorMessage = getFirebaseErrorMessage(err);
            setError(errorMessage);
            showToast(errorMessage, 'error');
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [router, showToast]);

    const clearError = useCallback(() => setError(null), []);

    useEffect(() => {
        if (!auth || !db) {
            console.error('Firebase services not initialized in useEffect');
            setError('Firebase services not initialized');
            showToast('Authentication service unavailable. Please try again later.', 'error');
            setLoading(false);
            router.push('/auth/login');
            return;
        }

        console.log('Setting up auth state listener'); // Debug
        const unsubscribe = onAuthStateChanged(
            auth,
            async (firebaseUser) => {
                setLoading(true);
                try {
                    if (firebaseUser) {
                        console.log('Auth state changed, user:', firebaseUser.uid); // Debug
                        const formattedUser = await formatUser(firebaseUser);
                        if (formattedUser) {
                            setUser(formattedUser);
                            if (!router.pathname.startsWith('/auth') && !router.pathname.startsWith('/dashboard')) {
                                router.push('/dashboard');
                            }
                        } else {
                            console.log('No formatted user, logging out'); // Debug
                            await logout();
                        }
                    } else {
                        console.log('No authenticated user'); // Debug
                        if (!router.pathname.startsWith('/auth') && router.pathname !== '/') {
                            router.push('/auth/login');
                        }
                    }
                } catch (err) {
                    console.error('Auth state change error:', err);
                    const errorMessage = getFirebaseErrorMessage(err);
                    setError(errorMessage);
                    showToast(errorMessage, 'error');
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error('Auth state listener error:', error);
                setError('Authentication listener failed');
                showToast('Authentication service unavailable. Please try again later.', 'error');
                setLoading(false);
                router.push('/auth/login');
            }
        );

        return () => {
            console.log('Cleaning up auth state listener'); // Debug
            unsubscribe();
        };
    }, [logout, router, showToast, formatUser]);

    return (
        <AuthContext.Provider
            value={{
                user,
                error,
                login,
                logout,
                loading,
                register,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};