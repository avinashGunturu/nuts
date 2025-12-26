export interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  image: string;
  category: string;
  rating: number;
  description: string;
  isNew?: boolean;
  images?: string[];
}

export interface RecommendationResponse {
  recommendationText: string;
  suggestedProducts: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedWeight: string;
  calculatedPrice: number; // Price for the specific weight unit
}