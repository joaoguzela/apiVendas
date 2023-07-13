import { IProduct } from '@modules/products/domain/models/IProduct';
import { IProductRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { IUpdateProduct } from '@modules/products/domain/models/IUpdateProduct';
import { getRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
interface IFindProducts {
  id: string;
}

export class ProductRepository implements IProductRepository {
  private ormProductRepository: Repository<Product>;
  constructor() {
    this.ormProductRepository = getRepository(Product);
  }
  public async findByName(name: string): Promise<IProduct | undefined> {
    const product = this.ormProductRepository.findOne({
      where: {
        name,
      },
    });
    return await product;
  }
  public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productsIds = products.map(product => product.id);

    const existsProducts = await this.ormProductRepository.find({
      where: { id: In(productsIds) },
    });

    return existsProducts;
  }
  public async create(product: ICreateProduct): Promise<IProduct> {
    const createProduct = this.ormProductRepository.create(product);

    this.ormProductRepository.save(createProduct);

    return createProduct;
  }
  public async findOne(id: string): Promise<IProduct | undefined> {
    const product = this.ormProductRepository.findOne({
      where: { id },
    });
    return product;
  }
  public async save(product: IUpdateProduct): Promise<IProduct> {
    const updateProduct = this.ormProductRepository.save(product);
    return updateProduct;
  }
  public async remove(product: IProduct): Promise<IProduct> {
    const deleteProduct = product as Product;

    const updateProduct = this.ormProductRepository.remove(deleteProduct);

    return updateProduct;
  }
  public async find(): Promise<IProduct[] | null> {
    const ProductList = this.ormProductRepository.find();
    return ProductList;
  }
}
