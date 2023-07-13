import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IProduct } from '../domain/models/IProduct';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { IProductRepository } from '../domain/repositories/IProductsRepository';

@injectable()
export default class UpdateProductService {
  constructor(
    @inject('ProductRepository')
    private productsRepository: IProductRepository,
  ) {}
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProduct): Promise<IProduct> {
    try {
      const redisCache = new RedisCache();

      const productExist = await this.productsRepository.findOne(id);

      if (!productExist) {
        throw new AppError('Product not found');
      }

      const productNameExist = await this.productsRepository.findByName(name);

      if (productNameExist && productNameExist.id != id) {
        throw new AppError('There is already one product with this name');
      }
      await redisCache.invalidate('api-vendas-PRODUCT_LIST');

      productExist.name = name;
      productExist.price = price;
      productExist.quantity = quantity;
      await this.productsRepository.save(productExist);

      return productExist;
    } catch (err) {
      throw new AppError(`${err}`);
    }
  }
}
