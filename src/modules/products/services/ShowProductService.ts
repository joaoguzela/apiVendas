import AppError from '@shared/errors/AppError';
import { inject } from 'tsyringe';
import { getCustomRepository } from 'typeorm';
import { IProduct } from '../domain/models/IProduct';
import { IProductRepository } from '../domain/repositories/IProductsRepository';
import Product from '../infra/typeorm/entities/Product';
import { ProductRepository } from '../infra/typeorm/repositories/ProductsRepository';
interface IRequest {
  id: string;
}
export default class ShowProductService {
  private productsRepository: IProductRepository;
  constructor(
    @inject('ProductRepository')
    productRepository: IProductRepository,
  ) {
    this.productsRepository = productRepository;
  }
  public async execute({ id }: IRequest): Promise<IProduct | null> {
    const product = await this.productsRepository.findOne(id);
    if (!product) {
      throw new AppError('Product not found');
    }
    return product;
  }
}
