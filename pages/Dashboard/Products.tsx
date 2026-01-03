import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
   Plus,
   Search,
   Filter,
   Edit3,
   Trash2,
   Eye,
   ChevronLeft,
   ChevronRight,
   Package,
   AlertCircle,
   X,
   Star,
   ShoppingBag
} from 'lucide-react';
import { Button } from '../../components/Button';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { Modal } from '../../components/Modal';

export const AdminProducts: React.FC = () => {
   const [products, setProducts] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Filters & Pagination State
   const [searchTerm, setSearchTerm] = useState('');
   const [categoryFilter, setCategoryFilter] = useState('All Categories');
   const [page, setPage] = useState(1);
   const [limit] = useState(10);
   const [totalPages, setTotalPages] = useState(1);
   const [totalItems, setTotalItems] = useState(0);

   const [previewProduct, setPreviewProduct] = useState<any | null>(null);

   // Modal & Delete State
   const [modalConfig, setModalConfig] = useState({
      isOpen: false,
      title: '',
      message: '',
      type: 'info' as 'success' | 'error' | 'info' | 'warning',
      onAction: () => { },
      actionLabel: 'OK'
   });
   const [productToDelete, setProductToDelete] = useState<string | null>(null);

   // New Filter State
   const [statusFilter, setStatusFilter] = useState('all');
   const [showFilters, setShowFilters] = useState(false);
   const [refresher, setRefresher] = useState(0);
   const [isDeleting, setIsDeleting] = useState(false);

   const categories = ['All Categories', 'Cashews', 'Almonds', 'Walnuts', 'Pistachios', 'Nut Butters', 'Dried Fruit', 'Mixes'];

   // Fetch Products
   useEffect(() => {
      const fetchProducts = async () => {
         setIsLoading(true);
         setError(null);
         try {
            const filters: any = {};
            if (categoryFilter !== 'All Categories') filters.category = categoryFilter;
            if (searchTerm) filters.name = searchTerm;
            if (statusFilter !== 'all') filters.isActive = statusFilter === 'active';
            // If 'all', we don't send isActive, backend handles it if we fixed it, 
            // or we send 'all' if backend expects it. 
            // Previous fix to backend allows skipping query.isActive if not present or 'all'.
            // However, Products.tsx previous partial edit passed `filters.isActive = 'all'` 
            // so we should match that logic if backend expects it.
            // Let's pass it if statusFilter is 'all'.
            if (statusFilter === 'all') filters.isActive = 'all';

            const result = await productService.getProducts(page, limit, filters);

            if (result.success && result.data) {
               setProducts(result.data.products);
               setTotalPages(result.data.pages);
               setTotalItems(result.data.total);
            }
         } catch (err: any) {
            console.error('Failed to fetch products:', err);
            setError('Failed to load products. please try again.');
         } finally {
            setIsLoading(false);
         }
      };

      // Debounce search
      const timer = setTimeout(() => {
         fetchProducts();
      }, 500);

      return () => clearTimeout(timer);
   }, [page, searchTerm, categoryFilter, limit, statusFilter, refresher]);

   // Reset page when filters change
   useEffect(() => {
      setPage(1);
   }, [searchTerm, categoryFilter, statusFilter]);

   const handleDeleteClick = (id: string) => {
      setProductToDelete(id);
      setModalConfig({
         isOpen: true,
         title: 'Delete Product',
         message: 'Are you sure you want to delete this product? This action cannot be undone.',
         type: 'warning',
         actionLabel: 'Delete',
         onAction: () => handleConfirmDelete(id)
      });
   };

   const handleConfirmDelete = async (id: string) => {
      try {
         setIsDeleting(true);
         const result = await productService.deleteProduct(id);
         if (result.success) {
            // Invalidate the shop page cache after deletion
            productService.invalidateProductCache();
            setIsDeleting(false);
            setModalConfig({
               isOpen: true,
               title: 'Success',
               message: 'Product deleted successfully',
               type: 'success',
               actionLabel: 'OK',
               onAction: () => {
                  setModalConfig(prev => ({ ...prev, isOpen: false }));
                  setRefresher(prev => prev + 1);
               }
            });
         }
      } catch (error: any) {
         setIsDeleting(false);
         setModalConfig({
            isOpen: true,
            title: 'Error',
            message: error.message || 'Failed to delete product',
            type: 'error',
            actionLabel: 'Close',
            onAction: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
         });
      }
   };

   return (
      <div className="space-y-8 animate-fade-in">
         <Modal
            isOpen={modalConfig.isOpen}
            onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            title={modalConfig.title}
            message={modalConfig.message}
            type={modalConfig.type}
            onAction={modalConfig.onAction}
            actionLabel={modalConfig.actionLabel}
            isLoading={isDeleting}
         />
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Product Inventory</h1>
               <p className="text-neutral-500 mt-2 font-medium">Manage your harvest catalog, pricing, and stock levels.</p>
            </div>
            <Link to="/dashboard/products/add">
               <Button variant="black" size="md" className="flex items-center gap-2 shadow-xl shadow-neutral-900/10">
                  <Plus size={20} /> Add New Product
               </Button>
            </Link>
         </div>

         {/* Filters Bar */}
         <div className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
               <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-neutral-50 border border-neutral-100 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex gap-3">
               <select
                  className="bg-neutral-50 border border-neutral-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-brand transition-all appearance-none pr-10 relative cursor-pointer"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
               >
                  {categories.map(cat => <option key={cat}>{cat}</option>)}
               </select>
               <Button
                  variant="outline"
                  size="sm"
                  className={`flex items-center gap-2 ${showFilters ? 'bg-brand-50 border-brand text-brand' : 'bg-white'}`}
                  onClick={() => setShowFilters(!showFilters)}
               >
                  <Filter size={16} /> Filters
               </Button>
            </div>
         </div>

         {/* Expanded Filters Panel */}
         {showFilters && (
            <div className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm animate-fade-in-up grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest pl-1">Status</label>
                  <div className="flex bg-neutral-50 p-1 rounded-xl border border-neutral-100">
                     {['all', 'active', 'inactive'].map((status) => (
                        <button
                           key={status}
                           onClick={() => setStatusFilter(status)}
                           className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${statusFilter === status
                              ? 'bg-white text-neutral-900 shadow-sm'
                              : 'text-neutral-400 hover:text-neutral-600'
                              }`}
                        >
                           {status}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* Table Container */}
         <div className="bg-white rounded-[40px] border border-neutral-100 shadow-sm overflow-hidden">
            {isLoading ? (
               <div className="p-20 text-center text-neutral-400 font-medium">Loading products...</div>
            ) : error ? (
               <div className="p-20 text-center text-red-500 font-medium">{error}</div>
            ) : (
               <>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-neutral-50/50">
                              <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Product</th>
                              <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Category</th>
                              <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Price (Base)</th>
                              <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Stock</th>
                              <th className="px-6 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Status</th>
                              <th className="px-10 py-6 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                           {products.map((product) => {
                              // Logic to determine main price and stock from variants if needed
                              // For listing, we can just take the first variant or aggregated info
                              const firstVariant = product.variants?.[0] || {};
                              const price = firstVariant.price || 0;
                              const weight = firstVariant.weight || 'N/A';

                              // Sum stock across all variants for display
                              const totalStock = product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;

                              const isLowStock = totalStock < 50;
                              const isOutOfStock = totalStock === 0;

                              const mainImage = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url || '';

                              return (
                                 <tr key={product._id} className="hover:bg-neutral-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                       <div className="flex items-center gap-5">
                                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50 flex-shrink-0">
                                             {mainImage && <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />}
                                          </div>
                                          <div>
                                             <h4 className="text-sm font-bold text-neutral-900 group-hover:text-brand transition-colors">{product.name}</h4>
                                             <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1">ID: ...{product._id.slice(-6)}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-6">
                                       <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-lg uppercase tracking-wider">
                                          {product.category}
                                       </span>
                                    </td>
                                    <td className="px-6 py-6">
                                       <div className="flex flex-col">
                                          <span className="text-sm font-bold text-neutral-900">₹{price.toLocaleString('en-IN')}</span>
                                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">per {weight}</span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-6">
                                       <div className="flex items-center gap-2">
                                          <span className={`text-sm font-bold ${isOutOfStock ? 'text-error' : isLowStock ? 'text-orange-600' : 'text-neutral-900'}`}>
                                             {totalStock} units
                                          </span>
                                          {isLowStock && !isOutOfStock && <AlertCircle size={14} className="text-orange-500" />}
                                       </div>
                                    </td>
                                    <td className="px-6 py-6">
                                       <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${!product.isActive ? 'bg-neutral-100 text-neutral-400' :
                                          isOutOfStock ? 'bg-error-bg text-error' :
                                             isLowStock ? 'bg-orange-50 text-orange-600' :
                                                'bg-success-bg text-success'
                                          }`}>
                                          {!product.isActive ? 'Inactive' : isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'Active'}
                                       </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                       <div className="flex justify-end gap-2 items-center">
                                          {/* Quick View Button */}
                                          <button
                                             onClick={() => setPreviewProduct(product)}
                                             className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-400 hover:text-brand hover:bg-brand-50 flex items-center justify-center transition-all"
                                             title="View Details"
                                          >
                                             <Eye size={18} />
                                          </button>

                                          {/* Edit Product */}
                                          <Link to={`/dashboard/products/edit/${product._id}`}>
                                             <button className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-400 hover:text-brand hover:bg-brand-50 flex items-center justify-center transition-all" title="Edit Product">
                                                <Edit3 size={18} />
                                             </button>
                                          </Link>

                                          {/* Delete Product */}
                                          <button
                                             onClick={() => handleDeleteClick(product._id)}
                                             className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-400 hover:text-error hover:bg-error-bg flex items-center justify-center transition-all"
                                             title="Delete Product"
                                          >
                                             <Trash2 size={18} />
                                          </button>
                                       </div>
                                    </td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="px-10 py-8 bg-neutral-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
                     <p className="text-sm text-neutral-500 font-medium">
                        Showing <span className="text-neutral-900 font-bold">{((page - 1) * limit) + 1} to {Math.min(page * limit, totalItems)}</span> of <span className="text-neutral-900 font-bold">{totalItems}</span> entries
                     </p>
                     <div className="flex items-center gap-4">
                        <button
                           onClick={() => setPage(p => Math.max(1, p - 1))}
                           disabled={page === 1}
                           className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                           <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-neutral-600">
                              From {totalPages} Pages
                           </span>
                        </div>
                        <button
                           onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                           disabled={page === totalPages}
                           className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-brand disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                           <ChevronRight size={20} />
                        </button>
                     </div>
                  </div>
               </>
            )}
         </div>

         {/* Empty State */}
         {!isLoading && !error && products.length === 0 && (
            <div className="bg-white p-32 rounded-[40px] border border-dashed border-neutral-200 text-center">
               <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                  <Package size={48} />
               </div>
               <h3 className="text-2xl font-bold text-neutral-900 mb-2">No products found</h3>
               <p className="text-neutral-500 mb-8">Try adjusting your search or filters to find what you're looking for.</p>
               <Button variant="outline" onClick={() => { setSearchTerm(''); setCategoryFilter('All Categories'); }}>
                  Reset Filters
               </Button>
            </div>
         )}

         {/* Quick View Modal */}
         {previewProduct && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
               <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md animate-fade-in" onClick={() => setPreviewProduct(null)}></div>

               <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-overlay animate-fade-in-up flex flex-col md:flex-row">
                  <button
                     onClick={() => setPreviewProduct(null)}
                     className="absolute top-6 right-6 w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-900 hover:text-white transition-all z-20"
                  >
                     <X size={24} />
                  </button>

                  {/* Real Look Image Section */}
                  <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-full bg-neutral-50 p-6">
                     <div className="w-full h-full rounded-[32px] overflow-hidden shadow-sm relative group">
                        <img
                           src={previewProduct.images?.find((img: any) => img.isPrimary)?.url || previewProduct.images?.[0]?.url || ''}
                           alt={previewProduct.name}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {previewProduct.isNew && (
                           <span className="absolute top-6 left-6 bg-brand text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">New Arrival</span>
                        )}
                     </div>
                  </div>

                  {/* Details Section */}
                  <div className="w-full md:w-1/2 p-8 md:p-12">
                     <div className="mb-4">
                        <p className="text-xs font-bold text-brand uppercase tracking-[0.2em] mb-2">{previewProduct.category}</p>
                        <h2 className="text-4xl font-bold text-neutral-900 leading-tight">{previewProduct.name}</h2>
                     </div>

                     <div className="flex items-center gap-3 mb-8">
                        <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1 rounded-lg">
                           <Star size={16} className="text-warning fill-warning" />
                           <span className="text-sm font-bold text-neutral-900">{previewProduct.rating || 0}</span>
                        </div>
                        <span className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Premium Grade</span>
                     </div>

                     <div className="mb-8">
                        <div className="flex items-baseline gap-2">
                           <span className="text-4xl font-bold text-neutral-900">
                              ₹{(previewProduct.variants?.[0]?.price || 0).toLocaleString('en-IN')}
                           </span>
                           <span className="text-neutral-400 text-lg">/ {previewProduct.variants?.[0]?.weight || 'N/A'}</span>
                        </div>
                        <p className="text-xs text-neutral-400 font-bold mt-1">Suggested Selling Price</p>
                     </div>

                     <div className="space-y-6 mb-10">
                        <p className="text-neutral-600 leading-relaxed font-light text-lg">
                           {previewProduct.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">Total Stock</p>
                              <p className="text-lg font-bold text-neutral-900">
                                 {previewProduct.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0)} Units
                              </p>
                           </div>
                           <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-1">Status</p>
                              <p className={`text-lg font-bold ${previewProduct.isActive ? 'text-success' : 'text-neutral-400'}`}>
                                 {previewProduct.isActive ? 'Active' : 'Inactive'}
                              </p>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <Link to={`/dashboard/products/edit/${previewProduct._id}`} className="flex-1">
                           <Button className="w-full">Edit Product</Button>
                        </Link>
                        {/* <Link to={`/product/${previewProduct._id}`} target="_blank">
                        <Button variant="outline" className="px-6">
                           <ExternalLinkIcon className="w-5 h-5" />
                        </Button>
                     </Link> */}
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

const ExternalLinkIcon = ({ className }: { className?: string }) => (
   <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
);