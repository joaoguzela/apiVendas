import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { IProduct } from '../domain/models/IProduct';
import { IProductRepository } from '../domain/repositories/IProductsRepository';

@injectable()
export default class CreateProductService {
  constructor(
    @inject('ProductRepository')
    private productsRepository: IProductRepository,
  ) {}

  public async execute({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct | undefined> {
    try {
      const redisCache = new RedisCache();
      const productExist = await this.productsRepository.findByName(name);

      if (productExist) {
        throw new AppError('There is already one product with this name');
      }

      const product = this.productsRepository.create({
        name,
        price,
        quantity,
      });
      await redisCache.invalidate('api-vendas-PRODUCT_LIST');
      return product;
    } catch (e) {
      throw new AppError(`${e}`);
    }
  }
}
