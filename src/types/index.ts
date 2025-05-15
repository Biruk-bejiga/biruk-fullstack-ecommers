export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

// Add other types as needed, e.g., for CartItem, Order, etc.
export interface CartItem extends Product {
  quantity: number;
}
