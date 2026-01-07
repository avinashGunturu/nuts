import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Building2, Trophy, CheckCircle2, ArrowRight, Briefcase, Mail, Phone, Package, ChefHat, Store, AlertCircle, Plus, Minus } from 'lucide-react';

const WHOLESALE_FAQS = [
   {
      question: "Do you supply pan-India?",
      answer: "Yes, we dispatch across India."
   },
   {
      question: "Do you provide samples?",
      answer: "Yes, samples are available on request."
   },
   {
      question: "Are your grades consistent?",
      answer: "Yes. All kernels are factory graded and quality checked."
   },
   {
      question: "Do you offer private labeling?",
      answer: "Available for bulk orders."
   },
   {
      question: "What payment methods do you accept?",
      answer: "UPI, Net Banking, and Razorpay-secured payments."
   },
   {
      question: "What is the Minimum Order Quantity (MOQ) for wholesale?",
      answer: "For raw material bulk supply (sacks), our MOQ starts at 50kg. For packaged retail units, the MOQ is 5 master cartons per product variant."
   },
   {
      question: "Do you provide GST invoices and credit facilities?",
      answer: "Yes, we provide valid GST invoices for all B2B transactions. Credit facilities (7-15 days) are available for verified institutional partners after the first three successful prepaid transactions."
   },
   {
      question: "Can we request samples before placing a bulk order?",
      answer: "Certainly. We offer a sample kit containing 250g packs of our primary grades (W320, W240, etc.) for a nominal fee, which is fully refundable against your first bulk order exceeding 100kg."
   },
   {
      question: "Do you offer private labeling (White Label) services?",
      answer: "Yes, we provide end-to-end private labeling services including custom packaging design, nitrogen flushing, and pouch sealing for retailers and boutique brands."
   },
   {
      question: "What are your delivery timelines for bulk shipments?",
      answer: "Standard wholesale orders are dispatched within 48 hours. Transit time ranges from 3-5 days for major commercial hubs and up to 7 days for regional locations via our dedicated logistics partners."
   }
];

export const Corporate: React.FC = () => {
   const [formData, setFormData] = useState({
      companyName: '',
      businessType: 'Retail Store / Supermarket',
      gstNumber: '',
      contactName: '',
      email: '',
      phone: '',
      requirement: 'Bulk Raw Material',
      quantity: '',
      message: ''
   });

   const [errors, setErrors] = useState<Record<string, string>>({});
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isSent, setIsSent] = useState(false);
   const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

   const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

   const validateGST = (gst: string) => {
      // Strict Indian GST Regex
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      return gstRegex.test(gst);
   };

   const validateForm = () => {
      const newErrors: Record<string, string> = {};

      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
      else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[^0-9]/g, ''))) newErrors.phone = 'Invalid Indian mobile number';

      if (!formData.gstNumber.trim()) {
         newErrors.gstNumber = 'GST Number is mandatory for partnership';
      } else if (!validateGST(formData.gstNumber)) {
         newErrors.gstNumber = 'Please enter a valid 15-digit GST number (e.g., 22AAAAA0000A1Z5)';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitStatus({ type: null, message: '' });

      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
         const payload = {
            name: formData.contactName,
            email: formData.email,
            companyName: formData.companyName,
            gstNumber: formData.gstNumber,
            mobile: formData.phone,
            requirements: `Type: ${formData.requirement}, Business: ${formData.businessType}. Details: ${formData.message}`
         };

         const response = await fetch('https://nutsb.onrender.com/api/wholesale/inquiry', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
         });

         const data = await response.json();

         if (data.success) {
            setIsSent(true);
            setFormData({
               companyName: '',
               businessType: 'Retail Store / Supermarket',
               gstNumber: '',
               contactName: '',
               email: '',
               phone: '',
               requirement: 'Bulk Raw Material',
               quantity: '',
               message: ''
            });
         } else {
            setSubmitStatus({
               type: 'error',
               message: data.message || 'Failed to submit inquiry. Please try again.'
            });
         }
      } catch (error) {
         console.error('Submission error:', error);
         setSubmitStatus({
            type: 'error',
            message: 'Network error. Please check your connection and try again.'
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      // Auto-uppercase GST number
      const finalValue = name === 'gstNumber' ? value.toUpperCase() : value;

      setFormData(prev => ({ ...prev, [name]: finalValue }));

      // Clear error for the specific field being edited
      if (errors[name]) {
         setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
         });
      }
   };

   const getInputClass = (fieldName: string) => {
      const base = "w-full px-5 py-4 rounded-xl border outline-none bg-neutral-50/50 transition-all";
      return errors[fieldName]
         ? `${base} border-error focus:ring-4 focus:ring-error/10`
         : `${base} border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10`;
   };

   return (
      <div className="min-h-screen bg-white">
         {/* Hero Section */}
         <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-neutral-900 text-white">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-dark/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
               <div className="max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
                     <Briefcase size={14} className="text-brand-light" />
                     <span className="text-xs font-bold uppercase tracking-wider text-neutral-200">KCnuts B2B</span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
                     Premium Bulk <br />
                     <span className="text-brand-light">Wholesale Supply.</span>
                  </h1>

                  <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed mb-10 font-light">
                     Consistent Grade-A quality for Hotels, Restaurants, Bakeries, and Retailers. Sourced directly from farms, delivered to your business doorstep.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button variant="white" size="md" className="w-full sm:w-auto md:px-8 md:py-4 md:text-lg" onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}>
                        Request Wholesale Quote
                     </Button>
                     <div className="flex items-center gap-4 px-6 py-3 text-neutral-400 text-sm font-medium">
                        <div className="flex -space-x-2">
                           {[1, 2, 3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center text-xs">
                                 <Building2 size={12} />
                              </div>
                           ))}
                        </div>
                        <span>Partnered with 200+ Businesses</span>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Who We Supply */}
         <section className="py-24 bg-white border-b border-neutral-100">
            <div className="container mx-auto px-6 md:px-12">
               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">We Supply Cashews in Bulk To</h2>
                  <p className="text-neutral-500 text-lg">Reliable supply chains for diverse commercial needs across India.</p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {[
                     {
                        icon: Building2,
                        title: "Traders",
                        color: "bg-blue-50 text-blue-600"
                     },
                     {
                        icon: Store,
                        title: "Retail Chains",
                        color: "bg-green-50 text-green-600"
                     },
                     {
                        icon: ChefHat,
                        title: "Sweet Manufacturers",
                        color: "bg-orange-50 text-orange-600"
                     },
                     {
                        icon: Package,
                        title: "HoReCa Buyers",
                        color: "bg-purple-50 text-purple-600"
                     },
                     {
                        icon: Briefcase,
                        title: "Exporters",
                        color: "bg-teal-50 text-teal-600"
                     }
                  ].map((item, idx) => (
                     <div key={idx} className="p-6 rounded-2xl border border-neutral-100 hover:border-brand-100 hover:shadow-lg transition-all duration-300 text-center group">
                        <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 mx-auto`}>
                           <item.icon size={24} />
                        </div>
                        <h3 className="font-bold text-neutral-900">{item.title}</h3>
                     </div>
                  ))}
               </div>

               {/* MOQ Info */}
               <div className="mt-12 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-brand-50 rounded-full border border-brand-100">
                     <span className="font-bold text-brand-dark">Minimum Order Quantity (MOQ):</span>
                     <span className="text-neutral-600">Depends on grade & availability</span>
                  </div>
               </div>
            </div>
         </section>

         {/* Why Buy from Us */}
         <section className="py-24 bg-neutral-50">
            <div className="container mx-auto px-6 md:px-12">
               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Why Buy from Us?</h2>
                  <p className="text-neutral-500 text-lg">Direct from factory to your business with unmatched quality and service.</p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                     {
                        icon: Building2,
                        title: "Direct Factory Supply",
                        desc: "No middlemen, no inflated prices. Get cashews straight from our processing unit.",
                        color: "bg-brand-50 text-brand"
                     },
                     {
                        icon: CheckCircle2,
                        title: "Consistent Grading",
                        desc: "All kernels are factory graded and quality checked for uniformity.",
                        color: "bg-green-50 text-green-600"
                     },
                     {
                        icon: Trophy,
                        title: "Competitive Bulk Pricing",
                        desc: "Best-in-market prices with tiered discounts for larger orders.",
                        color: "bg-orange-50 text-orange-600"
                     },
                     {
                        icon: Package,
                        title: "Reliable Dispatch",
                        desc: "Orders dispatched within 48 hours with pan-India delivery.",
                        color: "bg-purple-50 text-purple-600"
                     }
                  ].map((item, idx) => (
                     <div key={idx} className="p-6 bg-white rounded-2xl border border-neutral-100 hover:shadow-lg transition-all duration-300">
                        <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                           <item.icon size={24} />
                        </div>
                        <h3 className="font-bold text-neutral-900 mb-2">{item.title}</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                     </div>
                  ))}
               </div>

               <div className="mt-12 text-center">
                  <Button
                     size="md"
                     className="w-full sm:w-auto md:px-8 md:py-4 md:text-lg"
                     onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                     Request Wholesale Quote
                  </Button>
               </div>
            </div>
         </section>

         {/* Available Grades & Packaging */}
         <section className="py-20 bg-white">
            <div className="container mx-auto px-6 md:px-12">
               <div className="text-center max-w-3xl mx-auto mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Available Grades & Packaging</h2>
                  <p className="text-neutral-500 text-lg">Premium quality kernels in various grades to suit your business needs.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Whole Cashews */}
                  <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                     <h3 className="font-bold text-lg text-neutral-900 mb-4 pb-3 border-b border-neutral-200">Whole Cashews</h3>
                     <ul className="space-y-2 text-neutral-600">
                        <li className="flex justify-between"><span>W180</span><span className="text-brand font-medium">Premium Jumbo</span></li>
                        <li className="flex justify-between"><span>W210</span><span className="text-brand font-medium">Large Size</span></li>
                        <li className="flex justify-between"><span>W240</span><span className="text-brand font-medium">Export Grade</span></li>
                        <li className="flex justify-between"><span>W320</span><span className="text-brand font-medium">Most Popular</span></li>
                        <li className="flex justify-between"><span>W400</span><span className="text-brand font-medium">Standard Grade</span></li>
                     </ul>
                  </div>

                  {/* Broken Cashews */}
                  <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                     <h3 className="font-bold text-lg text-neutral-900 mb-4 pb-3 border-b border-neutral-200">Broken Cashews</h3>
                     <ul className="space-y-2 text-neutral-600">
                        <li className="flex justify-between"><span>Splits</span><span className="text-brand font-medium">Half Kernels</span></li>
                        <li className="flex justify-between"><span>Pieces</span><span className="text-brand font-medium">Irregular Bits</span></li>
                     </ul>
                     <p className="text-sm text-neutral-500 mt-4">Ideal for sweets, bakery & confectionery applications.</p>
                  </div>

                  {/* Packaging Options */}
                  <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100">
                     <h3 className="font-bold text-lg text-neutral-900 mb-4 pb-3 border-b border-brand-200">Packaging Options</h3>
                     <div className="space-y-3">
                        <div>
                           <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Retail Packs</p>
                           <p className="text-neutral-700">100g, 200g, 250g, 500g, 1kg</p>
                        </div>
                        <div>
                           <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Bulk Packs</p>
                           <p className="text-neutral-700">3kg, 10kg, 20kg</p>
                        </div>
                     </div>
                     <p className="text-sm text-brand-dark font-medium mt-4">Custom packing available for bulk orders</p>
                  </div>

                  {/* Storage Info */}
                  <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                     <h3 className="font-bold text-lg text-neutral-900 mb-4 pb-3 border-b border-neutral-200">Storage & Shelf Life</h3>
                     <div className="space-y-3">
                        <div>
                           <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Shelf Life</p>
                           <p className="text-neutral-700 font-medium">Up to 12 months</p>
                        </div>
                        <div>
                           <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Storage</p>
                           <p className="text-neutral-600 text-sm">Store in a cool, dry place away from direct sunlight</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Inquiry Form Section */}
         <section id="inquiry-form" className="py-24 relative overflow-hidden bg-white">
            <div className="container mx-auto px-6 md:px-12">
               <div className="bg-white rounded-3xl md:rounded-[48px] shadow-2xl shadow-neutral-200 overflow-hidden flex flex-col lg:flex-row border border-neutral-100">

                  {/* Left: Contact Details */}
                  <div className="lg:w-2/5 bg-neutral-900 text-white p-6 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
                     <div className="absolute inset-0 bg-brand/10 opacity-50"></div>
                     <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand rounded-full blur-[80px] opacity-40"></div>

                     <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-6">Partner With Us</h3>
                        <p className="text-neutral-400 mb-12 leading-relaxed">
                           Need bulk ingredients? Fill out the form, and our wholesale manager will contact you within 24 hours with a quote.
                        </p>

                        <div className="space-y-8">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-light">
                                 <Phone size={20} />
                              </div>
                              <div>
                                 <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold mb-1">Wholesale Desk</div>
                                 <a href="tel:+919440829165" className="text-xl font-bold hover:underline">+91 94408 29165</a>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-light">
                                 <Mail size={20} />
                              </div>
                              <div>
                                 <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold mb-1">B2B Sales</div>
                                 <a href="mailto:Mahindracashewproducts@gmail.com" className="text-xl font-bold hover:underline break-all">Mahindracashewproducts@gmail.com</a>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="relative z-10 mt-12 pt-12 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                           <Trophy className="text-brand-light" size={20} />
                           <span className="font-bold">Trusted Supplier</span>
                        </div>
                        <p className="text-sm text-neutral-500">
                           "KCnuts' bulk almonds are the secret behind our best-selling croissants." - <span className="text-white">Le 15 Patisserie</span>
                        </p>
                     </div>
                  </div>

                  {/* Right: Form */}
                  <div className="lg:w-3/5 p-6 md:p-12 lg:p-16 bg-white">
                     {isSent ? (
                        <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                           <div className="w-24 h-24 bg-success-bg text-success rounded-full flex items-center justify-center mb-6">
                              <CheckCircle2 size={48} />
                           </div>
                           <h3 className="text-3xl font-bold text-neutral-900 mb-4">Request Received!</h3>
                           <p className="text-neutral-500 mb-8 max-w-sm">
                              Thank you for your interest. Our wholesale team has received your inquiry and will be in touch shortly with a quote.
                           </p>
                           <Button variant="outline" onClick={() => setIsSent(false)}>Submit Another Request</Button>
                        </div>
                     ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                           {submitStatus.type === 'error' && (
                              <div className="p-4 bg-error/10 text-error rounded-xl flex items-center gap-2 text-sm">
                                 <AlertCircle size={16} />
                                 {submitStatus.message}
                              </div>
                           )}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-sm font-bold text-neutral-700 ml-1">Company / Business Name <span className="text-error">*</span></label>
                                 <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className={getInputClass('companyName')}
                                    placeholder="e.g. Acme Hotel / Retail"
                                    required
                                 />
                                 {errors.companyName && <p className="text-error text-xs flex items-center gap-1 mt-1"><AlertCircle size={12} /> {errors.companyName}</p>}
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-bold text-neutral-700 ml-1">Business Type</label>
                                 <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none bg-neutral-50/50 appearance-none cursor-pointer"
                                 >
                                    <option>Retail Store / Supermarket</option>
                                    <option>Restaurant / Hotel / Cafe (HoReCa)</option>
                                    <option>Bakery / Confectionery</option>
                                    <option>Food Processing Unit</option>
                                    <option>Catering Service</option>
                                    <option>Other</option>
                                 </select>
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-sm font-bold text-neutral-700 ml-1">GST Number <span className="text-error">*</span></label>
                              <input
                                 type="text"
                                 name="gstNumber"
                                 value={formData.gstNumber}
                                 onChange={handleChange}
                                 className={getInputClass('gstNumber')}
                                 placeholder="e.g. 22AAAAA0000A1Z5"
                                 required
                              />
                              {errors.gstNumber ? (
                                 <p className="text-error text-xs flex items-center gap-1 mt-1"><AlertCircle size={12} /> {errors.gstNumber}</p>
                              ) : (
                                 <p className="text-neutral-400 text-xs ml-1">Must be a valid 15-digit GSTIN.</p>
                              )}
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-sm font-bold text-neutral-700 ml-1">Contact Person <span className="text-error">*</span></label>
                                 <input
                                    type="text"
                                    name="contactName"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    className={getInputClass('contactName')}
                                    placeholder="John Doe"
                                    required
                                 />
                                 {errors.contactName && <p className="text-error text-xs flex items-center gap-1 mt-1"><AlertCircle size={12} /> {errors.contactName}</p>}
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-bold text-neutral-700 ml-1">Phone Number <span className="text-error">*</span></label>
                                 <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={getInputClass('phone')}
                                    placeholder="+91 98765 43210"
                                    required
                                 />
                                 {errors.phone && <p className="text-error text-xs flex items-center gap-1 mt-1"><AlertCircle size={12} /> {errors.phone}</p>}
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-sm font-bold text-neutral-700 ml-1">Work Email <span className="text-error">*</span></label>
                                 <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={getInputClass('email')}
                                    placeholder="procurement@company.com"
                                    required
                                 />
                                 {errors.email && <p className="text-error text-xs flex items-center gap-1 mt-1"><AlertCircle size={12} /> {errors.email}</p>}
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-bold text-neutral-700 ml-1">Requirement Type</label>
                                 <select
                                    name="requirement"
                                    value={formData.requirement}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none bg-neutral-50/50 appearance-none cursor-pointer"
                                 >
                                    <option>Bulk Raw Material (Sacks)</option>
                                    <option>Retail Stocking (Packaged)</option>
                                    <option>White Labeling</option>
                                    <option>Regular Monthly Supply</option>
                                 </select>
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-sm font-bold text-neutral-700 ml-1">Estimated Quantity / Details</label>
                              <textarea
                                 name="message"
                                 value={formData.message}
                                 onChange={handleChange}
                                 className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none bg-neutral-50/50"
                                 placeholder="E.g., Looking for 50kg Cashews monthly for our bakery..."
                                 rows={3}
                              ></textarea>
                           </div>

                           <Button type="submit" size="md" className="w-full md:py-4 md:text-lg" isLoading={isSubmitting}>
                              Submit Inquiry
                           </Button>
                           <p className="text-xs text-neutral-400 text-center mt-4">
                              By submitting this form, you agree to our privacy policy.
                           </p>
                        </form>
                     )}
                  </div>
               </div>
            </div>
         </section>

         {/* Wholesale FAQ Section */}
         <section className="py-24 bg-neutral-50/30">
            <div className="container mx-auto px-6 md:px-12">
               <div className="flex flex-col lg:flex-row gap-16">
                  <div className="lg:w-1/3">
                     <span className="text-brand font-bold tracking-widest uppercase text-xs mb-3 block">Partnership Support</span>
                     <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">Wholesale FAQs</h2>
                     <p className="text-neutral-500 text-lg mb-8 leading-relaxed">
                        Have specific questions about bulk ordering, logistics, or pricing? Find the most common business inquiries answered here.
                     </p>
                     <div className="p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                        <p className="text-neutral-700 font-bold mb-2">Can't find an answer?</p>
                        <p className="text-sm text-neutral-500 mb-4">Contact our dedicated B2B sales desk directly.</p>
                        <a href="mailto:Mahindracashewproducts@gmail.com" className="text-brand font-bold flex items-center gap-2 hover:underline break-all">
                           <Mail size={16} className="flex-shrink-0" /> Mahindracashewproducts@gmail.com
                        </a>
                     </div>
                  </div>

                  <div className="lg:w-2/3">
                     <div className="space-y-3">
                        {WHOLESALE_FAQS.map((faq, index) => (
                           <div
                              key={index}
                              className={`border rounded-3xl transition-all duration-300 ${openFaqIndex === index ? 'bg-white border-brand/20 shadow-lg' : 'bg-transparent border-neutral-100 hover:border-neutral-200'}`}
                           >
                              <button
                                 onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                 className="flex items-center justify-between w-full p-4 md:p-6 text-left"
                              >
                                 <span className={`text-base md:text-lg font-bold transition-colors ${openFaqIndex === index ? 'text-brand' : 'text-neutral-900'}`}>
                                    {faq.question}
                                 </span>
                                 <div className={`flex-shrink-0 ml-3 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openFaqIndex === index ? 'bg-brand text-white rotate-180' : 'bg-neutral-100 text-neutral-500'}`}>
                                    {openFaqIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                                 </div>
                              </button>
                              <div
                                 className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaqIndex === index ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
                              >
                                 <div className="px-4 md:px-6 pb-4 md:pb-6 text-neutral-600 leading-relaxed text-sm md:text-base">
                                    {faq.answer}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
};