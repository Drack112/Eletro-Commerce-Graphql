import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AuthToken = {
  __typename?: 'AuthToken';
  accessToken?: Maybe<Scalars['String']['output']>;
  refreshToken?: Maybe<Scalars['String']['output']>;
};

export type AuthTokenResponse = {
  __typename?: 'AuthTokenResponse';
  authToken?: Maybe<AuthToken>;
  user?: Maybe<User>;
};

export type CategoryBrands = {
  __typename?: 'CategoryBrands';
  brands: Array<Scalars['String']['output']>;
  category: Scalars['String']['output'];
};

export type ChangePasswordInput = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type CreateOrderInput = {
  orderItems: Array<OrderItemInput>;
  paymentMethod: Scalars['String']['input'];
  paymentResult: PaymentResultInput;
  shippingAddress: ShippingAddressInput;
  shippingPrice: Scalars['Float']['input'];
  taxPrice: Scalars['Float']['input'];
  totalPrice: Scalars['Float']['input'];
};

export type CreateProductInput = {
  brand: Scalars['String']['input'];
  category: Scalars['String']['input'];
  countInStock?: InputMaybe<Scalars['Int']['input']>;
  description: Scalars['String']['input'];
  image?: Scalars['String']['input'];
  name: Scalars['String']['input'];
  numReviews?: InputMaybe<Scalars['Int']['input']>;
  price: Scalars['Float']['input'];
};

export type CreateReviewProductInput = {
  comment: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
};

export type LoginUserInput = {
  password: Scalars['String']['input'];
  usernameOrEmail: Scalars['String']['input'];
};

export type MessageError = {
  __typename?: 'MessageError';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  activate: AuthTokenResponse;
  adminCreateProduct: Product;
  adminDeleteProduct: Scalars['Boolean']['output'];
  adminDeleteUserById: Scalars['Boolean']['output'];
  adminSetDeliveryOrder: Order;
  adminUpdateProduct: Product;
  adminUpdateUserById: UserResponse;
  autoRefresh: AuthTokenResponse;
  changePassword: UserResponse;
  createOrder: Order;
  forgotPassword: TokenResponse;
  login: AuthTokenResponse;
  logout: Scalars['Boolean']['output'];
  payOrder: Order;
  refresh: AuthTokenResponse;
  register: TokenResponse;
  resetPassword: UserResponse;
  reviewProduct: Product;
  updateProfile: UserResponse;
};


export type MutationActivateArgs = {
  token: Scalars['String']['input'];
};


export type MutationAdminCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationAdminDeleteProductArgs = {
  _id: Scalars['String']['input'];
};


export type MutationAdminDeleteUserByIdArgs = {
  _id: Scalars['String']['input'];
};


export type MutationAdminSetDeliveryOrderArgs = {
  _id: Scalars['String']['input'];
};


export type MutationAdminUpdateProductArgs = {
  _id: Scalars['String']['input'];
  input: CreateProductInput;
};


export type MutationAdminUpdateUserByIdArgs = {
  _id: Scalars['String']['input'];
  input: UpdateUserInput;
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginUserInput;
};


export type MutationPayOrderArgs = {
  _id: Scalars['String']['input'];
  paymentResult: PaymentResultInput;
};


export type MutationRegisterArgs = {
  input: RegisterUserInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationReviewProductArgs = {
  input: CreateReviewProductInput;
  productId: Scalars['String']['input'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type Order = {
  __typename?: 'Order';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  isDelivered: Scalars['Boolean']['output'];
  isPaid: Scalars['Boolean']['output'];
  orderItems: Array<OrderItem>;
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  paymentMethod: Scalars['String']['output'];
  paymentResult: PaymentResult;
  shippingAddress: ShippingAddress;
  shippingPrice: Scalars['Float']['output'];
  taxPrice: Scalars['Float']['output'];
  totalPrice: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  product: Product;
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type OrderItemInput = {
  price: Scalars['Float']['input'];
  product: ProductInput;
  quantity: Scalars['Int']['input'];
};

export type PaginatedOrder = {
  __typename?: 'PaginatedOrder';
  count: Scalars['Int']['output'];
  orders: Array<Order>;
};

export type PaginatedProduct = {
  __typename?: 'PaginatedProduct';
  count: Scalars['Int']['output'];
  products: Array<Product>;
};

export type PaginatedUser = {
  __typename?: 'PaginatedUser';
  count: Scalars['Int']['output'];
  users: Array<User>;
};

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type PaymentResult = {
  __typename?: 'PaymentResult';
  _id: Scalars['ID']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PaymentResultInput = {
  email: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type Product = {
  __typename?: 'Product';
  _id: Scalars['ID']['output'];
  brand: Scalars['String']['output'];
  category: Scalars['String']['output'];
  countInStock: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  image: Scalars['String']['output'];
  name: Scalars['String']['output'];
  numReviews: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  rating: Scalars['Int']['output'];
  reviews: Array<Review>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type ProductInput = {
  _id: Scalars['ID']['input'];
  brand: Scalars['String']['input'];
  category: Scalars['String']['input'];
  countInStock?: Scalars['Int']['input'];
  description: Scalars['String']['input'];
  image: Scalars['String']['input'];
  name: Scalars['String']['input'];
  numReviews?: Scalars['Int']['input'];
  price: Scalars['Float']['input'];
  rating?: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  adminGetOrders: PaginatedOrder;
  adminGetUserByEmail: UserResponse;
  adminGetUserById: UserResponse;
  adminGetUserByUsername: UserResponse;
  adminSearchUsers: PaginatedUser;
  allCategories: Array<Scalars['String']['output']>;
  brandsByCategory: Array<Scalars['String']['output']>;
  categoryBrands: Array<CategoryBrands>;
  findProductById: Product;
  latestProducts: Array<Product>;
  me: UserResponse;
  myOrders: PaginatedOrder;
  orderById: Order;
  products: PaginatedProduct;
  productsByBrand: PaginatedProduct;
  productsByCategory: PaginatedProduct;
  productsOfBrandByCategory: PaginatedProduct;
  queryProducts: PaginatedProduct;
  topProducts: Array<Product>;
};


export type QueryAdminGetOrdersArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryAdminGetUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryAdminGetUserByIdArgs = {
  _id: Scalars['String']['input'];
};


export type QueryAdminGetUserByUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QueryAdminSearchUsersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  q: Scalars['String']['input'];
};


export type QueryBrandsByCategoryArgs = {
  category: Scalars['String']['input'];
};


export type QueryFindProductByIdArgs = {
  _id: Scalars['String']['input'];
};


export type QueryLatestProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyOrdersArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryOrderByIdArgs = {
  _id: Scalars['String']['input'];
};


export type QueryProductsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProductsByBrandArgs = {
  brand: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProductsByCategoryArgs = {
  category: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryProductsOfBrandByCategoryArgs = {
  brand: Scalars['String']['input'];
  category: Scalars['String']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryQueryProductsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  q: Scalars['String']['input'];
};


export type QueryTopProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type RegisterUserInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  fullName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Review = {
  __typename?: 'Review';
  _id: Scalars['ID']['output'];
  comment: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  rating: Scalars['Int']['output'];
  reviewerName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type ShippingAddress = {
  __typename?: 'ShippingAddress';
  _id: Scalars['ID']['output'];
  address: Scalars['String']['output'];
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  postalCode: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ShippingAddressInput = {
  address: Scalars['String']['input'];
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
};

export type TokenResponse = {
  __typename?: 'TokenResponse';
  token?: Maybe<Scalars['String']['output']>;
};

export type UpdateProfileInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  fullName?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<MessageError>;
  user?: Maybe<User>;
};

export type RegularUserFragment = { __typename?: 'User', _id: string, username: string, email: string, fullName?: string | null, avatar?: string | null, role?: string | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserResponse', user?: { __typename?: 'User', _id: string, username: string, email: string, fullName?: string | null, avatar?: string | null, role?: string | null } | null, error?: { __typename?: 'MessageError', message: string } | null } };

export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  _id
  username
  email
  fullName
  avatar
  role
}
    `;
export const MeDocument = gql`
    query Me {
  me {
    user {
      ...RegularUser
    }
    error {
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;