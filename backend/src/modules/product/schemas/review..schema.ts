import {
  Field,
  ObjectType,
  Int,
  ID,
  GraphQLISODateTime,
} from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { User } from 'src/modules/users/user.schema';

@Schema()
@ObjectType()
export class Review extends Document {
  @Field(() => ID)
  _id: string;

  @Prop({ type: String, required: true })
  @Field()
  reviewerName: string;

  @Prop({ type: Number, required: true, default: 0 })
  @Field(() => Int)
  rating: number;

  @Prop({ type: String, required: true })
  @Field()
  comment: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  @Field(() => User)
  user: User;

  @Prop({ type: Date, default: Date.now })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

export const commentRegex = /^.{6,}$/; // Min length 6 characters

ReviewSchema.pre<Review>('save', async function (next) {
  try {
    if (!this.comment) return next();
    const isValid = commentRegex.test(this.comment);
    if (isValid) return next();
    return next(new Error('Comment must be 6 character minimum'));
  } catch (error) {
    return next(error);
  }
});
