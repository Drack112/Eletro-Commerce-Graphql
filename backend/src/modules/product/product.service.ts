import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { PaginatedProduct } from './dto/paginated-products.object-types';
import { PaginationInput } from 'src/common/dto/pagination.input';
import { CategoryBrands } from './dto/category-brands.object-type';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  public async findMany(
    pagination?: PaginationInput,
  ): Promise<PaginatedProduct> {
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;

    const products = await this.productModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const count = await this.productModel.countDocuments({});
    return { count, products };
  }

  public async findManyByBrand(
    brand: string,
    pagination?: PaginationInput,
  ): Promise<PaginatedProduct> {
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;

    const products: Product[] = await this.productModel
      .find({ brand: new RegExp('^' + brand + '$', 'i') })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const count = await this.productModel.countDocuments({
      brand: new RegExp('^' + brand + '$', 'i'),
    });
    return { count, products };
  }

  public async findManyByCategory(
    category: string,
    pagination?: PaginationInput,
  ): Promise<PaginatedProduct> {
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;
    const products: Product[] = await this.productModel
      .find({ category: new RegExp('^' + category + '$', 'i') })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const count = await this.productModel.countDocuments({
      category: new RegExp('^' + category + '$', 'i'),
    });
    return { count, products };
  }

  public async findProductsOfBrandByCategory(
    category: string,
    brand: string,
    pagination?: PaginationInput,
  ) {
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;
    const products: Product[] = await this.productModel
      .find({
        category: new RegExp('^' + category + '$', 'i'),
        brand: new RegExp('^' + brand + '$', 'i'),
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const count = await this.productModel.countDocuments({
      category: new RegExp('^' + category + '$', 'i'),
      brand: new RegExp('^' + brand + '$', 'i'),
    });
    return { count, products };
  }

  public async queryProducts(
    q: string,
    pagination?: PaginationInput,
  ): Promise<PaginatedProduct> {
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;
    const products: Product[] = await this.productModel
      .find({
        $text: { $search: `\"${q}\"` },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const count = await this.productModel.countDocuments({
      $text: { $search: `\"${q}\"` },
    });
    return { count, products };
  }

  public async findTopProducts(limit?: number) {
    const safeLimit = limit | 25;
    const products: Product[] = await this.productModel
      .find({})
      .sort({ rating: -1 })
      .limit(safeLimit)
      .lean();

    return products;
  }

  public async findLatestProducts(limit?: number) {
    const safeLimit = limit | 25;
    const products: Product[] = await this.productModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(safeLimit)
      .lean();

    return products;
  }

  public async getCategoryList(): Promise<string[]> {
    const categories = await this.productModel.find().distinct('category');
    return categories;
  }

  public async brandsByCategory(category: string): Promise<string[]> {
    const brands = await this.productModel
      .find({
        category: new RegExp('^' + category + '$', 'i'),
      })
      .distinct('brand');

    return brands;
  }

  public async getCategoryBrands(): Promise<CategoryBrands[]> {
    const result: CategoryBrands[] = [];

    try {
      const categories = await this.getCategoryList();
      for (const category of categories) {
        const brands = await this.brandsByCategory(category);
        result.push({ category, brands });
      }

      return result;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
