import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../infra/typeorm/entities/Product';
import { ProductRepository } from '../infra/typeorm/repositories/ProductsRepository';
interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
export default class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    const redisCache = new RedisCache();

    const productExist = await productsRepository.findOne(id);

    if (!productExist) {
      throw new AppError('Product not found');
    }

    const productNameExist = await productsRepository.findByName(name);

    if (productNameExist && productNameExist.id != id) {
      throw new AppError('There is already one product with this name');
    }
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');

    productExist.name = name;
    productExist.price = price;
    productExist.quantity = quantity;
    await productsRepository.save(productExist);

    return productExist;
  }
}
