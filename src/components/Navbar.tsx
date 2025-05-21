'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          E-Commerce Site
        </Link>
        <div className="flex items-center">
          <Link href="/cart" className="mr-6 hover:text-gray-300" >
            Cart ({itemCount})
          </Link>
          {currentUser ? (
            <>
              <span className="mr-4 hidden sm:inline">Welcome, {currentUser.displayName || currentUser.email}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="mr-4 hover:text-gray-300">
                Login
              </Link>
              <Link href="/signup" className="hover:text-gray-300">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
