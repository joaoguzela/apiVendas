import { Router } from 'express';
import ProductsController from '@modules/products/infra/http/controllers/ProductsController';
import { celebrate, Joi, Segments } from 'celebrate';
const productsRouter = Router();

const postProducts = new ProductsController();
productsRouter.get('/', postProducts.list);

productsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2),
      quantity: Joi.number().required(),
    },
  }),
  postProducts.create,
);

productsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  postProducts.show,
);

productsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  postProducts.update,
);

productsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2),
      quantity: Joi.number().required(),
    },
  }),
  postProducts.delete,
);

export default productsRouter;
