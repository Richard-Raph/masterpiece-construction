import { useRouter } from 'next/router';
import { db, auth } from '@/libs/firebase';
import { useToaster } from '@/components/Toaster';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirebaseErrorMessage } from '@/libs/firebaseError';
import { useState, useEffect, useContext, useCallback, createContext, ReactNode } from 'react';
import { User, signOut, getIdToken, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

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
    token: string | null;
    user: UserData | null;
    clearError: () => void;
    logout: () => Promise<void>;
    getCombinedToken: () => Promise<string>;
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
    const [token, setTokenState] = useState<string | null>(null);

    const formatUser = async (firebaseUser: User): Promise<UserData | null> => {
        if (!firebaseUser?.email) return null;

        try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (!userDoc.exists()) {
                console.warn(`User document not found for UID: ${firebaseUser.uid}`);
                return null;
            }

            const data = userDoc.data();
            if (!data.role || !['buyer', 'vendor', 'rider'].includes(data.role)) {
                console.warn(`Invalid or missing role for UID: ${firebaseUser.uid}`);
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
            setError(getFirebaseErrorMessage(err));
            return null;
        }
    };

    const setToken = async (user: User): Promise<string | null> => {
        try {
            const token = await getIdToken(user, true);
            if (typeof window !== 'undefined') {
                localStorage.setItem('firebaseToken', token);
            }
            setTokenState(token);
            return token;
        } catch (err) {
            console.error('Error getting token:', err);
            setError(getFirebaseErrorMessage(err));
            return null;
        }
    };

    const clearToken = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('firebaseToken');
        }
        setTokenState(null);
    };

    const getCombinedToken = async (): Promise<string> => {
        if (!auth.currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            const idToken = await auth.currentUser.getIdToken(true); // Get client-side token
            const response = await fetch('/api/auth/token', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`, // Send token to server
                },
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`API request failed: Status ${response.status}, Body: ${errorBody}`);
                throw new Error('Failed to fetch authentication token');
            }

            const { token } = await response.json();
            return token;
        } catch (error) {
            console.error('Error getting combined token:', error);
            throw new Error('Failed to get authentication token');
        }
    };

    const register = useCallback(
        async (email: string, password: string, role: UserRole, name?: string): Promise<void> => {
            setLoading(true);
            setError(null);

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;

                await setDoc(doc(db, 'users', firebaseUser.uid), {
                    role,
                    email,
                    name: name || '',
                    createdAt: new Date().toISOString(),
                });

                await signOut(auth);
                clearToken();
                setUser(null);

                showToast('Registration successful! Please login.', 'success');
                router.push('/auth/login');
            } catch (err) {
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
            setLoading(true);
            setError(null);

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                const token = await setToken(firebaseUser);
                const formattedUser = await formatUser(firebaseUser);

                if (formattedUser && token) {
                    setUser(formattedUser);
                    showToast(`Welcome back, ${formattedUser.name?.split(' ')[0].toLowerCase().replace(/^\w/, c => c.toUpperCase())}!`, 'success');
                    router.push('/dashboard');
                } else {
                    await signOut(auth);
                    clearToken();
                    throw new Error('Failed to load user data or token');
                }
            } catch (err) {
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

    const logout = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            await signOut(auth);
            clearToken();
            setUser(null);
            showToast('Logged out successfully', 'success');
            router.push('/auth/login');
        } catch (err) {
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
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            try {
                if (firebaseUser) {
                    const token = await setToken(firebaseUser);
                    const formattedUser = await formatUser(firebaseUser);

                    if (formattedUser && token) {
                        setUser(formattedUser);
                        if (!router.pathname.startsWith('/auth') && !router.pathname.startsWith('/dashboard')) {
                            router.push('/dashboard');
                        }
                    } else {
                        await logout();
                    }
                } else {
                    clearToken();
                    setUser(null);
                    if (!router.pathname.startsWith('/auth')) {
                        router.push('/auth/login');
                    }
                }
            } catch (err) {
                const errorMessage = getFirebaseErrorMessage(err);
                setError(errorMessage);
                showToast(errorMessage, 'error');
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [logout, router, showToast]);

    return (
        <AuthContext.Provider
            value={{
                user,
                error,
                token,
                login,
                logout,
                loading,
                register,
                clearError,
                getCombinedToken,
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
