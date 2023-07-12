import Product from '@modules/products/infra/typeorm/entities/Product';
import { ICreateProduct } from '../models/ICreateProduct';
import { IProduct } from '../models/IProduct';
import { IUpdateProduct } from '../models/IUpdateProduct';
interface IFindProducts {
  id: string;
}
export interface IProductRepository {
  findByName(name: string): Promise<IProduct | undefined>;
  findAllByIds(products: IFindProducts[]): Promise<IProduct[]>;
  create(product: ICreateProduct): Promise<IProduct>;
  findOne(product_id: string): Promise<IProduct | undefined>;
  save(product: IUpdateProduct): Promise<IProduct | undefined>;
  remove(product: IProduct): Promise<IProduct | undefined>;
  find(): Promise<IProduct[] | null>;
}
