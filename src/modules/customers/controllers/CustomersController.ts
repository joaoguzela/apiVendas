import { NextFunction, Request, Response } from 'express';
import CreateCustomerService from '../services/CreateCustomerService';
import DeleteCustomerService from '../services/DeleteCustomerService';
import ListCustomerService from '../services/ListCustomerService';
import ShowCustomerService from '../services/showCustomerService';
import UpdateCustomerService from '../services/UpdateCustomerService';

export default class CustomersController {
  public async create(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<Response | undefined> {
    try {
      const createCustomer = new CreateCustomerService();
      const { name, email } = request.body;
      const customer = await createCustomer.execute({
        name,
        email,
      });
      return response.json(customer);
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
      const updateCustomer = new UpdateCustomerService();
      const { name, email } = request.body;
      const { id } = request.params;
      const customer = await updateCustomer.execute({
        id,
        name,
        email,
      });
      return response.json(customer);
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
      const ListCustomers = new ListCustomerService();
      const customers = await ListCustomers.execute();
      return response.json(customers);
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
      const showCustomer = new ShowCustomerService();
      const { id } = request.params;

      const customer = await showCustomer.execute({
        id,
      });
      return response.json(customer);
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
      const deleteCustomer = new DeleteCustomerService();
      const { id } = request.params;

      const customer = await deleteCustomer.execute({
        id,
      });
      return response.json(customer);
    } catch (err) {
      next(err);
    }
  }
}
