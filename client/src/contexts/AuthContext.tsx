import { useRouter } from 'next/router';
import { useState, useEffect, useContext, createContext, useCallback } from 'react';

type UserRole = 'buyer' | 'vendor' | 'rider';

interface UserData {
    uid: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: UserData | null;
    loading: boolean;
    error: string | null;
    logout: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: UserRole) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    error: null,
    login: async () => { },
    logout: async () => { },
    register: async () => { },
    clearError: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [state, setState] = useState<Omit<AuthContextType, 'register' | 'login' | 'logout' | 'clearError'>>({
        user: null,
        loading: false,
        error: null,
    });

    // Token handling functions
    const getToken = useCallback(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    }, []);

    const setToken = useCallback((token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
        }
    }, []);

    const clearToken = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    }, []);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // API request handler
    const apiRequest = useCallback(async (endpoint: string, method: string, body?: unknown) => {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const token = getToken();

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Request failed');
        }

        return response.json();
    }, [getToken]);

    // Auth actions
    const register = useCallback(async (email: string, password: string, role: UserRole) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await apiRequest('register', 'POST', { email, password, role });
            setToken(data.token);
            setState({ user: data.user, loading: false, error: null });
            router.push('/dashboard');
        } catch (error: never) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            throw error;
        }
    }, [apiRequest, router, setToken]);

    const login = useCallback(async (email: string, password: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await apiRequest('login', 'POST', { email, password });
            setToken(data.token);
            setState({ user: data.user, loading: false, error: null });
            router.push('/dashboard');
        } catch (error: any) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            throw error;
        }
    }, [apiRequest, router, setToken]);

    const logout = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            await apiRequest('logout', 'POST');
            clearToken();
            setState({ user: null, loading: false, error: null });
            router.push('/auth/login');
        } catch (error: unknown) {
            setState(prev => ({ ...prev, loading: false, error: error.message }));
            throw error;
        }
    }, [apiRequest, clearToken, router]);

    // Initial auth check
    const checkAuth = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            const token = getToken();
            if (!token) {
                setState(prev => ({ ...prev, loading: false }));
                return;
            }

            const data = await apiRequest('user-info', 'GET');
            setState({ user: data, loading: false, error: null });
        } catch (error) {
            clearToken();
            console.error(error);
            setState({ user: null, loading: false, error: null });
        }
    }, [apiRequest, clearToken, getToken]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{ 
            login, 
            logout,
            ...state, 
            register, 
            clearError
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);