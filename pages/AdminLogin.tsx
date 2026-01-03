import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp, User } from '../services/authService';
import { Button } from '../components/Button';
import { ArrowRight, AlertCircle, ShieldCheck, Mail, Phone, Lock } from 'lucide-react';

export const AdminLogin: React.FC = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [identifier, setIdentifier] = useState(''); // Email or Phone
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [inputType, setInputType] = useState<'email' | 'phone'>('phone');

    const { fetchUserProfile } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const payload = inputType === 'phone'
                ? { phone: identifier }
                : { email: identifier };

            await sendOtp(payload);
            setStep(2);
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const payload = inputType === 'phone'
                ? { phone: identifier, otp }
                : { email: identifier, otp };

            const response = await verifyOtp(payload);

            if (response.data?.token) {
                document.cookie = `Authorization=${response.data.token}; path=/; max-age=604800; samesite=lax`;
            }

            // OTP Verified. Cookie should be set by backend or we rely on it being set via res.
            // Now fetch user to populate context and check role
            await fetchUserProfile();

            // Redirect based on role check happens in ProtectedRoute usually, but here we can force check
            // Ideally fetchUserProfile throws if failed, but we can also get user from context if we wait or return it

            navigate('/dashboard'); // Admin landing page - user asked for dashboard

        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleInputType = () => {
        setInputType(prev => prev === 'phone' ? 'email' : 'phone');
        setIdentifier('');
        setError('');
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">KC</div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Admin Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Secure access for administrators
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form className="space-y-6" onSubmit={handleSendOtp}>
                            <div>
                                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                                    {inputType === 'phone' ? 'Mobile Number' : 'Email Address'}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {inputType === 'phone' ? <Phone className="h-5 w-5 text-gray-400" /> : <Mail className="h-5 w-5 text-gray-400" />}
                                    </div>
                                    <input
                                        id="identifier"
                                        name="identifier"
                                        type={inputType === 'phone' ? 'tel' : 'email'}
                                        required
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                                        placeholder={inputType === 'phone' ? '9876543210' : 'admin@kcnuts.com'}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <button type="button" onClick={toggleInputType} className="font-medium text-brand hover:text-brand-dark">
                                        Use {inputType === 'phone' ? 'Email' : 'Phone'} instead
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
                                >
                                    Send OTP
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleVerifyOtp}>
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                    Enter OTP
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="focus:ring-brand focus:border-brand block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                                        placeholder="123456"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    OTP sent to {identifier}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <button type="button" onClick={() => setStep(1)} className="font-medium text-brand hover:text-brand-dark">
                                        Change {inputType === 'phone' ? 'Number' : 'Email'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand"
                                >
                                    Verify & Login
                                </Button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    <ShieldCheck size={16} className="inline mr-1" /> Secure Environemnt
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
