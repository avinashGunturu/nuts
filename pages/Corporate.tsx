import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Building2, Trophy, CheckCircle2, ArrowRight, Briefcase, Mail, Phone, Package, ChefHat, Store, AlertCircle, Plus, Minus } from 'lucide-react';

const WHOLESALE_FAQS = [
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

  const validateGST = (gst: string) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST Number is mandatory for partnership';
    } else if (!validateGST(formData.gstNumber)) {
      newErrors.gstNumber = 'Please enter a valid 15-digit GST number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'gstNumber' ? value.toUpperCase() : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
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
               <Button variant="white" size="lg" onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}>
                 Request Wholesale Quote
               </Button>
               <div className="flex items-center gap-4 px-6 py-3 text-neutral-400 text-sm font-medium">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
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

      {/* Industries We Serve */}
      <section className="py-24 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Tailored Solutions for Your Business</h2>
               <p className="text-neutral-500 text-lg">We provide reliable supply chains for diverse commercial needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                  {
                     icon: ChefHat,
                     title: "HoReCa (Hotels & Restaurants)",
                     desc: "Bulk cashew paste, premium nuts for garnishing, and consistent quality ingredients for your signature dishes.",
                     color: "bg-orange-50 text-orange-600"
                  },
                  {
                     icon: Store,
                     title: "Retail & Supermarkets",
                     desc: "Stock our premium branded packs or get white-labeled products for your store shelves.",
                     color: "bg-green-50 text-green-600"
                  },
                  {
                     icon: Package,
                     title: "Bakeries & Confectioneries",
                     desc: "High-grade almonds, pistachios, and walnuts for cakes, cookies, and traditional sweets.",
                     color: "bg-purple-50 text-purple-600"
                  }
               ].map((item, idx) => (
                  <div key={idx} className="p-8 rounded-3xl border border-neutral-100 hover:border-brand-100 hover:shadow-lg transition-all duration-300 group">
                     <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                        <item.icon size={28} />
                     </div>
                     <h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                     <p className="text-neutral-500 leading-relaxed text-sm">{item.desc}</p>
                  </div>
               ))}
            </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-24 bg-neutral-50">
         <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  {
                     title: "Wholesale Pricing",
                     desc: "Get access to our exclusive B2B price list. Tiered discounts available for bulk quantities above 50kg.",
                     img: "https://images.unsplash.com/photo-1596328330761-46820572d421?q=80&w=800&auto=format&fit=crop"
                  },
                  {
                     title: "Quality Assurance",
                     desc: "Every batch is tested for moisture, size, and taste. We ensure consistency so your end product is always perfect.",
                     img: "https://images.unsplash.com/photo-1508061253366-f7da158b6d90?q=80&w=800&auto=format&fit=crop"
                  },
                  {
                     title: "Pan-India Logistics",
                     desc: "Reliable shipping network across India. GST invoicing and credit facilities for verified partners.",
                     img: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=800&auto=format&fit=crop"
                  }
               ].map((service, idx) => (
                  <div key={idx} className="group rounded-[32px] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                     <div className="h-56 overflow-hidden relative">
                        <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                           <h3 className="text-xl font-bold">{service.title}</h3>
                        </div>
                     </div>
                     <div className="p-8">
                        <p className="text-neutral-600 leading-relaxed mb-6">{service.desc}</p>
                        <div className="flex items-center text-brand font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform cursor-pointer">
                           Contact Sales <ArrowRight size={16} className="ml-2" />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry-form" className="py-24 relative overflow-hidden bg-white">
         <div className="container mx-auto px-6 md:px-12">
            <div className="bg-white rounded-[48px] shadow-2xl shadow-neutral-200 overflow-hidden flex flex-col lg:flex-row border border-neutral-100">
               
               {/* Left: Contact Details */}
               <div className="lg:w-2/5 bg-neutral-900 text-white p-12 md:p-16 flex flex-col justify-between relative overflow-hidden">
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
                              <div className="text-xl font-bold">+91 98765 43210</div>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-light">
                              <Mail size={20} />
                           </div>
                           <div>
                              <div className="text-sm text-neutral-400 uppercase tracking-wider font-bold mb-1">B2B Sales</div>
                              <div className="text-xl font-bold">wholesale@kcnuts.in</div>
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
               <div className="lg:w-3/5 p-12 md:p-16 bg-white">
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

                        <Button type="submit" size="lg" className="w-full py-5 text-lg" isLoading={isSubmitting}>
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
                    <a href="mailto:wholesale@kcnuts.in" className="text-brand font-bold flex items-center gap-2 hover:underline">
                       <Mail size={16} /> wholesale@kcnuts.in
                    </a>
                 </div>
              </div>
              
              <div className="lg:w-2/3">
                 <div className="space-y-4">
                   {WHOLESALE_FAQS.map((faq, index) => (
                     <div 
                       key={index} 
                       className={`border rounded-3xl transition-all duration-300 ${openFaqIndex === index ? 'bg-white border-brand/20 shadow-lg' : 'bg-transparent border-neutral-100 hover:border-neutral-200'}`}
                     >
                       <button
                         onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                         className="flex items-center justify-between w-full p-6 md:p-8 text-left"
                       >
                         <span className={`text-xl font-bold transition-colors ${openFaqIndex === index ? 'text-brand' : 'text-neutral-900'}`}>
                           {faq.question}
                         </span>
                         <div className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openFaqIndex === index ? 'bg-brand text-white rotate-180' : 'bg-neutral-100 text-neutral-500'}`}>
                           {openFaqIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                         </div>
                       </button>
                       <div 
                         className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaqIndex === index ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
                       >
                         <div className="px-6 md:px-8 pb-8 text-neutral-600 leading-relaxed text-lg">
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