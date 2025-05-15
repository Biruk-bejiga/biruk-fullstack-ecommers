'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="container mx-auto p-4 text-center min-h-[calc(100vh-150px)] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart is Empty</h1>
        <Link href="/" className="text-blue-500 hover:text-blue-700 font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-[calc(100vh-150px)]">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Shopping Cart</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-center justify-between border-b py-4 last:border-b-0"
          >
            <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-1/2">
              <div className="relative w-20 h-20 mr-4">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center mr-4">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-l"
                >
                  -
                </button>
                <span className="py-1 px-4 bg-gray-100">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-r"
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
              </div>
              <p className="text-md font-semibold text-gray-800 w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="ml-4 text-red-500 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
          <div>
            <button
              onClick={clearCart}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4 sm:mb-0"
            >
              Clear Cart
            </button>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">
              Total: ${cartTotal.toFixed(2)}
            </p>
            <Link href="/checkout" legacyBehavior>
              <a className="mt-4 inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded text-lg">
                Proceed to Checkout
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
