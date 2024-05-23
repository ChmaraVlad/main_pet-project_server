import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

// types
import { PaymentRequestBody } from './types/PaymentRequestBody';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_API_KEY') private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-04-10',
    });
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const products = await this.stripe.products.list();
    return products.data;
  }

  async getCustomers() {
    const customers = await this.stripe.customers.list({});
    return customers.data;
  }

  async createPaymentSession(paymentRequestBody: PaymentRequestBody) {
    const items = paymentRequestBody.products.map((product) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
        },
        unit_amount: Math.round(product.price * 100), //cause price is in cents
      },
      quantity: product.quantity,
    }));
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return session.url;
  }

  // is not ready yet
  async createPaymentIntent(
    paymentRequestBody: PaymentRequestBody,
    paymentMethodID,
  ): Promise<any> {
    let sumAmount = 0;
    paymentRequestBody.products.forEach((product) => {
      sumAmount = sumAmount + product.price * product.quantity;
    });

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: sumAmount,
      currency: paymentRequestBody.currency,

      payment_method: paymentMethodID,
    });

    return paymentIntent;
  }

  // is not ready yet
  async createPaymentMethod() {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242',
        exp_month: 8,
        exp_year: 2026,
        cvc: '314',
      },
    });

    return paymentMethod;
  }
}
