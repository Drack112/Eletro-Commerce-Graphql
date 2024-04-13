import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Order } from './schemas/order.schema';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create-order.input';
import { CurrentUser } from 'src/common/decoratos/user.decorator';
import { User } from '../users/user.schema';
import { PaginationInput } from 'src/common/dto/pagination.input';
import { PaginatedOrder } from './dto/pagination-order.object-types';

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

  @Query(() => Order)
  public async orderById(@Args('_id') _id: string) {
    const order = await this.orderService.findOrderById(_id);
    if (!order)
      throw new BadRequestException(`Order with id: ${_id} not found.`);
    return order;
  }

  @Query(() => PaginatedOrder)
  public async myOrders(
    @CurrentUser() user: User,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return await this.orderService.findOrdersByUser(user._id, pagination);
  }
}
