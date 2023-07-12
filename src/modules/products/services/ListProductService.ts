import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../infra/typeorm/entities/Product';
import { ProductRepository } from '../infra/typeorm/repositories/ProductsRepository';
import RedisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import { IProduct } from '../domain/models/IProduct';
@injectable()
export default class ListProductService {
  private productsRepository: IProductRepository;

  constructor(
    @inject('ProductRepository')
    productRepository: IProductRepository,
  ) {
    this.productsRepository = productRepository;
  }
  public async execute(): Promise<IProduct[] | null> {
    const redisCache = new RedisCache();

    let products = await redisCache.recover<IProduct[]>(
      'api-vendas-PRODUCT_LIST',
    );
    if (!products) {
      products = await this.productsRepository.find();
      await redisCache.save('api-vendas-PRODUCT_LIST', products);
    }

    return products;
  }
}
