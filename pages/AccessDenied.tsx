import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const AccessDenied: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleExit = (path: string) => {
        // Clear everything as requested
        logout();
        localStorage.clear();
        sessionStorage.clear();

        // Ensure cookie is also gone (logout usually does it, but reinforcing)
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        navigate(path);
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert size={40} />
                </div>

                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Access Denied</h1>
                <p className="text-neutral-500 mb-8">
                    You typically don't have permission to access this area. If you believe this is an error, please contact your system administrator.
                </p>

                <div className="flex flex-col gap-4">
                    <Button
                        onClick={() => handleExit('/')}
                        className="w-full justify-center py-3 text-lg shadow-xl shadow-brand/20 group"
                    >
                        <Home size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Return to Home
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => handleExit('/adminportal/login')}
                        className="w-full justify-center py-3 text-lg border-2 border-neutral-100 hover:bg-neutral-50 group"
                    >
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Login
                    </Button>
                </div>
            </div>
        </div>
    );
};
