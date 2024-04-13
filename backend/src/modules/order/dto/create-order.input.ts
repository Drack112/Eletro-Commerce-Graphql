import { Field, Float, InputType } from '@nestjs/graphql';
import { ShippingAddressInput } from './shipping-address.input';
import { PaymentResultInput } from './payment-result.input';
import { OrderItemInput } from './ordem-item.input';

@InputType()
export class CreateOrderInput {
  @Field(() => [OrderItemInput])
  orderItems: OrderItemInput[];

  @Field(() => ShippingAddressInput)
  shippingAddress: ShippingAddressInput;

  @Field(() => PaymentResultInput)
  paymentResult: PaymentResultInput;

  @Field(() => String)
  paymentMethod: string;

  @Field(() => Float)
  taxPrice: number;

  @Field(() => Float)
  shippingPrice: number;

  @Field(() => Float)
  totalPrice: number;
}
