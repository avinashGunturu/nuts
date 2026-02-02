import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag, Search } from 'lucide-react';
import { Button } from '../components/Button';

export const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center">

            {/* Headlines */}
            <h1 className="text-[120px] leading-none font-bold text-neutral-900 mb-2 tracking-tighter select-none">
                4<span className="text-brand">0</span>4
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
                Aw, Nuts!
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto mb-12 text-lg">
                We couldn't find the page you're looking for. It might have been eaten or rolled away.
            </p>

            {/* Actions - Fixed sizing */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
                <Link to="/" className="flex-1">
                    <Button variant="outline" size="md" className="w-full whitespace-nowrap flex items-center justify-center gap-2">
                        <Home size={18} />
                        Back Home
                    </Button>
                </Link>
                <Link to="/shop" className="flex-1">
                    <Button variant="primary" size="md" className="w-full whitespace-nowrap flex items-center justify-center gap-2 shadow-lg shadow-brand/20">
                        <ShoppingBag size={18} />
                        Start Shopping
                    </Button>
                </Link>
            </div>
        </div>
    );
};
