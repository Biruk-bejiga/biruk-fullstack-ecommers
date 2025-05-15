'use client';

import React, { Suspense } from 'react'; // Import Suspense
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const amount = searchParams.get('amount');

  return (
    <div className="container mx-auto p-4 text-center min-h-[calc(100vh-150px)] flex flex-col justify-center items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Payment Successful!</h1>
      <p className="text-lg text-gray-700 mb-2">Thank you for your purchase.</p>
      {amount && <p className="text-md text-gray-600 mb-2">Amount Paid: ${parseFloat(amount).toFixed(2)}</p>}
      {paymentIntentId && <p className="text-md text-gray-600 mb-6">Order ID: {paymentIntentId}</p>}
      <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg">
        Continue Shopping
      </Link>
    </div>
  );
};

// Wrap the component with Suspense as useSearchParams needs it
const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading payment details...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
