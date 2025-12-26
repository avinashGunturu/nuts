import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, X, Image as ImageIcon, Plus, Info, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cashews',
    basePrice: '',
    weight: '500g',
    description: '',
    stock: '',
    status: 'Published'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulated save
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard/products');
    }, 1500);
  };

  const categories = ['Cashews', 'Almonds', 'Walnuts', 'Pistachios', 'Dried Fruit', 'Mixes'];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-24">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <Link to="/dashboard/products" className="flex items-center gap-2 text-neutral-400 hover:text-brand transition-colors text-sm font-bold uppercase tracking-widest mb-4">
              <ArrowLeft size={16} /> Back to Inventory
           </Link>
           <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Add New Product</h1>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/products')}>Cancel</Button>
           <Button variant="black" size="md" className="shadow-xl shadow-neutral-900/10" onClick={handleSubmit} isLoading={isLoading}>
              <Save size={18} className="mr-2" /> Save Harvest
           </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         
         {/* Main Details Column */}
         <div className="lg:col-span-2 space-y-8">
            {/* General Info Card */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10 space-y-8">
               <div className="flex items-center gap-3 pb-6 border-b border-neutral-50">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center">
                     <Info size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">General Information</h3>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Product Name</label>
                     <input 
                       type="text" 
                       required
                       className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-base font-medium"
                       placeholder="e.g. Royal Jumbo W240 Cashews"
                       value={formData.name}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Category</label>
                        <select 
                          className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-base font-medium appearance-none cursor-pointer"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                           {categories.map(cat => <option key={cat}>{cat}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Stock Quantity</label>
                        <input 
                          type="number" 
                          required
                          className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-base font-medium"
                          placeholder="e.g. 150"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Product Description</label>
                     <textarea 
                       rows={6}
                       required
                       className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-base font-medium resize-none"
                       placeholder="Explain the origin, taste profile, and nutritional benefits..."
                       value={formData.description}
                       onChange={(e) => setFormData({...formData, description: e.target.value})}
                     ></textarea>
                  </div>
               </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10 space-y-8">
               <div className="flex items-center justify-between pb-6 border-b border-neutral-50">
                  <h3 className="text-xl font-bold text-neutral-900">Pricing & Units</h3>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Base Price (₹)</label>
                     <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₹</span>
                        <input 
                          type="number" 
                          required
                          className="w-full pl-10 pr-6 py-4 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-base font-medium"
                          placeholder="0.00"
                          value={formData.basePrice}
                          onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Base Weight</label>
                     <select 
                       className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-base font-medium appearance-none cursor-pointer"
                       value={formData.weight}
                       onChange={(e) => setFormData({...formData, weight: e.target.value})}
                     >
                        <option>250g</option>
                        <option>500g</option>
                        <option>1kg</option>
                        <option>2kg</option>
                     </select>
                  </div>
               </div>
            </div>
         </div>

         {/* Sidebar Options Column */}
         <div className="space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
               <h3 className="text-lg font-bold text-neutral-900 mb-6">Product Status</h3>
               <div className="space-y-4">
                  {['Published', 'Draft', 'Hidden'].map(status => (
                    <label key={status} className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${formData.status === status ? 'bg-brand-50 border-brand text-brand' : 'bg-neutral-50 border-neutral-100 text-neutral-500 hover:bg-neutral-100'}`}>
                       <span className="font-bold text-sm uppercase tracking-wider">{status}</span>
                       <input 
                         type="radio" 
                         name="status" 
                         className="hidden" 
                         checked={formData.status === status}
                         onChange={() => setFormData({...formData, status})}
                       />
                       {formData.status === status && <Plus size={16} className="rotate-45" />}
                    </label>
                  ))}
               </div>
            </div>

            {/* Media/Images Card */}
            <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
               <h3 className="text-lg font-bold text-neutral-900 mb-6">Product Images</h3>
               <div className="space-y-4">
                  <div className="aspect-square rounded-3xl border-2 border-dashed border-neutral-100 bg-neutral-50 flex flex-col items-center justify-center p-6 text-center group hover:bg-white hover:border-brand transition-all cursor-pointer">
                     <div className="w-12 h-12 rounded-full bg-white group-hover:bg-brand-50 flex items-center justify-center text-neutral-400 group-hover:text-brand transition-colors mb-4 shadow-sm">
                        <ImageIcon size={24} />
                     </div>
                     <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest group-hover:text-neutral-900 transition-colors">Upload Main Image</p>
                     <p className="text-[10px] text-neutral-300 mt-2 font-medium">JPEG, PNG up to 5MB</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     {[1, 2].map(i => (
                        <div key={i} className="aspect-square rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer">
                           <Plus size={20} />
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-brand rounded-[32px] p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
               <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Info size={18} /> Pro Tip
               </h4>
               <p className="text-sm text-brand-50 leading-relaxed font-light">
                  High-quality close-up shots of the nuts help customers visualize the crunch and texture, increasing conversion by up to 40%.
               </p>
            </div>
         </div>
      </form>
    </div>
  );
};