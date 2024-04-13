import { Args, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { PaginatedProduct } from './dto/paginated-products.object-types';
import { PaginationInput } from 'src/common/dto/pagination.input';
import { Product } from './schemas/product.schema';
import { CategoryBrands } from './dto/category-brands.object-type';
import { BadRequestException } from '@nestjs/common';

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

  @Query(() => PaginatedProduct)
  public async productsByBrand(
    @Args('brand') brand: string,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return await this.productService.findManyByBrand(brand, pagination);
  }

  @Query(() => PaginatedProduct)
  public async productsByCategory(
    @Args('category') category: string,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return await this.productService.findManyByCategory(category, pagination);
  }

  @Query(() => PaginatedProduct)
  public async productsOfBrandByCategory(
    @Args('category') category: string,
    @Args('brand') brand: string,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return await this.productService.findProductsOfBrandByCategory(
      category,
      brand,
      pagination,
    );
  }

  @Query(() => PaginatedProduct)
  public async queryProducts(
    @Args('q') q: string,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ) {
    return await this.productService.queryProducts(q, pagination);
  }

  @Query(() => [Product])
  public async topProducts(@Args('limit', { nullable: true }) limit?: number) {
    return await this.productService.findTopProducts(limit);
  }

  @Query(() => [Product])
  public async latestProducts(
    @Args('limit', { nullable: true }) limit?: number,
  ) {
    return await this.productService.findLatestProducts(limit);
  }

  @Query(() => [String])
  public async allCategories() {
    return await this.productService.getCategoryList();
  }

  @Query(() => [String])
  public async brandsByCategory(
    @Args('category')
    category: string,
  ) {
    return await this.productService.brandsByCategory(category);
  }

  @Query(() => [CategoryBrands])
  public async categoryBrands() {
    return await this.productService.getCategoryBrands();
  }

  @Query(() => Product)
  public async findProductById(@Args('_id') _id: string) {
    const product = await this.productService.findById(_id);
    if (!product)
      throw new BadRequestException(`Product with id ${_id} not found`);
    return product;
  }
}
