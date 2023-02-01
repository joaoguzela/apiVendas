import { Router } from 'express';
import ProductsController from '@modules/products/controllers/ProductsController';
const productsRouter = Router();

const postProducts = new ProductsController();

productsRouter.post('/', postProducts.create);

export default productsRouter;
