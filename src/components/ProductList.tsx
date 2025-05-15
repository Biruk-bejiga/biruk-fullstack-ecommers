'use client';

import React, { useEffect, useState } from 'react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { mockProducts } from '@/lib/mockProducts'; // Using mock data for now

// In a real app, you'd fetch products from an API or Firebase
// const fetchProducts = async (): Promise<Product[]> => {
//   // Example: Replace with actual API call
//   // const response = await fetch('/api/products');
//   // if (!response.ok) {
//   //   throw new Error('Failed to fetch products');
//   // }
//   // return response.json();
//   return Promise.resolve(mockProducts);
// };

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // const fetchedProducts = await fetchProducts(); // Real fetch
        setProducts(mockProducts); // Using mock data directly
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 py-8">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-8">Error loading products: {error}</p>;
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-500 py-8">No products found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
