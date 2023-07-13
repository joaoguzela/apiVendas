import Product from '@modules/products/infra/typeorm/entities/Product';
import { ICreateProduct } from '../models/ICreateProduct';
import { IProduct } from '../models/IProduct';
import { IUpdateProduct } from '../models/IUpdateProduct';
import { IUpdateStockProduct } from '../models/IUpdateStockProduct';
interface IFindProducts {
  id: string;
}
export interface IProductRepository {
  findByName(name: string): Promise<Product | undefined>;
  findAllByIds(products: IFindProducts[]): Promise<Product[]>;
  create(product: ICreateProduct): Promise<Product>;
  findOne(product_id: string): Promise<Product | undefined>;
  save(product: IUpdateProduct): Promise<Product | undefined>;
  remove(id: string): Promise<void>;
  find(): Promise<Product[] | null>;
  updateStock(products: IUpdateStockProduct[]): Promise<void>;
}
