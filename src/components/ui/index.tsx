import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }>(
    ({ className, variant = 'primary', ...props }, ref) => {
        const variants = {
            primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
            secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
            danger: 'bg-red-600 text-white hover:bg-red-700',
            ghost: 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
        };
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
                    variants[variant],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' }) => {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
    };
    return (
        <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant])}>
            {children}
        </span>
    );
};

export const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn("bg-white rounded-xl border border-gray-200 shadow-sm", className)}>
        {children}
    </div>
);
