import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import { IProduct } from '../domain/models/IProduct';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import Product from '../infra/typeorm/entities/Product';
import { ProductRepository } from '../infra/typeorm/repositories/ProductsRepository';
@injectable()
export default class UpdateProductService {
  private productsRepository: IProductRepository;
  constructor(
    @inject('ProductRepository')
    productsRepository: IProductRepository,
  ) {
    this.productsRepository = productsRepository;
  }
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IProduct): Promise<IProduct> {
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
  }
}
