'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CheckoutFormWrapper from '@/components/CheckoutForm';

const CheckoutPage = () => {
  const { cartItems, cartTotal, itemCount } = useCart();
  const { currentUser, loading: authLoading } = useAuth();

  if (authLoading) {
    return <p className="text-center py-10">Loading user information...</p>;
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto p-4 text-center min-h-[calc(100vh-150px)] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Please login to proceed to checkout.</h1>
        <Link href="/login?redirect=/checkout" className="text-blue-500 hover:text-blue-700 font-semibold">
          Login
        </Link>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="container mx-auto p-4 text-center min-h-[calc(100vh-150px)] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty.</h1>
        <Link href="/" className="text-blue-500 hover:text-blue-700 font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          {/* Placeholder for shipping form */}
          <p className="text-gray-600">Shipping form will be here.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">Payment Details</h2>
          <CheckoutFormWrapper />
        </div>
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr className="my-2"/>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
