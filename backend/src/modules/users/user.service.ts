import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { User } from './user.schema';
import { UserWhereUniqueInput } from './dto/user-where-unique.input';
import { PaginationInput } from 'src/common/dto/pagination.input';
import { PaginatedUser } from './dto/paginated-user.object-types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  public async findOne(where: UserWhereUniqueInput): Promise<User> {
    const user: User = await this.userModel.findOne(where).lean();
    return user;
  }

  public async findById(_id: string): Promise<User> {
    const user = await this.userModel.findById(_id).lean();
    return user;
  }

  public async queryUsers(
    q: string,
    pagination?: PaginationInput,
  ): Promise<PaginatedUser> {
    const text = q.trim();
    const count: number = await this.userModel.countDocuments({
      $or: [
        { username: new RegExp(text, 'i') },
        { email: new RegExp(text, 'i') },
      ],
    });

    const limit = pagination?.limit || 25;
    const page = pagination?.page || 1;

    const users: User[] = await this.userModel
      .find({
        $or: [
          { username: new RegExp(text, 'i') },
          { email: new RegExp(text, 'i') },
        ],
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    return { count, users };
  }

  public async updateMany(
    filter: FilterQuery<User>,
    input: UpdateQuery<User>,
  ): Promise<User[]> {
    const updated: User[] = await this.userModel
      .updateMany(filter, input, { new: true })
      .lean();
    return updated;
  }

  public async deleteById(_id: string) {
    return await this.userModel.findByIdAndDelete(_id);
  }

  public async deleteOne(filter: FilterQuery<User>) {
    return await this.userModel.deleteOne(filter);
  }

  public async deleteMany(filter: FilterQuery<User>) {
    return await this.userModel.deleteMany(filter);
  }

  public async updateOne(_id: string, input: UpdateQuery<User>): Promise<User> {
    const updated: User = await this.userModel
      .findByIdAndUpdate(_id, input, { new: true })
      .lean();
    return updated;
  }
}
