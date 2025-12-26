import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Royal W320 Cashews",
    price: 849,
    weight: "500g",
    image: "https://images.unsplash.com/photo-1596328330761-46820572d421?q=80&w=800&auto=format&fit=crop", 
    category: "Cashews",
    rating: 5,
    description: "Hand-picked, jumbo-sized W320 cashews from the Konkan coast. Creamy and crunchy.",
    isNew: true,
    images: [
      "https://images.unsplash.com/photo-1596328330761-46820572d421?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621446702588-0f8c85c34458?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525458607106-25f053530869?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606925207923-c580f25966b5?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "2",
    name: "Kashmiri Mamra Almonds",
    price: 1850,
    weight: "500g",
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d90?q=80&w=800&auto=format&fit=crop", 
    category: "Almonds",
    rating: 4.8,
    description: "Premium oil-rich Mamra almonds sourced directly from Kashmir valleys.",
    images: [
        "https://images.unsplash.com/photo-1508061253366-f7da158b6d90?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1626838382103-176311815599?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1615485925763-867862f80877?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "3",
    name: "Salted Roasted Pistachios",
    price: 799,
    weight: "400g",
    image: "https://images.unsplash.com/photo-1600189020840-e9918c25268d?q=80&w=800&auto=format&fit=crop",
    category: "Pistachios",
    rating: 4.9,
    description: "Lightly salted, naturally opened pistachios. The perfect guilt-free snack.",
    images: [
        "https://images.unsplash.com/photo-1600189020840-e9918c25268d?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596627706522-83c316278832?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1616428753063-8756c2211424?q=80&w=800&auto=format&fit=crop"
    ]
  },
  {
    id: "4",
    name: "Afghan Anjeer (Figs)",
    price: 549,
    weight: "250g",
    image: "https://images.unsplash.com/photo-1616428753063-8756c2211424?q=80&w=800&auto=format&fit=crop", 
    category: "Dried Fruit",
    rating: 4.7,
    description: "Sweet, chewy, and nutritious dried figs from Afghanistan.",
  },
  {
    id: "5",
    name: "Golden Raisins",
    price: 399,
    weight: "500g",
    image: "https://images.unsplash.com/photo-1600189020950-7f28ae924619?q=80&w=800&auto=format&fit=crop", 
    category: "Dried Fruit",
    rating: 4.5,
    description: "Plump, long golden raisins perfect for baking or snacking.",
  },
  {
    id: "6",
    name: "Premium Walnut Kernels",
    price: 899,
    weight: "400g",
    image: "https://images.unsplash.com/photo-1563538448-b3d4b0051e5e?q=80&w=800&auto=format&fit=crop",
    category: "Walnuts",
    rating: 4.8,
    description: "Brain-shaped goodness. Fresh, snow-white walnut kernels.",
    isNew: true
  }
];