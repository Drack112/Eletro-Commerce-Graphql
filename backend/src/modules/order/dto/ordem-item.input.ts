import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { ProductInput } from 'src/modules/product/dto/product-input';

@InputType()
export class OrderItemInput {
  @Field(() => ProductInput)
  product: ProductInput;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}
