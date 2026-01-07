import React from 'react';
import { Truck } from 'lucide-react';

export const ShippingPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pt-32 pb-24 md:pt-40 md:pb-32">
            <div className="container mx-auto px-6 md:px-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 text-brand rounded-2xl mb-6">
                        <Truck size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Shipping & Delivery Policy</h1>
                    <p className="text-neutral-500 text-lg">Last updated: January 2026</p>
                </div>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                    <div className="bg-neutral-50 rounded-3xl p-8 md:p-12 border border-neutral-100">
                        <ul className="space-y-4 text-neutral-600">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0"></span>
                                <span>Orders are dispatched within 2–5 working days.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0"></span>
                                <span>Delivery timelines depend on location and logistics partner.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0"></span>
                                <span>Shipping charges are calculated at checkout or informed separately for bulk orders.</span>
                            </li>
                        </ul>

                        <div className="mt-8 pt-8 border-t border-neutral-200">
                            <p className="text-sm text-neutral-500">
                                For shipping queries, please contact us at{' '}
                                <a href="mailto:Mahindracashewproducts@gmail.com" className="text-brand hover:underline">
                                    Mahindracashewproducts@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
