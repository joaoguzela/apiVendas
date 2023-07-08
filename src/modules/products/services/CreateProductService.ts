import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
interface IRequest {
  name: string;
  price: number;
  quantity: number;
}
export default class CreateProductService {
  public async execute({
    name,
    price,
    quantity,
  }: IRequest): Promise<Product | undefined> {
    const productsRepository = getCustomRepository(ProductRepository);
    const redisCache = new RedisCache();
    const productExist = await productsRepository.findByName(name);

    if (productExist) {
      throw new AppError('There is already one product with this name');
    }

    const product = productsRepository.create({
      name,
      price,
      quantity,
    });
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');
    await productsRepository.save(product);
    return product;
  }
}
