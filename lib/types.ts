export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number | null;
  available: boolean;
  sku?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  category: string;
  categoryHandle: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  available: boolean;
}

export interface Category {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  price: number;
  image: string;
  quantity: number;
  handle: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod';
  createdAt: string;
}
