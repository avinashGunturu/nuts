import React, { useState, useEffect } from 'react';
import { bannerService } from '../../services/bannerService';
import { Button } from '../../components/Button';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { MarqueeBanner } from '../../components/MarqueeBanner';

export const AdminBannerSettings: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        text: '',
        link: '',
        linkText: '',
        variant: 'brand', // Default
        speed: 25,
        isActive: true, // Default active
        isDismissible: false,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await bannerService.getBannerSettings();
                if (data && data._id) {
                    setFormData({
                        text: data.text || '',
                        link: data.link || '',
                        linkText: data.linkText || '',
                        variant: (data.variant === 'brand' || data.variant === 'dark') ? data.variant : 'brand',
                        speed: data.speed || 25,
                        isActive: data.isActive ?? true,
                        isDismissible: data.isDismissible ?? false,
                    });
                }
            } catch (error) {
                console.error('Failed to load banner settings:', error);
                toast.error('Failed to load settings');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await bannerService.updateBanner(formData);
            toast.success('Banner updated successfully');
        } catch (error) {
            console.error('Failed to update banner:', error);
            toast.error('Failed to update banner');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Banner Management</h1>
                    <p className="text-neutral-500">Manage the top announcement bar</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-brand" size={40} />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* 1. Prominent Live Preview Section (Placed at the top as requested) */}
                    <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
                        <div className="bg-neutral-900/5 border-b border-neutral-200 p-8 flex flex-col items-center justify-center relative">
                            <div className="absolute top-4 left-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Live Preview</div>
                            <div className="w-full shadow-2xl rounded-lg overflow-hidden transition-all duration-500 transform hover:scale-[1.02]">
                                {/* Real Component Preview */}
                                <MarqueeBanner overrideProps={{
                                    text: formData.text || 'Preview Text',
                                    variant: formData.variant as 'brand' | 'dark',
                                    isActive: true, // Always show active in preview
                                    link: formData.link,
                                    linkText: formData.linkText,
                                    speed: Number(formData.speed),
                                    isDismissible: formData.isDismissible
                                }} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Controls & Settings */}
                    <div className="bg-white rounded-3xl border border-neutral-200 p-8 md:p-10 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Left Column: Content */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="space-y-4">
                                    <label className="block text-lg font-bold text-neutral-900">Announcement Message</label>
                                    <input
                                        type="text"
                                        name="text"
                                        value={formData.text}
                                        onChange={handleChange}
                                        className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand/20 text-xl font-medium placeholder:text-neutral-300 transition-all"
                                        placeholder="e.g., 🎉 Flash Sale: 50% Off Everything!"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-neutral-700">Link URL (Optional)</label>
                                        <input
                                            type="text"
                                            name="link"
                                            value={formData.link}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-neutral-700">Link Text (Optional)</label>
                                        <input
                                            type="text"
                                            name="linkText"
                                            value={formData.linkText}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                                            placeholder="e.g. Shop Now"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Style & Status */}
                            <div className="space-y-8 lg:border-l lg:border-neutral-100 lg:pl-12">
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-neutral-900">Visual Style</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${formData.variant === 'brand' ? 'border-brand bg-brand/5' : 'border-neutral-100 hover:border-neutral-200'}`}>
                                            <input
                                                type="radio"
                                                name="variant"
                                                value="brand"
                                                checked={formData.variant === 'brand'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className="h-4 w-full bg-brand rounded-full"></div>
                                            <span className={`text-xs font-bold ${formData.variant === 'brand' ? 'text-brand' : 'text-neutral-500'}`}>Brand</span>
                                        </label>

                                        <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${formData.variant === 'dark' ? 'border-brand bg-brand/5' : 'border-neutral-100 hover:border-neutral-200'}`}>
                                            <input
                                                type="radio"
                                                name="variant"
                                                value="dark"
                                                checked={formData.variant === 'dark'}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className="h-4 w-full bg-neutral-900 rounded-full"></div>
                                            <span className={`text-xs font-bold ${formData.variant === 'dark' ? 'text-brand' : 'text-neutral-500'}`}>Dark</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-neutral-100">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-neutral-900">Active Status</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-neutral-900">Dismissible</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="isDismissible"
                                                checked={formData.isDismissible}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isDismissible: e.target.checked }))}
                                                className="sr-only peer"
                                            />
                                            <div className="w-12 h-7 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand"></div>
                                        </label>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSaving || isLoading}
                                        className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-xl shadow-brand/20 hover:shadow-brand/30 hover:-translate-y-1 transition-all"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Toaster position="bottom-right" />
        </div>
    );
};
