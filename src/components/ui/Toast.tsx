import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { cn } from './index';

interface ToastProps {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    onClose: () => void;
}

export const Toast = ({ type, message, onClose }: ToastProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Wait for exit animation
        setTimeout(onClose, 300);
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const styles = {
        success: "bg-white border-green-100 shadow-lg shadow-green-500/10",
        error: "bg-white border-red-100 shadow-lg shadow-red-500/10",
        warning: "bg-white border-yellow-100 shadow-lg shadow-yellow-500/10",
        info: "bg-white border-blue-100 shadow-lg shadow-blue-500/10",
    };

    return (
        <div
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border min-w-[300px] max-w-md transition-all duration-300 transform translate-y-0 opacity-100",
                styles[type],
                !isVisible && "translate-y-2 opacity-0"
            )}
            role="alert"
        >
            <div className="shrink-0">{icons[type]}</div>
            <p className="text-sm font-medium text-gray-700 flex-1">{message}</p>
            <button
                onClick={handleClose}
                className="shrink-0 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};
