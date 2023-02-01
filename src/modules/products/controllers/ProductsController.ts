import { NextFunction, Request, Response } from 'express';
import { nextTick } from 'process';
import CreateProductService from '../services/CreateProductService';

export default class ProductsController {
  public async create(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const createProduct = new CreateProductService();
      const { name, price, quantity, total } = request.body;
      const product = await createProduct.execute({
        name,
        price,
        quantity,
        total,
      });
      return response.json(product);
    } catch (err) {
      next(err);
    }
  }
}
