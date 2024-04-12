import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { PaginatedProduct } from './dto/paginated-products.object-types';
import { PaginationInput } from 'src/common/dto/pagination.input';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModeL: Model<Product>,
  ) {}

  public async findMany(
    pagination?: PaginationInput,
  ): Promise<PaginatedProduct> {
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;

    const products = await this.productModeL
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const count = await this.productModeL.countDocuments({});
    return { count, products };
  }
}
