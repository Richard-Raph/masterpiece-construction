import { useEffect, useState, useCallback } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

type ToastType = 'success' | 'error' | 'warning';
interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

declare global {
    interface Window {
        showToast?: (message: string, type?: ToastType) => void;
    }
}

export default function Toaster() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        const timer = setTimeout(() => {
            dismissToast(id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [dismissToast]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Make toast function available globally
        window.showToast = showToast;

        return () => {
            // Safe cleanup with optional chaining
            delete window.showToast;
        };
    }, [showToast]); // Added showToast to dependencies

    const getToastConfig = (type: ToastType) => {
        const baseClasses = 'flex items-center p-4 rounded-lg shadow-lg border max-w-xs md:max-w-sm';

        const configs = {
            success: {
                className: `${baseClasses} bg-green-50 text-green-800 border-green-200`,
                icon: <FaCheckCircle className="text-green-500 text-xl mr-3" />
            },
            error: {
                className: `${baseClasses} bg-red-50 text-red-800 border-red-200`,
                icon: <FaExclamationCircle className="text-red-500 text-xl mr-3" />
            },
            warning: {
                className: `${baseClasses} bg-yellow-50 text-yellow-800 border-yellow-200`,
                icon: <FaExclamationTriangle className="text-yellow-500 text-xl mr-3" />
            },
            default: {
                className: `${baseClasses} bg-gray-50 text-gray-800 border-gray-200`,
                icon: null
            }
        };

        return configs[type] || configs.default;
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3">
            {toasts.map((toast) => {
                const { className, icon } = getToastConfig(toast.type);
                return (
                    <div
                        role="alert"
                        key={toast.id}
                        aria-live="assertive"
                        className={className}
                    >
                        {icon}
                        <div className="flex-1 text-sm">
                            {toast.message}
                        </div>
                        <button
                            aria-label="Dismiss toast"
                            onClick={() => dismissToast(toast.id)}
                            className="cursor-pointer ml-3 text-mp-gray focus:outline-none"
                        >
                            <FaTimes />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

// Helper hook to use the toaster
export function useToaster() {
    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        if (typeof window !== 'undefined' && window.showToast) {
            window.showToast(message, type);
        } else {
            console.warn(`[Toaster] ${type}: ${message}`);
        }
    }, []);

    return { showToast };
}