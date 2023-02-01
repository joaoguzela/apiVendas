import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
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

    const productExist = await productsRepository.findOne(id);

    if (!productExist) {
      throw new AppError('Product not found');
    }

    const productNameExist = await productsRepository.findByName(name);

    if (productNameExist) {
      throw new AppError('There is already one product with this name');
    }

    productExist.name = name;
    productExist.price = price;
    productExist.quantity = quantity;
    productExist.total = price * quantity;

    await productsRepository.save(productExist);

    return productExist;
  }
}
