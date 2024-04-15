import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ProductCart } from 'src/modules/product/dto/product-cart.object-types';

@ObjectType()
export class CartItem {
  @Field(() => ProductCart)
  product: ProductCart;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}
