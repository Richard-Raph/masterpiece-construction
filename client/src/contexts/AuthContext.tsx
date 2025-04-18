import { auth } from '@/utils/firebaseConfig';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect, useContext, createContext } from 'react';

interface AuthContextType {
    loading: boolean;
    user: User | null;
    role: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authState, setAuthState] = useState<AuthContextType>({
        user: null,
        role: null,
        loading: true,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Get the ID token result to access custom claims (roles)
                const idTokenResult = await user.getIdTokenResult();
                const role = idTokenResult.claims.role as string || null;

                setAuthState({
                    user,
                    role,
                    loading: false,
                });
            } else {
                setAuthState({
                    user: null,
                    role: null,
                    loading: false,
                });
            }
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);