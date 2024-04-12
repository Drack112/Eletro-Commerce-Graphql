import { Logger } from '@nestjs/common';
import mongoose, { Connection } from 'mongoose';
import { User, UserSchema } from 'src/modules/users/user.schema';
import {
  Product,
  ProductSchema,
} from 'src/modules/product/schemas/product.schema';
import * as dotenv from 'dotenv';
import * as util from 'util';
import * as fs from 'fs';
import { envConfig } from 'src/common/config/env.config';

const readFile = util.promisify(fs.readFile);

let connection: Connection;

const createConnection = async (): Promise<Connection> => {
  dotenv.config();

  try {
    const mongoClient = await mongoose.connect(envConfig().mongoDBUrl, {
      autoIndex: false,
      dbName: 'e-commerce',
    });
    Logger.log('MongoDB connected');
    connection = mongoClient.connection;
    return connection;
  } catch (error) {
    Logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

async function uploadData() {
  try {
    await createConnection();
  } catch (error) {
    Logger.error('Error creating MongoDB connection:', error);
    process.exit(1);
  }

  Logger.log('Start uploading....');

  const UserModel = mongoose.model<User>('users', UserSchema);
  const ProductModel = mongoose.model<Product>('products', ProductSchema);

  try {
    await UserModel.deleteMany();
    await ProductModel.deleteMany();

    const file = process.cwd() + `/src/common/providers/database/data.json`;
    const json = await readFile(file, { encoding: 'utf8' });
    const { users, products } = JSON.parse(json);

    await UserModel.create(users);
    const user = await UserModel.findOne({ username: 'admin1' });

    const customProducts = [];

    const names = [];
    for (const product of products) {
      if (!names.includes(product.name)) {
        names.push(product.name);
        customProducts.push({
          ...product,
          user,
          countInStock: 10,
          price: parseInt(product.price),
          name: product.name || 'Missing',
        });
      }
    }

    await ProductModel.create(customProducts);

    Logger.log('Data created');
  } catch (error) {
    Logger.error('Error uploading data:', error);
  } finally {
    if (connection) {
      await connection.close();
      Logger.log('MongoDB connection closed');
    }
  }
}

Promise.resolve(uploadData()).catch((err) => Logger.error(err));
