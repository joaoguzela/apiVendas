import { NextFunction, Request, Response } from 'express';
import CreateProductService from '@modules/products/services/CreateProductService';
import UpdateProductService from '@modules/products/services/UpdateProductService';
import ListProductService from '@modules/products/services/ListProductService';
import ShowProductService from '@modules/products/services/ShowProductService';
import DeleteProductService from '@modules/products/services/DeleteProductService';

export default class ProductsController {
  public async create(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const createProduct = new CreateProductService();
      const { name, price, quantity } = request.body;
      const product = await createProduct.execute({
        name,
        price,
        quantity,
      });
      return response.json(product);
    } catch (err) {
      next(err);
    }
  }

  public async update(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const updateProduct = new UpdateProductService();
      const { name, price, quantity } = request.body;
      const { id } = request.params;
      const product = await updateProduct.execute({
        id,
        name,
        price,
        quantity,
      });
      return response.json(product);
    } catch (err) {
      next(err);
    }
  }
  public async list(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const ListProduct = new ListProductService();
      const product = await ListProduct.execute();
      return response.json(product);
    } catch (err) {
      next(err);
    }
  }
  public async show(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const showProduct = new ShowProductService();
      const { id } = request.params;

      const product = await showProduct.execute({
        id,
      });
      return response.json(product);
    } catch (err) {
      next(err);
    }
  }

  public async delete(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const showProduct = new DeleteProductService();
      const { id } = request.params;

      const product = await showProduct.execute({
        id,
      });
      return response.json(product);
    } catch (err) {
      next(err);
    }
  }
}
