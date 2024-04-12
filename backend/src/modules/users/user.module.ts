import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserExitsValidator } from 'src/common/decoratos/user-exists.validator';
import { UploadService } from './upload.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, UserExitsValidator, UploadService],
  exports: [UserService, UploadService],
})
export class UserModule {}
