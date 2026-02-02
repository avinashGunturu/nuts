import React, { useState, useEffect } from 'react';
import { bannerService } from '../services/bannerService';
import { X, Star, Disc } from 'lucide-react';

interface BannerData {
    text: string;
    variant: 'brand' | 'dark'; // Updated type
    isActive: boolean;
    link?: string;
    linkText?: string;
    isDismissible: boolean;
}

// Optional override props for PREVIEW mode in Admin Panel
interface MarqueeBannerProps {
    overrideProps?: Partial<BannerData>;
}

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({ overrideProps }) => {
    const [banner, setBanner] = useState<BannerData | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (overrideProps) {
            // In preview mode, use the props passed directly without fetching
            const data = overrideProps as BannerData;
            // Ensure variant is valid
            const variant = (data.variant === 'brand' || data.variant === 'dark') ? data.variant : 'brand';
            setBanner({ ...data, variant });
            setIsVisible(true); // Always force visible in preview
            return;
        }

        const fetchBanner = async () => {
            const data = await bannerService.getBanner();
            if (data) {
                // Determine variant, default to 'brand' if missing/invalid
                const variant = (data.variant === 'brand' || data.variant === 'dark') ? data.variant : 'brand';
                setBanner({ ...data, variant });
            }
        };
        fetchBanner();
    }, [overrideProps]); // Re-run if overrides change (live preview)

    if (!banner) return null;
    if (!isVisible) return null;

    const { variant, text } = banner;
    const textToDisplay = text; // Just use backend text


    // Common Marquee Content Renderer
    const renderMarqueeContent = (colorClass: string, separator: React.ReactNode) => (
        <React.Fragment>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
                <span key={i} className={`${colorClass} font-bold uppercase tracking-wider text-sm flex items-center gap-6 mx-3`}>
                    {textToDisplay} {separator}
                </span>
            ))}
        </React.Fragment>
    );

    const animationDuration = `${banner.speed || 25}s`;

    return (
        <div className={`w-full h-12 relative overflow-hidden flex items-center z-[60] ${variant === 'brand' ? 'bg-brand' : 'bg-neutral-900 border-b border-white/10'}`}>
            <div className="flex-1 overflow-hidden relative h-full flex items-center">
                <div
                    className="flex items-center whitespace-nowrap animate-marquee"
                    style={{ animationDuration }}
                >
                    {/* First copy */}
                    <div className="flex items-center shrink-0">
                        {renderMarqueeContent(
                            variant === 'brand' ? 'text-white' : 'text-white font-medium tracking-widest text-xs',
                            variant === 'brand' ? <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> : <Star size={12} className="text-brand fill-brand" />
                        )}
                    </div>
                    {/* Second copy for seamless loop */}
                    <div className="flex items-center shrink-0">
                        {renderMarqueeContent(
                            variant === 'brand' ? 'text-white' : 'text-white font-medium tracking-widest text-xs',
                            variant === 'brand' ? <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> : <Star size={12} className="text-brand fill-brand" />
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors z-10"
            >
                <X size={16} className="text-white" />
            </button>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee linear infinite;
                    display: flex; /* Ensure flex layout */
                    width: fit-content; /* Allow it to grow */
                }
            `}</style>
        </div>
    );
};
