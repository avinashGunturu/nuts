import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Aarav Patel",
    location: "Ahmedabad, Gujarat",
    text: "The quality of the Mamra Almonds is unmatched. I've tried many vendors, but KCnuts' freshness is on another level. Highly recommended for daily use.",
    rating: 5,
  },
  {
    id: 2,
    name: "Meera Reddy",
    location: "Bangalore, Karnataka",
    text: "I use the Royal Cashews for my restaurant's signature gravy. The creamy texture they add is exactly what I was looking for. Consistent quality every time.",
    rating: 5,
  },
  {
    id: 3,
    name: "Rohan Kapoor",
    location: "Delhi, NCR",
    text: "Super fast delivery. The AI guide helped me pick high-protein snacks for my diet. The walnuts are fresh and not bitter at all.",
    rating: 4,
  },
  {
    id: 4,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    text: "Finally found authentic Konkan cashews online! The size and crunch are exactly as described. The W320 grade is genuinely jumbo.",
    rating: 5,
  },
  {
    id: 5,
    name: "Vikram Singh",
    location: "Jaipur, Rajasthan",
    text: "I love the sustainability aspect. Knowing it comes directly from farmers makes the product taste even better. Great initiative!",
    rating: 5,
  },
  {
    id: 6,
    name: "Ananya Das",
    location: "Kolkata, West Bengal",
    text: "The pistachios were perfectly roasted and salted. Not too salty, just right. My kids finish a packet in a day!",
    rating: 4,
  },
  {
    id: 7,
    name: "Suresh Menon",
    location: "Kochi, Kerala",
    text: "Excellent packaging and freshness. It's hard to find such quality in local markets. KCnuts has become my go-to for healthy snacking.",
    rating: 5,
  },
  {
    id: 8,
    name: "Neha Gupta",
    location: "Chandigarh",
    text: "The walnuts are absolutely fresh, no bitterness at all. Perfect for my morning smoothies. Love the prompt customer service too!",
    rating: 5,
  },
  {
    id: 9,
    name: "Amit Joshi",
    location: "Pune, Maharashtra",
    text: "Ordered bulk cashew kernels for my bakery. Everything arrived on time and the quality was top-notch. The wholesale pricing is very competitive.",
    rating: 5,
  },
  {
    id: 10,
    name: "Simran Kaur",
    location: "Ludhiana, Punjab",
    text: "Genuine products. I was skeptical about ordering food online, but the quality speaks for itself. The figs are so juicy and clean.",
    rating: 4,
  },
  {
    id: 11,
    name: "Rajiv Malhotra",
    location: "Gurgaon, Haryana",
    text: "Premium pricing but worth every penny. You can taste the difference in quality compared to regular store-bought nuts.",
    rating: 5,
  },
  {
    id: 12,
    name: "Deepa Iyer",
    location: "Chennai, Tamil Nadu",
    text: "My kids usually hate dry fruits, but they love the flavored cashews from KCnuts. A healthy win for me!",
    rating: 5,
  }
];

const ReviewCard: React.FC<{ testimonial: typeof TESTIMONIALS[0] }> = ({ testimonial }) => {
  const initials = testimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <div className="w-[300px] md:w-[360px] flex-shrink-0 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-overlay hover:border-brand-100 transition-all duration-300 relative group/card mx-3 my-2">
      <div className="absolute top-6 right-6 text-neutral-100 group-hover/card:text-brand-50 transition-colors">
        <Quote size={32} className="fill-current" />
      </div>
      
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={`${i < testimonial.rating ? 'text-warning fill-warning' : 'text-neutral-200 fill-neutral-200'}`} 
          />
        ))}
      </div>

      <p className="text-neutral-600 mb-6 leading-relaxed relative z-10 min-h-[72px] text-base">
        "{testimonial.text}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-neutral-50">
        <div className="w-10 h-10 rounded-full bg-brand-50 text-brand font-bold flex items-center justify-center text-sm tracking-tight border border-brand-100 shadow-sm">
          {initials}
        </div>
        <div>
          <h4 className="font-bold text-neutral-900 text-sm leading-tight">{testimonial.name}</h4>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide mt-0.5">{testimonial.location}</p>
        </div>
        <div className="ml-auto text-success">
          <CheckCircle2 size={16} className="fill-success-bg" />
        </div>
      </div>
    </div>
  );
};

export const Testimonials: React.FC = () => {
  const firstRow = TESTIMONIALS.slice(0, 6);
  const secondRow = TESTIMONIALS.slice(6, 12);

  return (
    <section className="py-24 bg-neutral-50 border-t border-neutral-100 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 mb-16 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand mb-6 shadow-sm">
            <Star size={14} className="fill-brand" />
            <span className="text-xs font-bold uppercase tracking-widest">TrustScore 4.9/5</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 tracking-tight mb-6">
            Trusted by <span className="text-brand">India's Finest</span> Homes
          </h2>
          <p className="text-xl text-neutral-500 font-light max-w-3xl mx-auto">
            Join over 50,000+ happy families and chefs who have made KCnuts their daily habit for premium nutrition.
          </p>
        </div>
      </div>

      <div className="relative w-full flex flex-col gap-6">
        {/* Gradients to fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none"></div>

        {/* First Row - Scrolling Left */}
        <div className="flex group hover:[animation-play-state:paused]">
          <div className="flex animate-marquee">
            {firstRow.map((t) => (
              <ReviewCard key={`r1-set1-${t.id}`} testimonial={t} />
            ))}
          </div>
          <div className="flex animate-marquee" aria-hidden="true">
            {firstRow.map((t) => (
              <ReviewCard key={`r1-set2-${t.id}`} testimonial={t} />
            ))}
          </div>
        </div>

        {/* Second Row - Scrolling Right (Reverse) */}
        <div className="flex group hover:[animation-play-state:paused]">
          <div className="flex animate-marquee-reverse">
            {secondRow.map((t) => (
              <ReviewCard key={`r2-set1-${t.id}`} testimonial={t} />
            ))}
          </div>
          <div className="flex animate-marquee-reverse" aria-hidden="true">
            {secondRow.map((t) => (
              <ReviewCard key={`r2-set2-${t.id}`} testimonial={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};