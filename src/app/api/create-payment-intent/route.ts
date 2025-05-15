import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil', // Updated API version based on TS error
});

export async function POST(request: Request) {
  try {
    const { amount, currency = 'usd', customerName, customerEmail } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Optional: Create or retrieve a Stripe Customer
    // This is useful for saving payment methods for future use
    let customer;
    const existingCustomers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        name: customerName,
        email: customerEmail,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Amount in cents
      currency: currency,
      customer: customer.id,
      // automatic_payment_methods: { enabled: true }, // Consider enabling this for more payment method options
      // Or specify payment_method_types if you want to control them explicitly
      payment_method_types: ['card'],
      metadata: {
        // You can add any other metadata here, like order_id
        customerName: customerName,
        customerEmail: customerEmail,
      }
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
