import { useRouter } from 'next/router';
import { db, auth } from '@/libs/firebase';
import { useToaster } from '@/components/Toaster';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useState, useEffect, useContext, useCallback, createContext } from 'react';
import { User, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

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
    clearError: () => void;
    logout: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { showToast } = useToaster();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Handle user data from Firebase User
    const formatUser = async (firebaseUser: User): Promise<UserData | null> => {
        if (!firebaseUser.email) return null;

        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (!userDoc.exists()) return null;

        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: userDoc.data().role as UserRole
        };
    };

    // Register new user
    const register = useCallback(
        async (email: string, password: string, role: UserRole): Promise<void> => {
            setLoading(true);
            setError(null);

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const firebaseUser = userCredential.user;

                await setDoc(doc(db, 'users', firebaseUser.uid), {
                    email,
                    role,
                    createdAt: new Date().toISOString()
                });

                showToast('Registration successful! Please login.', 'success');
                router.push('/auth/login');
            } catch (err) {
                const error = err as Error;
                setError(error.message);
                showToast(error.message, 'error');
                throw error;
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
                const formattedUser = await formatUser(userCredential.user);

                if (formattedUser) {
                    setUser(formattedUser);
                    showToast(`Welcome back, ${formattedUser.email}!`, 'success');
                    router.push('/dashboard');
                }
            } catch (err) {
                const error = err as Error;
                setError(error.message);
                showToast('Invalid email or password', 'error');
                throw error;
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
            setUser(null);
            showToast('Logged out successfully', 'success');
            router.push('/auth/login');
        } catch (err) {
            const error = err as Error;
            setError(error.message);
            showToast('Failed to logout', 'error');
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
                    const formattedUser = await formatUser(firebaseUser);
                    setUser(formattedUser);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

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