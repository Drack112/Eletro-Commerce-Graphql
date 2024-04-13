import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import mongoose, { Model } from 'mongoose';
import { CreateOrderInput } from './dto/create-order.input';
import { PaginationInput } from 'src/common/dto/pagination.input';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  public async createOrder(userId: string, input: CreateOrderInput) {
    try {
      const { orderItems } = input;
      if (!orderItems && orderItems?.length === 0) {
        throw new BadRequestException('Not items');
      }
      const order: Order = await this.orderModel.create({
        ...input,
        user: userId,
      });
      return order;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  public async findOrdersByUser(userId: string, pagination?: PaginationInput) {
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;

    const isValidObjectId = mongoose.Types.ObjectId.isValid(userId);
    if (!isValidObjectId) {
      throw new Error('Invalid user ID');
    }

    const count = await this.orderModel.countDocuments({
      user: userId,
    });

    const orders: Order[] = await this.orderModel
      .find({ user: userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { count, orders };
  }

  public async findManyOrders(pagination?: PaginationInput) {
    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;
    const count = await this.orderModel.countDocuments({});
    const orders: Order[] = await this.orderModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { count, orders };
  }

  public async findOrderById(_id: string) {
    const order: Order = await this.orderModel.findById(_id).lean();
    return order;
  }
}
