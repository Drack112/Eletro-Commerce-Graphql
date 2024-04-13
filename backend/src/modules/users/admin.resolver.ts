import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { RoleType, User } from './user.schema';
import { Roles } from 'src/common/decoratos/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserService } from './user.service';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';
import { UserResponse } from '../auth/dto/user-response.object-types';
import { PaginatedUser } from './dto/paginated-user.object-types';
import { PaginationInput } from 'src/common/dto/pagination.input';
import { PaginatedOrder } from '../order/dto/pagination-order.object-types';
import { UpdateUserInput } from './dto/update-user.input';
import { Order } from '../order/schemas/order.schema';
import { Product } from '../product/schemas/product.schema';
import { CurrentUser } from 'src/common/decoratos/user.decorator';
import { CreateProductInput } from '../product/dto/create-product.input';

@Resolver(() => User)
@Roles(RoleType.ADMIN)
@UseGuards(JwtGuard)
export class AdminResolver {
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private productService: ProductService,
  ) {}

  @Query(() => UserResponse)
  public async adminGetUserById(@Args('_id') _id: string) {
    const user = await this.userService.findById(_id);
    return { user };
  }

  @Query(() => UserResponse)
  public async adminGetUserByUsername(@Args('username') username: string) {
    const user = await this.userService.findOne({ username });
    return { user };
  }

  @Query(() => UserResponse)
  public async adminGetUserByEmail(@Args('email') email: string) {
    const user = await this.userService.findOne({ email });
    return { user };
  }

  @Query(() => PaginatedUser)
  public async adminSearchUsers(
    @Args('q') q: string,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    const safeLimit = pagination?.limit || 25;
    const safePage = pagination?.page || 1;
    const result = await this.userService.queryUsers(q, {
      limit: safeLimit,
      page: safePage,
    });
    return result;
  }

  @Mutation(() => UserResponse)
  public async adminUpdateUserById(
    @Args('_id') _id: string,
    @Args('input') input: UpdateUserInput,
  ) {
    const user = await this.userService.updateOne(_id, input);
    return { user };
  }

  @Mutation(() => Boolean)
  public async adminDeleteUserById(@Args('_id') _id: string) {
    try {
      await this.userService.deleteById(_id);
      return true;
    } catch (error) {
      return false;
    }
  }

  @Query(() => PaginatedOrder)
  public async adminGetOrders(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return await this.orderService.findManyOrders(pagination);
  }

  @Mutation(() => Order)
  public async adminSetDeliveryOrder(@Args('_id') _id: string) {
    return await this.orderService.updateOrderToDelivered(_id);
  }

  @Mutation(() => Product)
  public async adminCreateProduct(
    @Args('input') input: CreateProductInput,
    @CurrentUser() user: User,
  ) {
    return await this.productService.createProduct(input, user);
  }

  @Mutation(() => Product)
  public async adminUpdateProduct(
    @Args('_id') _id: string,
    @Args('input') input: CreateProductInput,
  ) {
    return await this.productService.updateProduct(_id, input);
  }

  @Mutation(() => Boolean)
  public async adminDeleteProduct(@Args('_id') _id: string) {
    const productDeleted = await this.productService.deleteProduct(_id);
    return productDeleted ? true : false;
  }
}
