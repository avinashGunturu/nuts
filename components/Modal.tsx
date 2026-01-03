import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    actionLabel?: string;
    onAction?: () => void;
    isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    actionLabel,
    onAction,
    isLoading = false
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={isLoading ? undefined : onClose}
            />
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 scale-100 animate-scale-in overflow-hidden">
                {/* Decorative top bar */}
                <div className={`absolute top-0 left-0 w-full h-2 ${type === 'success' ? 'bg-green-500' :
                        type === 'error' || type === 'warning' ? 'bg-red-500' :
                            'bg-brand'
                    }`} />

                {!isLoading && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                    {isLoading ? (
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-neutral-50">
                            <Loader2 size={32} className="text-brand animate-spin" />
                        </div>
                    ) : (
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${type === 'success' ? 'bg-green-50 text-green-500' :
                                type === 'error' || type === 'warning' ? 'bg-red-50 text-red-500' :
                                    'bg-brand-50 text-brand'
                            }`}>
                            {type === 'success' && <CheckCircle size={32} />}
                            {type === 'error' && <AlertCircle size={32} />}
                            {type === 'warning' && <AlertTriangle size={32} />}
                            {type === 'info' && <InfoIcon size={32} />}
                        </div>
                    )}

                    <h3 className="text-2xl font-bold text-neutral-900">
                        {isLoading ? 'Processing...' : title}
                    </h3>

                    <p className="text-neutral-500 leading-relaxed">
                        {isLoading ? 'Please wait while we process your request.' : message}
                    </p>

                    {!isLoading && (
                        <div className="pt-4 w-full">
                            <button
                                onClick={onAction || onClose}
                                className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all transform active:scale-95 ${type === 'success' ? 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20' :
                                        type === 'error' || type === 'warning' ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20' :
                                            'bg-neutral-900 hover:bg-neutral-800 shadow-lg shadow-neutral-900/20'
                                    }`}
                            >
                                {actionLabel || 'Close'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoIcon = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);
