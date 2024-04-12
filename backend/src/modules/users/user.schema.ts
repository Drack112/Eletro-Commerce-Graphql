import {
  Field,
  GraphQLISODateTime,
  HideField,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as slugify from 'slugify';
import * as argon2 from 'argon2';

export enum RoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

registerEnumType(RoleType, {
  name: 'RoleType',
  description: 'User role',
});

@Schema()
@ObjectType()
export class User extends Document {
  @Field(() => ID)
  _id: string;

  @Prop({ type: String, unique: true })
  @Field()
  username: string;

  @Prop({ type: String, unique: true })
  @Field()
  email: string;

  @Prop({ type: String, nullable: true })
  @Field(() => String, { nullable: true })
  fullName?: string;

  @Prop({ type: String, select: false })
  @HideField()
  password: string;

  @Prop({ required: false })
  @Field(() => String, { nullable: true })
  avatar?: string;

  @Prop({ type: String, enum: Object.values(RoleType), default: RoleType.USER })
  @Field(() => String, { nullable: true, defaultValue: RoleType.USER })
  role: RoleType;

  @Prop({ type: String, select: false, required: false })
  @HideField()
  currentHashedRefreshToken?: string;

  @Prop({ type: Date, default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 'text', email: 'text' });

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// Pre Save Hooks
UserSchema.pre<User>('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await argon2.hash(this.password);
    }
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.pre<User>('save', function (next) {
  if (this.email && !emailRegex.test(this.email)) {
    next(new Error('Invalid email address'));
  } else {
    next();
  }
});

UserSchema.pre<User>('save', function (next) {
  if (this.isModified('username')) {
    this.username = slugify.default(this.username, { lower: true });
  }
  next();
});

UserSchema.pre<User>('save', function (next) {
  if (this.username && !this.fullName) {
    this.fullName = this.username;
  }
  next();
});
