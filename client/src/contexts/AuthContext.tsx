import { auth } from '@/utils/firebaseConfig';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useState, useEffect, useContext, createContext } from 'react';

type UserRole = 'buyer' | 'vendor' | 'rider';

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    loading: boolean;
    register: (email: string, password: string, role: UserRole) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    register: async () => { },
    login: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<Omit<AuthContextType, 'register' | 'login' | 'logout'>>({
        user: null,
        role: null,
        loading: true,
    });

    const authRequest = async (url: string, body: any) => {
        const response = await fetch(`/api/auth/${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    };

    const register = async (email: string, password: string, role: UserRole) => {
        try {
            // 1. Create Firebase user
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // 2. Register with backend
            await authRequest('register', { email, password, role });

            // 3. Get updated token with claims
            const idToken = await user.getIdToken(true);
            const { role: userRole } = await authRequest('login', { idToken });

            setState({ user, role: userRole, loading: false });
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await user.getIdToken();
            const { role } = await authRequest('login', { idToken });

            setState({ user, role, loading: false });
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        await auth.signOut();
        setState({ user: null, role: null, loading: false });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const idToken = await user.getIdToken();
                    const { role } = await authRequest('login', { idToken });
                    setState({ user, role, loading: false });
                } catch (error) {
                    console.error('Session validation failed:', error);
                    setState({ user: null, role: null, loading: false });
                }
            } else {
                setState({ user: null, role: null, loading: false });
            }
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
