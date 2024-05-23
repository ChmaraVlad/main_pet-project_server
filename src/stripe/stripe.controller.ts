import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentRequestBody } from './types/PaymentRequestBody';
import { Response } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Get('products')
  async getProducts() {
    return await this.stripeService.getProducts();
  }

  @Get('customers')
  async getCustomers() {
    return await this.stripeService.getProducts();
  }

  // is not ready yet
  @Post('payment')
  async createPayment(
    @Res() response: Response,
    @Body() paymentRequestBody: PaymentRequestBody,
  ) {
    try {
      const paymentMethod = await this.stripeService.createPaymentMethod();

      const paymentIntent = await this.stripeService.createPaymentIntent(
        paymentRequestBody,
        paymentMethod.id,
      );
      await this.stripeService.createPaymentSession(paymentRequestBody);
      if (paymentIntent) {
        response.sendStatus(201);
      }
    } catch (error) {
      console.log('🚀 ~ StripeController ~ error:', error);
      return error;
    }
  }

  @Post('checkout-session')
  async createCheckoutSession(
    @Res() response,
    @Body() paymentRequestBody: PaymentRequestBody,
  ) {
    try {
      const sessionUrl =
        await this.stripeService.createPaymentSession(paymentRequestBody);

      response.send({ url: sessionUrl });
    } catch (error) {
      console.log('🚀 ~ StripeController ~ error:', error);
      response.send({ error });
    }
  }
}
