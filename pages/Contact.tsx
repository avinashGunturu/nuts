import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, User, Hash, ChevronDown, HelpCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    inquiryType: 'General Inquiry',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message cannot be empty';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        orderNumber: '', 
        inquiryType: 'General Inquiry', 
        message: '' 
      });
      setErrors({});
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getInputClass = (fieldName: string, hasIcon: boolean = false) => {
    const base = `w-full py-4 rounded-xl border outline-none transition-all bg-neutral-50/30 text-base ${hasIcon ? 'pl-12 pr-4' : 'px-5 py-4'}`;
    return errors[fieldName] 
      ? `${base} border-error focus:border-error focus:ring-4 focus:ring-error/10 placeholder:text-error/40`
      : `${base} border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 placeholder:text-neutral-300`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-neutral-900 selection:bg-brand selection:text-white">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
           <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand/20 rounded-full blur-[120px] animate-pulse-slow"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-dark/30 rounded-full blur-[100px]"></div>
           {/* Floating particles */}
           <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-brand-light rounded-full blur-[1px] opacity-60 animate-bounce"></div>
           <div className="absolute top-[60%] right-[20%] w-3 h-3 bg-brand rounded-full blur-[2px] opacity-40"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
             
             {/* Status Badge */}
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-default shadow-lg shadow-black/20">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
                <span className="text-sm font-medium text-neutral-300">Support Online</span>
             </div>

             {/* Heading */}
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
               Let's start a <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-brand-100 to-white">Conversation.</span>
             </h1>

             {/* Subtext */}
             <p className="text-2xl text-neutral-400 font-light leading-relaxed max-w-2xl mx-auto">
               Whether you have a question about our harvest, need help with an order, or are looking for wholesale solutions, we are here to listen.
             </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 py-24 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Contact Info */}
          <div className="lg:w-1/3 space-y-12 pt-12">
            <div>
              <h3 className="text-3xl font-bold text-neutral-900 mb-6">Contact Information</h3>
              <p className="text-lg text-neutral-500 mb-10">
                Fill out the form or reach us directly via email or phone. We usually respond within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, title: "Email", content: "hello@kcnuts.in", sub: "For general inquiries" },
                { icon: Phone, title: "Phone", content: "+91 98765 43210", sub: "Mon-Fri, 9am - 6pm IST" },
                { icon: MapPin, title: "Office", content: "123 Cashew Lane, Ratnagiri", sub: "Maharashtra, India 415612" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-6 p-6 rounded-3xl bg-neutral-50 border border-neutral-100 hover:border-brand-light/30 transition-colors">
                  <div className="bg-white p-4 rounded-full shadow-sm text-brand">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-neutral-900">{item.title}</h4>
                    <p className="text-brand font-medium text-lg">{item.content}</p>
                    <p className="text-sm text-neutral-400 mt-1">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Business Inquiries Box - UPDATED */}
            <div className="bg-brand-50 p-8 rounded-3xl border border-brand-100">
               <h4 className="font-bold text-brand-dark mb-2 flex items-center gap-2 text-lg">
                 <MessageSquare size={20} /> Wholesale & Bulk
               </h4>
               <p className="text-base text-neutral-600 mb-4">Looking for bulk ingredients or white labeling?</p>
               <Link to="/corporate" className="text-base font-bold text-brand hover:underline inline-flex items-center">
                 Contact B2B Team &rarr;
               </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3">
            <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl shadow-neutral-100 border border-neutral-100 relative overflow-hidden">
              {/* Decorative background element for the form card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2"></div>

              {isSent ? (
                 <div className="text-center py-24 animate-fade-in">
                    <div className="w-24 h-24 bg-success-bg text-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                       <Send size={40} />
                    </div>
                    <h3 className="text-3xl font-bold text-neutral-900 mb-3">Message Sent!</h3>
                    <p className="text-neutral-500 mb-10 text-lg">Thank you for reaching out.<br/>We'll get back to you within 24 hours.</p>
                    <Button onClick={() => setIsSent(false)} variant="outline" className="min-w-[200px]">Send Another</Button>
                 </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-8">
                  <div className="mb-4">
                    <h3 className="text-3xl font-bold text-neutral-900">Send us a message</h3>
                    <p className="text-neutral-500 text-base mt-2">We typically reply within a few hours.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label htmlFor="name" className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Full Name <span className="text-error">*</span></label>
                      <div className="relative group">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-error' : 'text-neutral-400 group-focus-within:text-brand'}`}>
                          <User size={20} />
                        </div>
                        <input 
                          type="text" 
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={getInputClass('name', true)}
                        />
                      </div>
                      {errors.name && <p className="text-error text-sm ml-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.name}</p>}
                    </div>
                    
                    <div className="space-y-3">
                      <label htmlFor="email" className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Email Address <span className="text-error">*</span></label>
                      <div className="relative group">
                         <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-error' : 'text-neutral-400 group-focus-within:text-brand'}`}>
                          <Mail size={20} />
                        </div>
                        <input 
                          type="email" 
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className={getInputClass('email', true)}
                        />
                      </div>
                      {errors.email && <p className="text-error text-sm ml-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label htmlFor="phone" className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Phone (Optional)</label>
                      <div className="relative group">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-error' : 'text-neutral-400 group-focus-within:text-brand'}`}>
                          <Phone size={20} />
                        </div>
                        <input 
                          type="tel" 
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className={getInputClass('phone', true)}
                          maxLength={15}
                        />
                      </div>
                      {errors.phone && <p className="text-error text-sm ml-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.phone}</p>}
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="orderNumber" className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Order # (Optional)</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                          <Hash size={20} />
                        </div>
                        <input 
                          type="text" 
                          name="orderNumber"
                          id="orderNumber"
                          value={formData.orderNumber}
                          onChange={handleChange}
                          placeholder="e.g. KC-12345"
                          className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all placeholder:text-neutral-300 bg-neutral-50/30 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="inquiryType" className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Topic</label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-brand transition-colors">
                        <HelpCircle size={20} />
                      </div>
                      <select
                        name="inquiryType"
                        id="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full pl-12 pr-10 py-4 rounded-xl border border-neutral-200 focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all text-neutral-600 bg-neutral-50/30 appearance-none cursor-pointer text-base"
                      >
                        <option>General Inquiry</option>
                        <option>Order Status & Support</option>
                        <option>Product Feedback</option>
                        <option>Returns & Refunds</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="message" className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Message <span className="text-error">*</span></label>
                    <div className="relative group">
                       <textarea 
                        name="message"
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="How can we help you today?"
                        className={getInputClass('message')}
                      ></textarea>
                    </div>
                    {errors.message && <p className="text-error text-sm ml-1 flex items-center gap-1"><AlertCircle size={14} /> {errors.message}</p>}
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full shadow-lg shadow-brand/20 hover:shadow-brand/40 py-5 text-lg"
                      isLoading={isSubmitting}
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};