import { container } from 'tsyringe';

import { OrdersRepository } from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { ICustomerRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { IProductRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { ProductRepository } from '@modules/products/infra/typeorm/repositories/ProductsRepository';

container.registerSingleton<ICustomerRepository>(
  'customersRepository',
  CustomersRepository,
);

container.registerSingleton<IOrdersRepository>(
  'ordersRepository',
  OrdersRepository,
);

container.register<IProductRepository>('productsRepository', ProductRepository);
