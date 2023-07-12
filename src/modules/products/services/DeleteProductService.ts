import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';

interface IRequest {
  id: string;
}
@injectable()
export default class DeleteProductService {
  private productsRepository: IProductRepository;
  constructor(
    @inject('ProductRepository')
    productRepository: IProductRepository,
  ) {
    this.productsRepository = productRepository;
  }
  public async execute({ id }: IRequest): Promise<void> {
    const redisCache = new RedisCache();

    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new AppError('Product not found');
    }
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');
    await this.productsRepository.remove(product);
  }
}
