import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { PaginatedProduct } from './dto/paginated-products.object-types';
import { PaginationInput } from 'src/common/dto/pagination.input';

@Resolver()
export class ProductResolver {
  constructor(private productService: ProductService) {}

  @Query(() => PaginatedProduct)
  public async products(
    @Args('pagination', { nullable: true })
    pagination?: PaginationInput,
  ) {
    return await this.productService.findMany(pagination);
  }
}
