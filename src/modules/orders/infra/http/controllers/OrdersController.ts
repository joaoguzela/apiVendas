import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateOrderService from '../../../services/CreateOrderService';
import ShowOrderService from '../../../services/ShowOrderService';

export default class OrdersController {
  public async show(
    request: Request,
    response: Response,
  ): Promise<Response | undefined> {
    const { id } = request.params;
    const showOrder = container.resolve(ShowOrderService);
    const order = await showOrder.execute({ id });
    return response.json(order);
  }

  public async create(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const { customer_id, products } = request.body;
      const createOrder = new CreateOrderService();

      const order = await createOrder.execute({ customer_id, products });

      return response.json(order);
    } catch (err) {
      next(err);
    }
  }
}
