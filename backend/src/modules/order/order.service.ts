import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CreateOrderInput } from './dto/create-order.input';

@Injectable()
export class OrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  public async createOrder(userId: string, input: CreateOrderInput) {
    try {
      const { orderItems } = input;
      if (!orderItems && orderItems?.length === 0) {
        throw new BadRequestException('Not items');
      }

      const order = await this.orderModel.create({ ...input, user: userId });
      return order;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
