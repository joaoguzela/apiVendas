import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
interface IRequest {
  name: string;
  price: number;
  quantity: number;
  total: number;
}
export default class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    const productExist = await productsRepository.findByName(name);

    if (productExist) {
      throw new AppError('There is already one product with this name');
    }
    let total = quantity * price;
    const product = productsRepository.create({
      name,
      price,
      quantity,
      total,
    });
    await productsRepository.save(product);
    return product;
  }
}
