import {
  Body,
  Controller,
  Get,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';

// services
import { StripeService } from './stripe.service';

// types
import { PaymentRequestBody } from './types/PaymentRequestBody';

// exceptions
import { CustomInternalServerErrorException } from 'src/exceptions/CustomInternalServerErrorException';

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
  async createPayment(@Body() paymentRequestBody: PaymentRequestBody) {
    try {
      const paymentMethod = await this.stripeService.createPaymentMethod();

      const paymentIntent = await this.stripeService.createPaymentIntent(
        paymentRequestBody,
        paymentMethod.id,
      );
      await this.stripeService.createPaymentSession(paymentRequestBody);
      if (paymentIntent) {
        return;
      }
    } catch (error) {
      console.log('🚀 ~ StripeController ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }

  @Post('checkout-session')
  async createCheckoutSession(@Body() paymentRequestBody: PaymentRequestBody) {
    try {
      const sessionUrl =
        await this.stripeService.createPaymentSession(paymentRequestBody);

      return { url: sessionUrl };
    } catch (error) {
      console.log('🚀 ~ StripeController ~ error:', error);
      throw new CustomInternalServerErrorException();
    }
  }

  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>): Promise<void> {
    const sig = req.headers['stripe-signature'];

    const rawBody = req.rawBody;

    try {
      const event = this.stripeService.constructEvent(
        rawBody,
        sig,
        'whsec_3f2a419537ae5525272faa06b8805e682a17b2fc9ce5a1a2b2981ac0f3664756',
        // process.env.STRIPE_WEBHOOK_SECRET,
      );
      await this.stripeService.handleEvent(event);
    } catch (err) {
      console.log(err, 'handleWebhook');
      throw new CustomInternalServerErrorException(
        'Error rased with webhook stripe',
      );
    }
  }
}
