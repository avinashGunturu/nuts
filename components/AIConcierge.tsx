import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Bot } from 'lucide-react';
import { getProductRecommendation } from '../services/geminiService';
import { PRODUCTS } from '../constants';
import { Button } from './Button';

interface AIConciergeProps {
  onRecommend: (productIds: string[]) => void;
}

export const AIConcierge: React.FC<AIConciergeProps> = ({ onRecommend }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);

    const productNames = PRODUCTS.map(p => p.name);
    const result = await getProductRecommendation(query, productNames);

    setIsLoading(false);
    setResponse(result.recommendationText);

    // Find IDs based on names returned
    const matchingIds = PRODUCTS.filter(p => 
      result.suggestedProducts.some(suggested => 
        p.name.toLowerCase().includes(suggested.toLowerCase()) || 
        suggested.toLowerCase().includes(p.name.toLowerCase())
      )
    ).map(p => p.id);

    onRecommend(matchingIds);
  };

  return (
    <section className="relative w-full my-20 rounded-DEFAULT overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-brand-vivid"></div>
      
      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black opacity-20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>

      <div className="relative z-10 flex flex-col items-center justify-center p-8 md:p-16 text-center">
        
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mb-8 border border-white/10 shadow-xl">
          <Bot className="text-white w-8 h-8" />
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          KCnuts <span className="text-brand-100">Nutrition Guide</span>
        </h2>
        
        <p className="text-brand-50 text-lg md:text-xl font-light mb-10 max-w-2xl">
          Powered by Gemini AI. Tell us about your health goals, cooking needs, or taste preferences, and we'll curate the perfect selection.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-xl relative group">
          <div className="absolute inset-0 bg-brand-light opacity-50 blur-xl group-hover:opacity-75 transition-opacity rounded-full"></div>
          <div className="relative flex items-center bg-white p-2 rounded-full shadow-2xl">
            <div className="pl-6 text-neutral-400">
              <Sparkles size={20} />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="I need high protein snacks for workout..."
              className="flex-grow bg-transparent border-none focus:ring-0 text-neutral-900 placeholder-neutral-400 px-4 py-3 text-lg"
            />
            <Button 
              type="submit" 
              variant="black" 
              disabled={isLoading}
              className="rounded-full !p-3 aspect-square flex-shrink-0"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
            </Button>
          </div>
        </form>

        {response && (
          <div className="mt-10 animate-fade-in-up">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto text-left relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-brand-light"></div>
               <p className="text-xl md:text-2xl text-white font-light leading-relaxed">
                "{response}"
               </p>
               <div className="mt-4 flex items-center gap-2 text-brand-100 text-sm font-medium uppercase tracking-wider">
                  <span className="w-2 h-2 bg-brand-light rounded-full animate-pulse"></span>
                  AI Recommendation
               </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};