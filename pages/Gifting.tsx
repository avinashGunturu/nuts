import React from 'react';
import { Gift, Star } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export const Gifting: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero for Gifting */}
      <section className="bg-neutral-900 text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
           <div className="inline-flex items-center justify-center p-4 rounded-full bg-brand/20 text-brand-light mb-6">
             <Gift size={32} />
           </div>
           <h1 className="text-5xl md:text-7xl font-bold mb-6">The Art of Gifting</h1>
           <p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-10 font-light">
             Make every occasion memorable with our premium gift boxes. Elegant packaging, exquisite taste.
           </p>
           <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100 border-none">
             Shop Gift Boxes
           </Button>
        </div>
      </section>

      {/* Gift Boxes Display (Mock) */}
      <section className="py-24">
         <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 {
                   name: "The Festival Box",
                   price: "₹1,499",
                   image: "https://images.unsplash.com/photo-1606914506548-52327598c25e?q=80&w=800&auto=format&fit=crop",
                   desc: "Assorted nuts in a gold-foiled rigid box."
                 },
                 {
                   name: "Royal Selection",
                   price: "₹2,999",
                   image: "https://images.unsplash.com/photo-1595411425732-e69c1deb9a23?q=80&w=800&auto=format&fit=crop",
                   desc: "Premium Mamra Almonds and W320 Cashews."
                 },
                 {
                   name: "Wellness Hamper",
                   price: "₹3,499",
                   image: "https://images.unsplash.com/photo-1596328330761-46820572d421?q=80&w=800&auto=format&fit=crop",
                   desc: "A healthy mix of dried fruits, seeds, and nuts."
                 }
               ].map((box, i) => (
                 <div key={i} className="group cursor-pointer">
                    <div className="aspect-square bg-neutral-100 rounded-3xl overflow-hidden mb-6 relative">
                       <img src={box.image} alt={box.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                         Best Seller
                       </div>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">{box.name}</h3>
                    <p className="text-neutral-500 mb-4">{box.desc}</p>
                    <div className="flex items-center justify-between">
                       <span className="text-xl font-bold">{box.price}</span>
                       <Button variant="outline" size="sm">View Details</Button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Corporate Gifting CTA */}
      <section className="bg-brand-50 py-24">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
           <div className="flex-1">
             <h2 className="text-4xl font-bold text-neutral-900 mb-6">Corporate Orders</h2>
             <p className="text-lg text-neutral-600 mb-8">
               Looking for bulk gifts for your employees or clients? We offer custom branding, bulk discounts, and seamless delivery to multiple addresses.
             </p>
             <ul className="space-y-4 mb-8">
               {['Custom Logo Branding', 'Volume Discounts', 'Pan-India Shipping'].map(item => (
                 <li key={item} className="flex items-center gap-3 font-medium text-neutral-800">
                    <Star size={20} className="text-brand fill-brand" /> {item}
                 </li>
               ))}
             </ul>
             <Link to="/corporate">
                <Button>Contact Sales Team</Button>
             </Link>
           </div>
           <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop" 
                alt="Corporate Meeting" 
                className="rounded-3xl shadow-overlay"
              />
           </div>
        </div>
      </section>
    </div>
  );
};