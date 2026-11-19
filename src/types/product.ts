export type CaseFeature =
  | 'MagSafe Compatible'
  | 'Hinge Protection'
  | 'Built-in Kickstand'
  | 'Clear / Transparent'
  | 'Ultra-Slim Aramid'
  | 'Folio & Wallet';

export type CaseMaterial =
  | 'Polycarbonate'
  | 'Aramid Fiber'
  | 'TechWoven / Fabric'
  | 'TPU & Hybrid'
  | 'Silicone';

export interface ColorVariant {
  name: string;
  hex: string;
  image: string;
  colorFamily: string;
}

export interface Product {
  id: string;
  asin: string;
  brand: string;
  title: string;
  price: number;
  listPrice?: number;
  rating: number;
  reviewCount: number;
  boughtLastMonth?: string;
  isPrime: boolean;
  getItTomorrow: boolean;
  freeShippingEligible: boolean;
  deliveryText: string;
  deliveryDateLabel: string;
  badge?: "Amazon's Choice" | 'Best Seller' | 'Limited time deal';
  isSponsored?: boolean;
  features: CaseFeature[];
  material: CaseMaterial;
  compatibleModels: string[];
  variants: ColorVariant[];
  bulletPoints: string[];
  stockNote?: string;
  category: 'Electronics' | 'Mobile Accessories';
  releaseOrder: number;
}

export interface CartItem {
  product: Product;
  variant: ColorVariant;
  model: string;
  quantity: number;
}

export interface FilterState {
  primeOnly: boolean;
  getItTomorrow: boolean;
  freeShippingOnly: boolean;
  minRating: number | null;
  brands: string[];
  priceRange: [number | null, number | null];
  features: CaseFeature[];
  materials: CaseMaterial[];
  colorFamily: string | null;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

export interface DeliveryLocation {
  city: string;
  postalCode: string;
  label: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  total: number;
  items: CartItem[];
  postalCode: string;
  status: string;
}
