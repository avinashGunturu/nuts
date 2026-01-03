import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Image as ImageIcon, Plus, Info, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { productService } from '../../services/productService';
import { API_CONFIG } from '../../config';
import { Modal } from '../../components/Modal';

interface Variant {
   weight: string;
   price: string;
   discountedPrice?: string;
   wholesalePrice?: string; // Optional/Hidden for now
   stock: string;
   sku: string;
}

interface Highlight {
   text: string;
   color: string;
   icon?: string;
}

interface Benefit {
   title: string;
   description: string;
   icon?: string;
}

interface NutritionalItem {
   key: string;
   value: string;
}

interface ImageFile {
   file?: File;
   previewUrl: string;
   isPrimary: boolean;
   alt: string;
   url?: string;
   _id?: string;
}

interface Review {
   reviewerName: string;
   rating: string;
   comment: string;
}

export const AddProduct: React.FC = () => {
   const navigate = useNavigate();
   const { id } = useParams();
   const isEditMode = !!id;
   const [isLoading, setIsLoading] = useState(false);

   // Modal State
   const [modalConfig, setModalConfig] = useState({
      isOpen: false,
      title: '',
      message: '',
      type: 'info' as 'success' | 'error' | 'info',
      onAction: () => { }
   });

   const handleCloseModal = () => {
      setModalConfig({ ...modalConfig, isOpen: false });
   };

   // Basic Info
   const [name, setName] = useState('');
   const [description, setDescription] = useState('');
   const [category, setCategory] = useState('Cashews');
   const [availableFor, setAvailableFor] = useState<string[]>(['customer']);
   const [isActive, setIsActive] = useState(true);
   const [rating, setRating] = useState('0');

   // Dynamic Fields
   const [variants, setVariants] = useState<Variant[]>([
      { weight: '500g', price: '', discountedPrice: '', stock: '', sku: '' }
   ]);
   const [images, setImages] = useState<ImageFile[]>([]);
   const [highlights, setHighlights] = useState<Highlight[]>([{ text: '', color: '#000000', icon: '' }]);
   const [benefits, setBenefits] = useState<Benefit[]>([{ title: '', description: '', icon: '' }]);
   const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalItem[]>([{ key: '', value: '' }]);
   const [reviews, setReviews] = useState<Review[]>([]);

   const categoryOptions = ['Cashews', 'Almonds', 'Walnuts', 'Pistachios', 'Dried Fruit', 'Mixes', 'Nut Butters'];
   const weightOptions = ['250g', '500g', '1kg', '2kg', '5kg', '10kg'];
   const iconOptions = ['Leaf', 'Heart', 'Shield', 'Award', 'Zap', 'Star'];
   const nutrientOptions = ['Calories', 'Protein', 'Total Fat', 'Saturated Fat', 'Total Carbohydrates', 'Sugar', 'Dietary Fiber', 'Sodium', 'Calcium', 'Iron', 'Vitamin D'];

   // Fetch Product Data if Edit Mode
   useEffect(() => {
      if (isEditMode && id) {
         setIsLoading(true);
         const fetchProduct = async () => {
            try {
               const result = await productService.getProduct(id);
               if (result.success && result.data) {
                  const p = result.data;
                  setName(p.name);
                  setDescription(p.description);
                  setCategory(p.category);
                  setAvailableFor(p.availableFor || ['customer']);
                  setIsActive(p.isActive);
                  setRating(p.rating?.toString() || '0');

                  // Map Variants
                  if (p.variants && p.variants.length > 0) {
                     setVariants(p.variants.map((v: any) => ({
                        weight: v.weight,
                        price: v.price.toString(),
                        discountedPrice: v.discountedPrice?.toString() || '',
                        stock: v.stock.toString(),
                        sku: v.sku
                     })));
                  }

                  // Map Images
                  if (p.images && p.images.length > 0) {
                     setImages(p.images.map((img: any) => ({
                        previewUrl: img.url,
                        isPrimary: img.isPrimary,
                        alt: img.alt,
                        url: img.url,
                        _id: img._id
                     })));
                  }

                  // Map Highlights
                  if (p.highlights && p.highlights.length > 0) {
                     setHighlights(p.highlights.map((h: any) => ({ text: h.text, color: h.color, icon: h.icon || '' })));
                  }

                  // Map Benefits
                  if (p.benefits && p.benefits.length > 0) {
                     setBenefits(p.benefits.map((b: any) => ({ title: b.title, description: b.description, icon: b.icon || '' })));
                  }

                  // Map Nutritional Info
                  if (p.nutritionalInfo) {
                     const info = Object.entries(p.nutritionalInfo).map(([key, value]) => ({ key, value: value as string }));
                     if (info.length > 0) setNutritionalInfo(info);
                  }

                  // Map Reviews
                  if (p.reviews && p.reviews.length > 0) {
                     setReviews(p.reviews.map((r: any) => ({
                        reviewerName: r.reviewerName || '',
                        rating: r.rating?.toString() || '5',
                        comment: r.comment || ''
                     })));
                  }
               }
            } catch (error) {
               console.error('Failed to fetch product:', error);
               setModalConfig({
                  isOpen: true,
                  title: 'Error',
                  message: 'Failed to load product details.',
                  type: 'error',
                  onAction: () => navigate('/dashboard/products')
               });
            } finally {
               setIsLoading(false);
            }
         };
         fetchProduct();
      }
   }, [id, isEditMode, navigate]);

   // Handlers
   const addVariant = () => setVariants([...variants, { weight: '500g', price: '', discountedPrice: '', stock: '', sku: '' }]);
   const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));
   const updateVariant = (index: number, field: keyof Variant, value: string) => {
      const newVariants = [...variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      setVariants(newVariants);
   };

   const addHighlight = () => setHighlights([...highlights, { text: '', color: '#000000', icon: '' }]);
   const removeHighlight = (index: number) => setHighlights(highlights.filter((_, i) => i !== index));
   const updateHighlight = (index: number, field: keyof Highlight, value: string) => {
      const newHighlights = [...highlights];
      newHighlights[index] = { ...newHighlights[index], [field]: value };
      setHighlights(newHighlights);
   };

   const addBenefit = () => setBenefits([...benefits, { title: '', description: '', icon: '' }]);
   const removeBenefit = (index: number) => setBenefits(benefits.filter((_, i) => i !== index));
   const updateBenefit = (index: number, field: keyof Benefit, value: string) => {
      const newBenefits = [...benefits];
      newBenefits[index] = { ...newBenefits[index], [field]: value };
      setBenefits(newBenefits);
   };

   const addNutritionalItem = () => setNutritionalInfo([...nutritionalInfo, { key: '', value: '' }]);
   const removeNutritionalItem = (index: number) => setNutritionalInfo(nutritionalInfo.filter((_, i) => i !== index));
   const updateNutritionalItem = (index: number, field: keyof NutritionalItem, value: string) => {
      const newInfo = [...nutritionalInfo];
      newInfo[index] = { ...newInfo[index], [field]: value };
      setNutritionalInfo(newInfo);
   };

   const addReview = () => setReviews([...reviews, { reviewerName: '', rating: '5', comment: '' }]);
   const removeReview = (index: number) => setReviews(reviews.filter((_, i) => i !== index));
   const updateReview = (index: number, field: keyof Review, value: string) => {
      const newReviews = [...reviews];
      newReviews[index] = { ...newReviews[index], [field]: value };
      setReviews(newReviews);
   };

   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         const newImages: ImageFile[] = Array.from(e.target.files).map((file: File, index) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            isPrimary: images.length === 0 && index === 0,
            alt: name || 'Product Image'
         }));
         setImages([...images, ...newImages]);
      }
   };

   const removeImage = (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      if (images[index].isPrimary && newImages.length > 0) newImages[0].isPrimary = true;
      setImages(newImages);
   };

   const setPrimaryImage = (index: number) => {
      const newImages = images.map((img, i) => ({ ...img, isPrimary: i === index }));
      setImages(newImages);
   };

   const toggleAvailableFor = (role: string) => {
      if (availableFor.includes(role)) setAvailableFor(availableFor.filter(r => r !== role));
      else setAvailableFor([...availableFor, role]);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const uploadedImages = await Promise.all(
            images.map(async (img) => {
               if (img.file) {
                  const uploadRes = await productService.uploadImage(img.file);
                  if (uploadRes.success) {
                     return { url: uploadRes.data.url, alt: img.alt, isPrimary: img.isPrimary };
                  }
               } else if (img.url) {
                  return { url: img.url, alt: img.alt, isPrimary: img.isPrimary, _id: img._id };
               }
               return null;
            })
         );

         const validUploadedImages = uploadedImages.filter(img => img !== null);
         const processedNutritionalInfo = nutritionalInfo.reduce((acc, item) => {
            if (item.key && item.value) acc[item.key] = item.value;
            return acc;
         }, {} as Record<string, string>);

         const payload = {
            name,
            description,
            category,
            rating: Number(rating),
            variants: variants.map(v => ({
               ...v,
               price: Number(v.price),
               discountedPrice: v.discountedPrice ? Number(v.discountedPrice) : undefined,
               stock: Number(v.stock)
            })),
            images: validUploadedImages,
            highlights,
            benefits,
            nutritionalInfo: processedNutritionalInfo,
            availableFor,
            isActive,
            reviews: reviews.filter(r => r.reviewerName && r.comment).map(r => ({
               reviewerName: r.reviewerName,
               rating: Number(r.rating),
               comment: r.comment,
               date: new Date()
            }))
         };

         if (isEditMode && id) {
            await productService.updateProduct(id, payload);
            setModalConfig({
               isOpen: true,
               title: 'Success!',
               message: 'Product has been updated successfully.',
               type: 'success',
               onAction: () => navigate('/dashboard/products')
            });
         } else {
            await productService.createProduct(payload);
            setModalConfig({
               isOpen: true,
               title: 'Success!',
               message: 'Product has been created successfully.',
               type: 'success',
               onAction: () => navigate('/dashboard/products')
            });
         }
      } catch (error: any) {
         console.error('Failed to save product:', error);
         setModalConfig({
            isOpen: true,
            title: 'Error',
            message: error.message || 'Failed to save product. Please try again.',
            type: 'error',
            onAction: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
         });
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-24">
         <Modal
            isOpen={modalConfig.isOpen}
            onClose={handleCloseModal}
            title={modalConfig.title}
            message={modalConfig.message}
            type={modalConfig.type}
            onAction={modalConfig.onAction}
            actionLabel={modalConfig.type === 'success' ? 'Go to Products' : 'Try Again'}
         />
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <Link to="/dashboard/products" className="flex items-center gap-2 text-neutral-400 hover:text-brand transition-colors text-sm font-bold uppercase tracking-widest mb-4">
                  <ArrowLeft size={16} /> Back to Inventory
               </Link>
               <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            </div>
            <div className="flex items-center gap-4">
               <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/products')}>Cancel</Button>
               <Button variant="black" size="md" className="shadow-xl shadow-neutral-900/10" onClick={handleSubmit} isLoading={isLoading}>
                  <Save size={18} className="mr-2" /> Save
               </Button>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Details Column */}
            <div className="lg:col-span-2 space-y-8">
               {/* General Info */}
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
                        <input type="text" required className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-base font-medium"
                           placeholder="e.g. Royal Jumbo W240 Cashews" value={name} onChange={(e) => setName(e.target.value)} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Category</label>
                        <select className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-base font-medium appearance-none cursor-pointer"
                           value={category} onChange={(e) => setCategory(e.target.value)}>
                           {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Product Description</label>
                        <textarea rows={6} required className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-base font-medium resize-none"
                           placeholder="Explain the origin, taste profile, and nutritional benefits..." value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                     </div>
                  </div>
               </div>

               {/* Variants */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10 space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-neutral-50">
                     <h3 className="text-xl font-bold text-neutral-900">Product Variants</h3>
                     <Button type="button" variant="outline" size="sm" onClick={addVariant}><Plus size={16} className="mr-2" /> Add Variant</Button>
                  </div>
                  <div className="space-y-6">
                     {variants.map((variant, index) => (
                        <div key={index} className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100 space-y-4 relative">
                           {variants.length > 1 && (
                              <button type="button" onClick={() => removeVariant(index)} className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                           )}
                           <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Weight/Size</label>
                                 <select className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none bg-white appearance-none cursor-pointer"
                                    value={variant.weight} onChange={(e) => updateVariant(index, 'weight', e.target.value)}>
                                    {weightOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                 </select>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Price (₹)</label>
                                 <input type="number" placeholder="0.00" className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none"
                                    value={variant.price} onChange={(e) => updateVariant(index, 'price', e.target.value)} required />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Discount (₹)</label>
                                 <input type="number" placeholder="0.00" className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none"
                                    value={variant.discountedPrice || ''} onChange={(e) => updateVariant(index, 'discountedPrice', e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Stock</label>
                                 <input type="number" placeholder="0" className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none"
                                    value={variant.stock} onChange={(e) => updateVariant(index, 'stock', e.target.value)} required />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">SKU</label>
                                 <input type="text" placeholder="SKU-123" className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none"
                                    value={variant.sku} onChange={(e) => updateVariant(index, 'sku', e.target.value)} required />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Nutritional Info */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10 space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-neutral-50">
                     <div>
                        <h3 className="text-xl font-bold text-neutral-900">Nutritional Info</h3>
                        <p className="text-sm text-neutral-400 font-medium mt-1">Values should be measured per <span className="text-neutral-800 font-bold">100g</span> serving.</p>
                     </div>
                     <Button type="button" variant="outline" size="sm" onClick={addNutritionalItem}><Plus size={16} className="mr-2" /> Add Nutrient</Button>
                  </div>
                  <div className="space-y-4">
                     {nutritionalInfo.map((item, index) => (
                        <div key={index} className="flex gap-4 items-end">
                           <div className="flex-1 space-y-1">
                              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nutrient</label>
                              <select className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none bg-white appearance-none cursor-pointer"
                                 value={item.key} onChange={(e) => updateNutritionalItem(index, 'key', e.target.value)}>
                                 <option value="" disabled>Select Nutrient</option>
                                 {nutrientOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                           </div>
                           <div className="flex-1 space-y-1">
                              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Value (per 100g)</label>
                              <input type="text" placeholder="e.g. 20g" className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none"
                                 value={item.value} onChange={(e) => updateNutritionalItem(index, 'value', e.target.value)} />
                           </div>
                           <button type="button" onClick={() => removeNutritionalItem(index)} className="p-3 text-neutral-400 hover:text-red-500"><Trash2 size={18} /></button>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Highlights */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10 space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-neutral-50">
                     <h3 className="text-xl font-bold text-neutral-900">Highlights</h3>
                     <Button type="button" variant="outline" size="sm" onClick={addHighlight}><Plus size={16} className="mr-2" /> Add Highlight</Button>
                  </div>
                  <div className="space-y-4">
                     {highlights.map((highlight, index) => (
                        <div key={index} className="flex gap-4 items-end">
                           <div className="flex-1 space-y-1">
                              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Text</label>
                              <input type="text" placeholder="e.g. 100% Natural" className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none"
                                 value={highlight.text} onChange={(e) => updateHighlight(index, 'text', e.target.value)} />
                           </div>
                           <div className="w-32 space-y-1">
                              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Icon</label>
                              <select className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none bg-white appearance-none cursor-pointer"
                                 value={highlight.icon || ''} onChange={(e) => updateHighlight(index, 'icon', e.target.value)}>
                                 <option value="">None</option>
                                 {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                              </select>
                           </div>
                           <div className="w-24 space-y-1">
                              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Color</label>
                              <div className="flex items-center gap-2 p-3 rounded-xl border border-neutral-200">
                                 <input type="color" className="w-6 h-6 rounded overflow-hidden" value={highlight.color} onChange={(e) => updateHighlight(index, 'color', e.target.value)} />
                              </div>
                           </div>
                           <button type="button" onClick={() => removeHighlight(index)} className="p-3 text-neutral-400 hover:text-red-500"><Trash2 size={18} /></button>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Benefits */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10 space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-neutral-50">
                     <h3 className="text-xl font-bold text-neutral-900">Benefits</h3>
                     <Button type="button" variant="outline" size="sm" onClick={addBenefit}><Plus size={16} className="mr-2" /> Add Benefit</Button>
                  </div>
                  <div className="space-y-4">
                     {benefits.map((benefit, index) => (
                        <div key={index} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-3 relative">
                           <button type="button" onClick={() => removeBenefit(index)} className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"><Trash2 size={16} /></button>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-1 space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Icon</label>
                                 <select className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none bg-white appearance-none cursor-pointer"
                                    value={benefit.icon || ''} onChange={(e) => updateBenefit(index, 'icon', e.target.value)}>
                                    <option value="">None</option>
                                    {iconOptions.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                 </select>
                              </div>
                              <div className="md:col-span-2 space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Title</label>
                                 <input type="text" placeholder="e.g. High Protein" className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none"
                                    value={benefit.title} onChange={(e) => updateBenefit(index, 'title', e.target.value)} />
                              </div>
                              <div className="md:col-span-3 space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Description</label>
                                 <input type="text" placeholder="Description of the benefit" className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none"
                                    value={benefit.description} onChange={(e) => updateBenefit(index, 'description', e.target.value)} />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Reviews */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-10 space-y-8">
                  <div className="flex items-center justify-between pb-6 border-b border-neutral-50">
                     <div>
                        <h3 className="text-xl font-bold text-neutral-900">Customer Reviews</h3>
                        <p className="text-sm text-neutral-400 mt-1">Add seed reviews to boost product authenticity</p>
                     </div>
                     <Button type="button" variant="outline" size="sm" onClick={addReview}><Plus size={16} className="mr-2" /> Add Review</Button>
                  </div>
                  <div className="space-y-4">
                     {reviews.length === 0 && (
                        <div className="text-center py-8 text-neutral-400">
                           <p className="text-sm">No reviews added yet. Click "Add Review" to create seed reviews.</p>
                        </div>
                     )}
                     {reviews.map((review, index) => (
                        <div key={index} className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4 relative">
                           <button type="button" onClick={() => removeReview(index)} className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"><Trash2 size={16} /></button>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-2 space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Reviewer Name</label>
                                 <input type="text" placeholder="e.g. Priya Sharma" className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none"
                                    value={review.reviewerName} onChange={(e) => updateReview(index, 'reviewerName', e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Rating</label>
                                 <select className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none bg-white appearance-none cursor-pointer"
                                    value={review.rating} onChange={(e) => updateReview(index, 'rating', e.target.value)}>
                                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                    <option value="4">⭐⭐⭐⭐ (4)</option>
                                    <option value="3">⭐⭐⭐ (3)</option>
                                    <option value="2">⭐⭐ (2)</option>
                                    <option value="1">⭐ (1)</option>
                                 </select>
                              </div>
                              <div className="md:col-span-3 space-y-1">
                                 <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Review Comment</label>
                                 <textarea placeholder="Write a review comment..." rows={3} className="w-full p-3 rounded-xl border border-neutral-200 focus:border-brand outline-none resize-none"
                                    value={review.comment} onChange={(e) => updateReview(index, 'comment', e.target.value)} />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-8">
               {/* Status Card */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
                  <h3 className="text-lg font-bold text-neutral-900 mb-6">Product Status</h3>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                     <span className="font-bold text-sm uppercase tracking-wider">Active</span>
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand"></div>
                     </label>
                  </div>

                  <div className="space-y-2 mt-6">
                     <label className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] ml-1">Rating</label>
                     <input type="number" min="0" max="5" step="0.1" className="w-full px-6 py-4 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-base font-medium"
                        value={rating} onChange={(e) => setRating(e.target.value)} />
                  </div>
               </div>

               {/* Availability Card */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
                  <h3 className="text-lg font-bold text-neutral-900 mb-6">Available For</h3>
                  <div className="space-y-3">
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={availableFor.includes('customer')} onChange={() => toggleAvailableFor('customer')} className="w-5 h-5 rounded border-neutral-300 text-brand focus:ring-brand" />
                        <span className="font-medium text-neutral-700">Retail Customers</span>
                     </label>
                     <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={availableFor.includes('wholesale')} onChange={() => toggleAvailableFor('wholesale')} className="w-5 h-5 rounded border-neutral-300 text-brand focus:ring-brand" />
                        <span className="font-medium text-neutral-700">Wholesale Partners</span>
                     </label>
                  </div>
               </div>

               {/* Images Card */}
               <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm p-8">
                  <h3 className="text-lg font-bold text-neutral-900 mb-6">Product Images</h3>
                  <div className="space-y-4">
                     <label className="aspect-square rounded-3xl border-2 border-dashed border-neutral-100 bg-neutral-50 flex flex-col items-center justify-center p-6 text-center group hover:bg-white hover:border-brand transition-all cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-white group-hover:bg-brand-50 flex items-center justify-center text-neutral-400 group-hover:text-brand transition-colors mb-4 shadow-sm">
                           <ImageIcon size={24} />
                        </div>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest group-hover:text-neutral-900 transition-colors">Click to Upload</p>
                        <p className="text-[10px] text-neutral-300 mt-2 font-medium">JPEG, PNG up to 5MB</p>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
                     </label>

                     <div className="grid grid-cols-2 gap-3">
                        {images.map((img, index) => (
                           <div key={index} className="aspect-square rounded-2xl bg-neutral-50 border border-neutral-100 relative overflow-hidden group">
                              <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                 <button type="button" onClick={() => removeImage(index)} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50">
                                    <Trash2 size={14} />
                                 </button>
                                 <button type="button" onClick={() => setPrimaryImage(index)} className={`p-2 rounded-full ${img.isPrimary ? 'bg-brand text-white' : 'bg-white text-neutral-500'}`}>
                                    <Info size={14} />
                                 </button>
                              </div>
                              {img.isPrimary && <span className="absolute top-2 left-2 bg-brand text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Primary</span>}
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </form>
      </div>
   );
};