import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { Button } from '../../components/Button';
import { Loader2, Save, ArrowLeft, Truck, Gift } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const AdminShippingSettings: React.FC = () => {
    const [threshold, setThreshold] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const result = await orderService.getSettings();
            setThreshold(result.data.freeShippingThreshold || 0);
        } catch (error: any) {
            toast.error(error.message || 'Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await orderService.updateSettings(threshold);
            toast.success('Shipping settings updated!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-brand" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <Toaster position="top-right" />

            <Link to="/dashboard" className="inline-flex items-center text-neutral-500 hover:text-brand mb-6 transition-colors font-medium">
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </Link>

            <div className="bg-white rounded-2xl border border-neutral-100 shadow-lg p-8">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-neutral-100">
                    <div className="w-12 h-12 rounded-full bg-brand-50 text-brand flex items-center justify-center">
                        <Truck size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Shipping Settings</h1>
                        <p className="text-neutral-500 text-sm">Configure the free shipping threshold for your store</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Free Shipping Threshold */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider block">
                            Free Shipping for Orders Above
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-lg">₹</span>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={threshold}
                                onChange={(e) => setThreshold(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-4 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-900 text-lg font-semibold focus:outline-none focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 transition-all"
                                placeholder="0"
                            />
                        </div>
                        <p className="text-sm text-neutral-400">
                            Orders with a subtotal equal to or above this amount will get <strong className="text-green-600">free shipping</strong>.
                            Set to <strong>0</strong> to always charge shipping.
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Gift size={18} className="text-brand" />
                            <span className="font-bold text-neutral-700">Preview</span>
                        </div>
                        {threshold > 0 ? (
                            <p className="text-neutral-600">
                                Customers will see: <span className="font-semibold text-green-600">"Free shipping on orders above ₹{threshold.toLocaleString('en-IN')}"</span>
                            </p>
                        ) : (
                            <p className="text-neutral-600">
                                Shipping will <span className="font-semibold text-amber-600">always be charged</span> based on Shiprocket rates.
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-brand hover:bg-brand-dark text-white py-4"
                        isLoading={saving}
                    >
                        {!saving && <Save size={18} className="mr-2" />}
                        Save Settings
                    </Button>
                </form>
            </div>
        </div>
    );
};
