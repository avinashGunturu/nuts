import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const COLLECTIONS = [
  {
    id: 1,
    title: "The Royal Cashew Edit",
    description: "From roasted W320s to spicy masala flavors.",
    image: "https://images.unsplash.com/photo-1621446702588-0f8c85c34458?q=80&w=1200",
    link: "/shop"
  },
  {
    id: 2,
    title: "Kashmiri Walnuts & Almonds",
    description: "Straight from the valleys to your table.",
    image: "https://images.unsplash.com/photo-1626838382103-176311815599?q=80&w=1200",
    link: "/shop"
  },
  {
    id: 3,
    title: "Exotic Dried Fruits",
    description: "Afghan figs, Turkish apricots, and more.",
    image: "https://images.unsplash.com/photo-1616428753063-8756c2211424?q=80&w=1200",
    link: "/shop"
  },
  {
    id: 4,
    title: "Healthy Snack Packs",
    description: "Daily nutrition in convenient pouches.",
    image: "https://images.unsplash.com/photo-1606925207923-c580f25966b5?q=80&w=1200",
    link: "/shop"
  }
];

export const Collections: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 md:py-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 max-w-2xl">
          <span className="text-brand font-bold tracking-widest uppercase text-xs mb-3 block">Curated Selections</span>
          <h1 className="text-heading-2 md:text-heading-1 text-neutral-900">Collections</h1>
          <p className="text-neutral-500 mt-4 text-lg">Browse our products by range. Each collection is thoughtfully curated to suit specific tastes and needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {COLLECTIONS.map((col) => (
             <Link key={col.id} to={col.link} className="group relative aspect-video md:aspect-[16/10] overflow-hidden rounded-3xl">
                <img 
                  src={col.image} 
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <h3 className="text-3xl font-bold text-white mb-2">{col.title}</h3>
                  <p className="text-neutral-300 mb-6 max-w-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    {col.description}
                  </p>
                  <div className="flex items-center gap-2 text-white font-bold uppercase tracking-wider text-sm group-hover:text-brand-light transition-colors">
                    Explore Collection <ArrowRight size={18} />
                  </div>
                </div>
             </Link>
           ))}
        </div>
      </div>
    </div>
  );
};