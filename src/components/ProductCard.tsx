'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
        <div className="relative w-full h-48 mb-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded"
        />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2 h-16 overflow-hidden">{product.description}</p>
      <p className="text-xl font-bold text-blue-600 mb-3">${product.price.toFixed(2)}</p>
      <p className="text-xs text-gray-500 mb-3">Category: {product.category}</p>
      <p className="text-xs text-gray-500 mb-4">In Stock: {product.stock}</p>
      <button
        onClick={() => addToCart(product)}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        disabled={product.stock === 0}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
      </div>
    </Link>
  );
};

export default ProductCard;
