'use client';

import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import getStripe from '@/lib/stripe';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
  clientSecret: string;
}

const StripeFormActual: React.FC<CheckoutFormProps> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart, cartTotal } = useCart();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setMessage("Stripe.js has not loaded yet. Please wait a moment and try again.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/payment-success?amount=${cartTotal}`,
      },
      redirect: 'if_required', // Prevent immediate redirection
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      setIsLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage(`Payment succeeded! Order ID: ${paymentIntent.id}`);
      // TODO: Here you would typically save the order to your database
      // For now, we'll just clear the cart and redirect
      clearCart();
      router.push(`/payment-success?payment_intent=${paymentIntent.id}&amount=${cartTotal}`);
    } else if (paymentIntent) {
      setMessage(`Payment status: ${paymentIntent.status}. Please contact support if this persists.`);
    } else {
      setMessage("Payment did not succeed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-70"
      >
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : `Pay $${cartTotal.toFixed(2)}`}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className={`text-sm mt-2 ${message.includes('succeeded') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
      <style jsx>{`
        .spinner,
        .spinner:before,
        .spinner:after {
          border-radius: 50%;
        }
        .spinner {
          color: #ffffff;
          font-size: 22px;
          text-indent: -99999px;
          margin: 0px auto;
          position: relative;
          width: 20px;
          height: 20px;
          box-shadow: inset 0 0 0 2px;
          -webkit-transform: translateZ(0);
          -ms-transform: translateZ(0);
          transform: translateZ(0);
        }
        .spinner:before,
        .spinner:after {
          position: absolute;
          content: "";
        }
        .spinner:before {
          width: 10.4px;
          height: 20.4px;
          background: #5469d4; /* Primary color of Stripe button */
          border-radius: 20.4px 0 0 20.4px;
          top: -0.2px;
          left: -0.2px;
          -webkit-transform-origin: 10.4px 10.2px;
          transform-origin: 10.4px 10.2px;
          -webkit-animation: loading 2s infinite ease 1.5s;
          animation: loading 2s infinite ease 1.5s;
        }
        .spinner:after {
          width: 10.4px;
          height: 10.2px;
          background: #5469d4;
          border-radius: 0 10.2px 10.2px 0;
          top: -0.1px;
          left: 10.2px;
          -webkit-transform-origin: 0px 10.2px;
          transform-origin: 0px 10.2px;
          -webkit-animation: loading 2s infinite ease;
          animation: loading 2s infinite ease;
        }
        
        @keyframes loading {
          0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }
      `}</style>
    </form>
  );
};


const CheckoutFormWrapper = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { cartTotal, itemCount } = useCart();
  const { currentUser } = useAuth(); // Get current user for name/email

  useEffect(() => {
    if (itemCount > 0 && currentUser) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: cartTotal,
          customerName: currentUser.displayName || 'Guest User',
          customerEmail: currentUser.email || 'guest@example.com'
        }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then(data => Promise.reject(data));
          }
          return res.json();
        })
        .then((data) => setClientSecret(data.clientSecret))
        .catch((err) => {
          console.error("Error fetching client secret:", err);
          setError(err.error || "Failed to initialize payment. Please try again.");
        });
    }
  }, [cartTotal, itemCount, currentUser]);

  if (error) {
    return <p className="text-red-500 text-center py-4">{error}</p>;
  }

  if (!clientSecret) {
    return <p className="text-center py-10">Initializing payment...</p>;
  }

  const options = {
    clientSecret,
    appearance: { theme: 'stripe' as const },
  };

  return (
    <Elements stripe={getStripe()} options={options}>
      <StripeFormActual clientSecret={clientSecret} />
    </Elements>
  );
};

export default CheckoutFormWrapper;
