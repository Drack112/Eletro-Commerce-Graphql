import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Order } from './schemas/order.schema';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create-order.input';
import { CurrentUser } from 'src/common/decoratos/user.decorator';
import { User } from '../users/user.schema';

@Resolver(() => Order)
@UseGuards(JwtGuard)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Mutation(() => Order)
  public async createOrder(
    @Args('input')
    input: CreateOrderInput,
    @CurrentUser()
    user: User,
  ) {
    console.log(user);
    return await this.orderService.createOrder(user._id, input);
  }
}
