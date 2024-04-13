import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserExitsValidator } from 'src/common/decoratos/user-exists.validator';
import { UploadService } from './upload.service';
import { UserController } from './user.controller';
import { AdminResolver } from './admin.resolver';
import { ProductService } from '../product/product.service';
import { OrderService } from '../order/order.service';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserExitsValidator,
    UploadService,
    OrderService,
    ProductService,
    AdminResolver,
    UserController,
  ],
  exports: [UserService, UploadService],
})
export class UserModule {}
