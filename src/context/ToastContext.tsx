import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast } from '../components/ui/Toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
    toast: {
        success: (message: string, duration?: number) => void;
        error: (message: string, duration?: number) => void;
        info: (message: string, duration?: number) => void;
        warning: (message: string, duration?: number) => void;
    };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType, duration: number = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, type, message, duration };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    const toastHelpers = {
        success: (msg: string, dur?: number) => addToast(msg, 'success', dur),
        error: (msg: string, dur?: number) => addToast(msg, 'error', dur),
        info: (msg: string, dur?: number) => addToast(msg, 'info', dur),
        warning: (msg: string, dur?: number) => addToast(msg, 'warning', dur),
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast, toast: toastHelpers }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div key={t.id} className="pointer-events-auto">
                        <Toast
                            type={t.type}
                            message={t.message}
                            onClose={() => removeToast(t.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context.toast;
};
