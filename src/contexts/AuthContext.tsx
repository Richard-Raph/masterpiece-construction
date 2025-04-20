import { useRouter } from 'next/router';
import { db, auth } from '@/libs/firebase';
import { useToaster } from '@/components/Toaster';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getFirebaseErrorMessage } from '@/libs/firebaseError';
import { useState, useEffect, useContext, useCallback, createContext } from 'react';
import { User, signOut, getIdToken, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export type UserRole = 'buyer' | 'vendor' | 'rider';

interface UserData {
    uid: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    loading: boolean;
    error: string | null;
    user: UserData | null;
    token: string | null;
    clearError: () => void;
    logout: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { showToast } = useToaster();
    const [loading, setLoading] = useState(true); // Start with true for initial check
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Handle user data from Firebase User
    const formatUser = async (firebaseUser: User): Promise<UserData | null> => {
        if (!firebaseUser?.email) return null;

        try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (!userDoc.exists()) return null;

            return {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                role: userDoc.data().role as UserRole
            };
        } catch (err) {
            console.error('Error formatting user:', err);
            return null;
        }
    };

    // Token management
    const setToken = async (user: User) => {
        try {
            const token = await getIdToken(user);
            if (typeof window !== 'undefined') {
                localStorage.setItem('firebaseToken', token);
            }
            setTokenState(token);
            return token;
        } catch (err) {
            console.error('Error getting token:', err);
            throw err;
        }
    };

    const clearToken = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('firebaseToken');
        }
        setTokenState(null);
    };

    // Register new user
    const register = useCallback(
        async (email: string, password: string, role: UserRole): Promise<void> => {
            setLoading(true);
            setError(null);

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;
                await setToken(firebaseUser);

                await setDoc(doc(db, 'users', firebaseUser.uid), {
                    email,
                    role,
                    createdAt: new Date().toISOString()
                });

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

    // Login existing user
    const login = useCallback(
        async (email: string, password: string): Promise<void> => {
            setLoading(true);
            setError(null);

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                await setToken(userCredential.user);
                const formattedUser = await formatUser(userCredential.user);

                if (formattedUser) {
                    setUser(formattedUser);
                    showToast(`Welcome back, ${formattedUser.email}!`, 'success');
                    router.push('/dashboard');
                } else {
                    throw new Error('Failed to load user data');
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

    // Logout user
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
        } finally {
            setLoading(false);
        }
    }, [router, showToast]);

    // Clear errors
    const clearError = useCallback(() => setError(null), []);

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            try {
                if (firebaseUser) {
                    const token = await setToken(firebaseUser);
                    const formattedUser = await formatUser(firebaseUser);

                    if (formattedUser) {
                        setUser(formattedUser);

                        // If token exists but we're not on dashboard, redirect
                        if (token && !router.pathname.startsWith('/dashboard')) {
                            router.push('/dashboard');
                        }
                    } else {
                        await logout();
                    }
                } else {
                    clearToken();
                    setUser(null);
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
    }, [logout, router]);

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
