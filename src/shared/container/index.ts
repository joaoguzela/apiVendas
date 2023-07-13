import { container } from 'tsyringe';

import { OrdersRepository } from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { ICustomerRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { IProductRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { ProductRepository } from '@modules/products/infra/typeorm/repositories/ProductsRepository';

container.registerSingleton<ICustomerRepository>(
  'CustomersRepository',
  CustomersRepository,
);

container.registerSingleton<IProductRepository>(
  'ProductRepository',
  ProductRepository,
);

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);
