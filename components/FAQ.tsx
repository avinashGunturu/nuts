import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    question: "Where are your dry fruits sourced from?",
    answer: "We source our products directly from certified farms across India and the globe. For example, our Cashews come from Ratnagiri, Almonds from Kashmir, and Walnuts from Chile/California."
  },
  {
    question: "How do I ensure the quality of the products?",
    answer: "We follow a strict 3-step quality check process: Sourcing from Grade-A farms, optical sorting for size/color uniformity, and nitrogen-flushed packaging to ensure freshness."
  },
  {
    question: "What is the delivery time?",
    answer: "We dispatch orders within 24 hours. Delivery typically takes 2-4 business days for metros and 5-7 business days for other locations across India."
  },
  {
    question: "Do you accept returns?",
    answer: "Due to the perishable nature of food products, we generally do not accept returns. However, if you receive a damaged or incorrect package, please contact us within 24 hours for a resolution."
  },
  {
    question: "Do you supply to restaurants and bakeries?",
    answer: "Yes! We specialize in bulk wholesale supply for HoReCa and retailers. Please visit our Wholesale page or contact us directly for B2B rates."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white border-t border-neutral-100">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/3">
             <span className="text-brand font-bold tracking-widest uppercase text-xs mb-3 block">Common Questions</span>
             <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">Frequently Asked Questions</h2>
             <p className="text-neutral-500 text-lg mb-8 leading-relaxed">Everything you need to know about our products and delivery. Can't find what you're looking for? Reach out to our support team.</p>
          </div>
          
          <div className="lg:w-2/3">
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border rounded-3xl transition-all duration-300 ${openIndex === index ? 'bg-neutral-50 border-neutral-200 shadow-sm' : 'bg-white border-neutral-100 hover:border-neutral-200'}`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex items-center justify-between w-full p-6 md:p-8 text-left"
                  >
                    <span className={`text-xl font-bold transition-colors ${openIndex === index ? 'text-brand' : 'text-neutral-900'}`}>
                      {faq.question}
                    </span>
                    <div className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-brand text-white rotate-180' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}>
                      {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
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
  );
};