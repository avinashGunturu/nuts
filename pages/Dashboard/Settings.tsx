import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Shield, Lock, ChevronRight } from 'lucide-react';
import { PasswordManagerModal } from '../../components/Dashboard/PasswordManagerModal';

export const Settings = () => {
    const { user } = useAuth();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
                <p className="text-neutral-500 mt-2">Manage your profile and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Profile Section - 2 Columns Wide */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand">
                                <User size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900">Profile Information</h2>
                                <p className="text-sm text-neutral-500">Your personal account details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Full Name</label>
                                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <User size={18} className="text-neutral-400" />
                                    <span className="font-bold text-neutral-900">{user?.name || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email Address</label>
                                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <Mail size={18} className="text-neutral-400" />
                                    <span className="font-bold text-neutral-900">{user?.email || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Phone Number</label>
                                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <Phone size={18} className="text-neutral-400" />
                                    <span className="font-bold text-neutral-900">{user?.phone || 'Not provided'}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Role</label>
                                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                    <Shield size={18} className="text-neutral-400" />
                                    <span className="font-bold text-neutral-900 capitalize">{user?.role || 'User'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Section - 1 Column Wide */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 h-full">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900">Security</h2>
                                <p className="text-sm text-neutral-500">Manage passwords & access</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl border border-neutral-100 hover:border-brand-200 transition-colors cursor-pointer group bg-neutral-50 hover:bg-white"
                                onClick={() => setIsPasswordModalOpen(true)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-neutral-600 group-hover:text-brand transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <h3 className="font-bold text-neutral-900">Password Manager</h3>
                                    </div>
                                    <ChevronRight size={18} className="text-neutral-400 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <p className="text-sm text-neutral-500 pl-[52px]">
                                    Securely store and manage your credentials for other services.
                                </p>
                            </div>

                            {/* Placeholder for future features */}

                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PasswordManagerModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};
