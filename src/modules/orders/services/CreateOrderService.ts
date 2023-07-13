import CustomersRepository from '@modules/customers/infra/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/infra/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import { OrdersRepository } from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
interface IProduct {
  id: string;
  quantity: number;
}
interface IRequest {
  customer_id: string;
  products: IProduct[];
}
export default class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const productsRepository = getCustomRepository(ProductRepository);
    const customerRepository = getCustomRepository(CustomersRepository);
    const ordersRepository = getCustomRepository(OrdersRepository);

    const customerExists = await customerRepository.findById(customer_id);

    if (!customerExists) throw new AppError('Client does not exist.');
    const productsExist = await productsRepository.findAllByIds(products);

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
    const order = await ordersRepository.createOrder({
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
    await productsRepository.save(updatedProductQuantity);
    return order;
  }
}