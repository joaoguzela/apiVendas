import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { getCustomRepository, getRepository } from 'typeorm';
import { ICreateProduct } from '../domain/models/ICreateProduct';
import { IProduct } from '../domain/models/IProduct';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import Product from '../infra/typeorm/entities/Product';
import { ProductRepository } from '../infra/typeorm/repositories/ProductsRepository';

@injectable()
export default class CreateProductService {
  private productsRepository: IProductRepository;
  constructor(
    @inject('ProductRepository')
    productRepository: IProductRepository,
  ) {
    this.productsRepository = productRepository;
  }

  public async execute({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct | undefined> {
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
  }
}
