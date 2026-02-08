import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Trash2, Plus, Lock, Globe, User, Save, Loader2, Pencil, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getPasswords, createPassword, updatePassword, deletePassword } from '../../services/passwordService';
import { Modal } from '../Modal';

interface PasswordManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface PasswordEntry {
    _id: string;
    siteName: string;
    siteUrl?: string;
    username: string;
    password?: string;
}

export const PasswordManagerModal: React.FC<PasswordManagerModalProps> = ({ isOpen, onClose }) => {
    const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewingEntry, setViewingEntry] = useState<PasswordEntry | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        id: ''
    });

    // Form State
    const [formData, setFormData] = useState({
        siteName: '',
        siteUrl: '',
        username: '',
        password: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchPasswords();
        }
    }, [isOpen]);

    const fetchPasswords = async () => {
        try {
            setLoading(true);
            const data = await getPasswords();
            setPasswords(data || []);
        } catch (error) {
            toast.error('Failed to load passwords');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleVisibility = (id: string) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleCopy = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success(`Copied ${field}`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.siteName || !formData.username || (!formData.password && !editingId)) {
                toast.error('Please fill all required fields');
                return;
            }

            if (editingId) {
                await updatePassword(editingId, formData);
                toast.success('Password updated successfully');
            } else {
                await createPassword(formData);
                toast.success('Password saved successfully');
            }

            resetForm();
            fetchPasswords();
        } catch (error) {
            toast.error('Failed to save password');
        }
    };

    const handleEdit = (entry: PasswordEntry) => {
        setFormData({
            siteName: entry.siteName,
            siteUrl: entry.siteUrl || '',
            username: entry.username,
            password: entry.password || ''
        });
        setEditingId(entry._id);
        setIsAdding(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        try {
            await deletePassword(deleteModal.id);
            toast.success('Password deleted');
            setPasswords(prev => prev.filter(p => p._id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: '' });
        } catch (error) {
            toast.error('Failed to delete password');
        }
    };

    const resetForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ siteName: '', siteUrl: '', username: '', password: '' });
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900">Password Manager</h2>
                                <p className="text-sm text-neutral-500">Securely store and manage your credentials</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/30">
                        {/* Add/Edit Section */}
                        {isAdding ? (
                            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm mb-6 animate-slide-up">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-lg">{editingId ? 'Edit Credential' : 'Add New Credential'}</h3>
                                    <button
                                        onClick={resetForm}
                                        className="text-sm text-neutral-500 hover:text-neutral-900"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Site Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="siteName"
                                                value={formData.siteName}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Google Analytics"
                                                className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-0 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Topic / URL</label>
                                            <input
                                                type="text"
                                                name="siteUrl"
                                                value={formData.siteUrl}
                                                onChange={handleInputChange}
                                                placeholder="e.g. https://analytics.google.com"
                                                className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-0 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Username / Email <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                placeholder="admin@example.com"
                                                className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-0 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700 mb-1">Password <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Secret Password"
                                                className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-0 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            className="bg-brand text-white px-6 py-2.5 rounded-xl font-medium hover:bg-neutral-900 transition-colors flex items-center gap-2"
                                        >
                                            <Save size={18} />
                                            {editingId ? 'Update Password' : 'Save Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl flex items-center justify-center gap-2 text-neutral-500 hover:border-brand hover:text-brand hover:bg-brand-50/50 transition-all mb-6 group"
                            >
                                <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                                    <Plus size={18} />
                                </div>
                                <span className="font-bold">Add New Password</span>
                            </button>
                        )}

                        {/* Password List */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                                <Loader2 size={40} className="animate-spin mb-4 text-brand" />
                                <p>Loading your secure vault...</p>
                            </div>
                        ) : passwords.length === 0 && !isAdding ? (
                            <div className="text-center py-12 text-neutral-400">
                                <Lock size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No passwords stored yet.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {passwords.map((entry) => (
                                    <div key={entry._id} className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center gap-4">
                                        {/* Icon & Name */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 shrink-0">
                                                <Globe size={24} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-neutral-900 truncate">{entry.siteName}</h4>
                                                {entry.siteUrl && (
                                                    <a href={entry.siteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand hover:underline truncate block">
                                                        {entry.siteUrl}
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Creodentials */}
                                        <div className="flex-1 w-full md:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-lg min-w-0">
                                                <User size={14} className="text-neutral-400 shrink-0" />
                                                <span className="text-sm font-medium text-neutral-700 truncate select-all">{entry.username}</span>
                                            </div>

                                            <div className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded-lg relative group">
                                                <Lock size={14} className="text-neutral-400 shrink-0" />
                                                <div className="flex-1 truncate font-mono text-sm text-neutral-800">
                                                    {visiblePasswords[entry._id] ? (
                                                        <span className="select-all">{entry.password}</span>
                                                    ) : (
                                                        '••••••••••••••••'
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => toggleVisibility(entry._id)}
                                                    className="absolute right-2 p-1 rounded hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600 transition-colors"
                                                >
                                                    {visiblePasswords[entry._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 ml-auto">
                                            <button
                                                onClick={() => setViewingEntry(entry)}
                                                className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(entry)}
                                                className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
                                                title="Edit Password"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(entry._id)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
                                                title="Delete Password"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* View Details Modal */}
            {viewingEntry && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setViewingEntry(null)}
                    />
                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-in">
                        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                            <h2 className="text-xl font-bold text-neutral-900">Credential Details</h2>
                            <button
                                onClick={() => setViewingEntry(null)}
                                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Site Info */}
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">Service</label>
                                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-brand shadow-sm">
                                        <Globe size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-neutral-900">{viewingEntry.siteName}</h4>
                                        {viewingEntry.siteUrl && (
                                            <a href={viewingEntry.siteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-brand truncate block">
                                                {viewingEntry.siteUrl}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Username with Copy */}
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">Username / Email</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                        <User size={18} className="text-neutral-400" />
                                        <span className="font-medium text-neutral-900 select-all">{viewingEntry.username}</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(viewingEntry.username, 'username')}
                                        className="p-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/20"
                                        title="Copy Username"
                                    >
                                        {copiedField === 'username' ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Password with Copy & Toggle */}
                            <div>
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">Password</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100 relative">
                                        <Lock size={18} className="text-neutral-400" />
                                        <span className="font-mono text-neutral-900 flex-1 truncate pr-8 select-all">
                                            {visiblePasswords[`view-${viewingEntry._id}`] ? viewingEntry.password : '••••••••••••••••'}
                                        </span>
                                        <button
                                            onClick={() => toggleVisibility(`view-${viewingEntry._id}`)}
                                            className="absolute right-3 text-neutral-400 hover:text-neutral-600 transition-colors"
                                        >
                                            {visiblePasswords[`view-${viewingEntry._id}`] ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(viewingEntry.password || '', 'password')}
                                        className="p-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/20"
                                        title="Copy Password"
                                    >
                                        {copiedField === 'password' ? <Check size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: '' })}
                title="Delete Password"
                message="Are you sure you want to delete this password? This action cannot be undone."
                type="warning"
                actionLabel="Delete"
                onAction={confirmDelete}
            />
        </>
    );
};
