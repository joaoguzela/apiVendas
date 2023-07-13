import { ProductRepository } from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import { ICustomerRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { inject, injectable } from 'tsyringe';
import { IRequestCreateOrder } from '../domain/models/IRequestCreateOrder';
import { IOrder } from '../domain/models/IOrder';
import RedisCache from '@shared/cache/RedisCache';

@injectable()
export default class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomerRepository,

    @inject('ProductRepository')
    private productsRepository: ProductRepository,
  ) {}

  public async execute({
    customer_id,
    products,
  }: IRequestCreateOrder): Promise<IOrder> {
    try {
      const redisCache = new RedisCache();

      const customerExists = await this.customersRepository.findById(
        customer_id,
      );

      if (!customerExists) throw new AppError('Client does not exist.');
      const productsExist = await this.productsRepository.findAllByIds(
        products,
      );
      if (!productsExist.length) {
        throw new AppError('Could not find any products with the given ids.');
      }
      const existProductsIds = productsExist.map(product => product.id);
      const checkInexistentProducts = products.filter(
        product => !existProductsIds.includes(product.id),
      );
      if (checkInexistentProducts.length) {
        throw new AppError(
          `Could not find any product ${checkInexistentProducts[0].id} with the given ids.`,
        );
      }

      const quantityAvailable = products.filter(
        product =>
          productsExist.filter(p => p.id === product.id)[0].quantity <
          product.quantity,
      );

      if (quantityAvailable.length) {
        throw new AppError(
          `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id} `,
        );
      }
      const serializedProducts = products.map(product => ({
        product_id: product.id,
        quantity: product.quantity,
        price: productsExist.filter(p => p.id == product.id)[0].price,
      }));
      const order = await this.ordersRepository.create({
        customer: customerExists,
        products: serializedProducts,
      });

      const { order_products } = order;
      const updatedProductQuantity = order_products.map(product => ({
        id: product.product_id,
        quantity:
          productsExist.filter(p => p.id === product.product_id)[0].quantity -
          product.quantity,
      }));
      await this.productsRepository.updateStock(updatedProductQuantity);
      await this.productsRepository.remove(
        updatedProductQuantity.filter(p => p.quantity === 0)[0].id,
      );
      await redisCache.invalidate('api-vendas-PRODUCT_LIST');
      return order;
    } catch (err) {
      throw new AppError(JSON.stringify(err));
    }
  }
}
